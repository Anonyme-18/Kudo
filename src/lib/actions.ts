"use server";

import { createHmac, timingSafeEqual, randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "./db";
import { waitlist } from "./db/schema";
import { MAX_COUNTED_REFERRALS, POINTS_PER_REFERRAL } from "./constants";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const codeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/);
const ADMIN_COOKIE = "kudo_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

export type RankedEntry = {
  id: string;
  email: string;
  code: string;
  referredBy: string | null;
  joinedAt: Date;
  referrals: number;
  countedReferrals: number;
  points: number;
  position: number;
};

export type PublicRankedEntry = Omit<RankedEntry, "email"> & { maskedEmail: string };

function maskEmail(email: string) {
  const [user = "", domain = ""] = email.split("@");
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(2, user.length - visible.length))}@${domain}`;
}

function rankEntries(entries: (typeof waitlist.$inferSelect)[]): RankedEntry[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.referredBy) counts.set(entry.referredBy, (counts.get(entry.referredBy) ?? 0) + 1);
  }
  return entries
    .map((entry) => {
      const referrals = counts.get(entry.code) ?? 0;
      const countedReferrals = Math.min(referrals, MAX_COUNTED_REFERRALS);
      return {
        ...entry,
        referrals,
        countedReferrals,
        points: countedReferrals * POINTS_PER_REFERRAL,
        position: 0,
      };
    })
    .sort((a, b) => b.points - a.points || a.joinedAt.getTime() - b.joinedAt.getTime())
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function getRankedEntries(): Promise<PublicRankedEntry[]> {
  const rows = rankEntries(await db.select().from(waitlist));
  return rows.map(({ email, ...entry }) => ({ ...entry, maskedEmail: maskEmail(email) }));
}

async function isAdminSessionValid() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  const secret = process.env["ADMIN_PASSWORD"];
  if (!secret || !expires || !signature || Number(expires) < Math.floor(Date.now() / 1000))
    return false;
  const expected = createHmac("sha256", secret).update(expires).digest("hex");
  return (
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}

export async function getAdminRankedEntries(): Promise<RankedEntry[]> {
  if (!(await isAdminSessionValid())) throw new Error("Unauthorized");
  return rankEntries(await db.select().from(waitlist));
}

export async function joinWaitlist(emailInput: string, refCodeInput?: string | null) {
  const email = emailSchema.parse(emailInput);
  const refCode = refCodeInput ? codeSchema.parse(refCodeInput) : null;
  const existing = await db.query.waitlist.findFirst({ where: eq(waitlist.email, email) });
  if (existing)
    return { success: true as const, code: existing.code, alreadyRegistered: true as const };
  const sponsor = refCode
    ? await db.query.waitlist.findFirst({ where: eq(waitlist.code, refCode) })
    : null;
  const code = await generateUniqueCode(email);
  try {
    await db.insert(waitlist).values({
      email,
      code,
      referredBy: sponsor && sponsor.email !== email ? sponsor.code : null,
    });
  } catch (error) {
    const concurrent = await db.query.waitlist.findFirst({ where: eq(waitlist.email, email) });
    if (!concurrent) throw error;
    return { success: true as const, code: concurrent.code, alreadyRegistered: true as const };
  }
  revalidatePath("/");
  revalidatePath("/classement");
  revalidatePath("/parrainage");
  revalidatePath("/admin");
  return { success: true as const, code, alreadyRegistered: false as const };
}

async function generateUniqueCode(email: string) {
  const base = (email.split("@")[0] ?? "user")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = `${base}${randomInt(10, 100)}`;
    if (!(await db.query.waitlist.findFirst({ where: eq(waitlist.code, code) }))) return code;
  }
  throw new Error("Unable to generate a unique referral code");
}

export async function verifyAdmin(passwordInput: string) {
  const password = z.string().min(1).max(256).parse(passwordInput);
  const secret = process.env["ADMIN_PASSWORD"];
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  const provided = Buffer.from(password);
  const expected = Buffer.from(secret);
  const valid = provided.length === expected.length && timingSafeEqual(provided, expected);
  if (!valid) return false;
  const expires = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS);
  const signature = createHmac("sha256", secret).update(expires).digest("hex");
  (await cookies()).set(ADMIN_COOKIE, `${expires}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return true;
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE);
}
