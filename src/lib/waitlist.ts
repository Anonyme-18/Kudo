/**
 * Waitlist 100% front-end (localStorage). Aucune donnée n'est envoyée à un serveur.
 *
 * Règles de file d'attente :
 *  - Chaque filleul validé = +10 points (max 10 filleuls comptabilisés, soit 100 points).
 *  - Classement = points décroissants, puis ancienneté d'inscription croissante.
 *  - Le calcul est recalculé intégralement à chaque lecture => exact et vérifiable.
 *  - Auto-parrainage impossible (même code ou même email).
 *  - Un email = une seule entrée (ré-inscription = on retrouve la place existante).
 */

export const POINTS_PER_REFERRAL = 10;
export const MAX_COUNTED_REFERRALS = 10;

export type Entry = {
  id: string;
  email: string;
  code: string;
  referredBy: string | null;
  joinedAt: number;
};

export type RankedEntry = Entry & {
  referrals: number;
  countedReferrals: number;
  points: number;
  position: number;
};

const KEY = "kudo.waitlist.v1";
const ME_KEY = "kudo.waitlist.me";

const SEED: Entry[] = [
  { id: "s1", email: "aminata.d@ucad.sn", code: "AMIN4T", referredBy: null, joinedAt: 1 },
  { id: "s2", email: "kossi.a@univ-lome.tg", code: "KOSSI7", referredBy: null, joinedAt: 2 },
  { id: "s3", email: "chidi.o@unilag.ng", code: "CHIDI2", referredBy: "AMIN4T", joinedAt: 3 },
  { id: "s4", email: "fatou.b@um5.ma", code: "FATOU9", referredBy: "AMIN4T", joinedAt: 4 },
  { id: "s5", email: "eric.m@ug.edu.gh", code: "ERICM5", referredBy: "KOSSI7", joinedAt: 5 },
  { id: "s6", email: "sena.k@univ-lome.tg", code: "SENAK1", referredBy: null, joinedAt: 6 },
  { id: "s7", email: "mariam.t@uac.bj", code: "MARIA3", referredBy: "CHIDI2", joinedAt: 7 },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function readAll(): Entry[] {
  if (!isBrowser()) return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Entry[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

function writeAll(entries: Entry[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

export function rank(entries: Entry[]): RankedEntry[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (!e.referredBy) continue;
    const sponsor = entries.find((x) => x.code === e.referredBy);
    if (!sponsor || sponsor.id === e.id) continue; // auto-parrainage ignoré
    counts.set(sponsor.code, (counts.get(sponsor.code) ?? 0) + 1);
  }

  return entries
    .map((e) => {
      const referrals = counts.get(e.code) ?? 0;
      const countedReferrals = Math.min(referrals, MAX_COUNTED_REFERRALS);
      return {
        ...e,
        referrals,
        countedReferrals,
        points: countedReferrals * POINTS_PER_REFERRAL,
        position: 0,
      };
    })
    .sort((a, b) => b.points - a.points || a.joinedAt - b.joinedAt)
    .map((e, i) => ({ ...e, position: i + 1 }));
}

function makeCode(email: string, entries: Entry[]) {
  const base = (email.split("@")[0] ?? "user")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  let code = "";
  do {
    code = base + Math.floor(10 + Math.random() * 89);
  } while (entries.some((e) => e.code === code));
  return code;
}

export type JoinResult = {
  entry: RankedEntry;
  alreadyRegistered: boolean;
  selfReferralBlocked: boolean;
};

export function join(emailRaw: string, refCodeRaw?: string | null): JoinResult {
  const email = emailRaw.trim().toLowerCase();
  const refCode = refCodeRaw ? refCodeRaw.trim().toUpperCase() : null;
  const entries = readAll();

  const existing = entries.find((e) => e.email === email);
  if (existing) {
    saveMe(existing.code);
    return {
      entry: rank(entries).find((e) => e.id === existing.id)!,
      alreadyRegistered: true,
      selfReferralBlocked: false,
    };
  }

  const sponsor = refCode ? entries.find((e) => e.code === refCode) : undefined;
  const selfReferralBlocked = Boolean(sponsor && sponsor.email === email);

  const entry: Entry = {
    id: `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    email,
    code: makeCode(email, entries),
    referredBy: sponsor && !selfReferralBlocked ? sponsor.code : null,
    joinedAt: Date.now(),
  };

  const next = [...entries, entry];
  writeAll(next);
  saveMe(entry.code);

  return {
    entry: rank(next).find((e) => e.id === entry.id)!,
    alreadyRegistered: false,
    selfReferralBlocked,
  };
}

export function saveMe(code: string) {
  if (isBrowser()) window.localStorage.setItem(ME_KEY, code);
}

export function loadMe(): RankedEntry | null {
  if (!isBrowser()) return null;
  const code = window.localStorage.getItem(ME_KEY);
  if (!code) return null;
  return rank(readAll()).find((e) => e.code === code) ?? null;
}

export function clearMe() {
  if (isBrowser()) window.localStorage.removeItem(ME_KEY);
}

export function totalCount() {
  return readAll().length;
}

export function toCsv(rows: RankedEntry[]) {
  const head = ["position", "email", "code_parrainage", "parraine_par", "filleuls", "points", "date"];
  const body = rows.map((r) =>
    [
      r.position,
      r.email,
      r.code,
      r.referredBy ?? "",
      r.referrals,
      r.points,
      new Date(r.joinedAt).toISOString(),
    ].join(","),
  );
  return [head.join(","), ...body].join("\n");
}
