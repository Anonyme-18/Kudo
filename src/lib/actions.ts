"use server";

import { db } from "./db";
import { waitlist } from "./db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { POINTS_PER_REFERRAL, MAX_COUNTED_REFERRALS } from "./constants";

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

export async function getRankedEntries(): Promise<RankedEntry[]> {
  const entries = await db.select().from(waitlist);
  
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (!e.referredBy) continue;
    counts.set(e.referredBy, (counts.get(e.referredBy) ?? 0) + 1);
  }

  const ranked = entries.map((e) => {
    const referrals = counts.get(e.code) ?? 0;
    const countedReferrals = Math.min(referrals, MAX_COUNTED_REFERRALS);
    return {
      ...e,
      referrals,
      countedReferrals,
      points: countedReferrals * POINTS_PER_REFERRAL,
      position: 0,
    };
  });

  return ranked
    .sort((a, b) => b.points - a.points || a.joinedAt.getTime() - b.joinedAt.getTime())
    .map((e, i) => ({ ...e, position: i + 1 }));
}

export async function joinWaitlist(email: string, refCode?: string | null) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if already exists
  const existing = await db.query.waitlist.findFirst({
    where: eq(waitlist.email, normalizedEmail),
  });

  if (existing) {
    return { success: true, code: existing.code, alreadyRegistered: true };
  }

  let sponsor = null;
  if (refCode) {
    sponsor = await db.query.waitlist.findFirst({
      where: eq(waitlist.code, refCode.toUpperCase()),
    });
  }

  const code = await generateUniqueCode(normalizedEmail);

  await db.insert(waitlist).values({
    email: normalizedEmail,
    code,
    referredBy: sponsor && sponsor.email !== normalizedEmail ? sponsor.code : null,
  });

  revalidatePath("/");
  revalidatePath("/classement");
  revalidatePath("/parrainage");
  revalidatePath("/admin");

  return { success: true, code, alreadyRegistered: false };
}

async function generateUniqueCode(email: string) {
  const base = (email.split("@")[0] ?? "user")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  
  let code = "";
  let isUnique = false;
  while (!isUnique) {
    code = base + Math.floor(10 + Math.random() * 89);
    const existing = await db.query.waitlist.findFirst({
      where: eq(waitlist.code, code),
    });
    if (!existing) isUnique = true;
  }
  return code;
}

export async function verifyAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return password === adminPassword;
}
