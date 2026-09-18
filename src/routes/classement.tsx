"use client";

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ImmersiveCard } from "@/components/ImmersiveCard";
import { getRankedEntries, type PublicRankedEntry } from "@/lib/actions";
import { MAX_COUNTED_REFERRALS, POINTS_PER_REFERRAL } from "@/lib/constants";

export const Route = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Classement de la file d'attente Kudo" },
      {
        name: "description",
        content:
          "Découvre le classement en direct de la liste d'attente Kudo : points de parrainage, filleuls validés et positions recalculées à chaque inscription.",
      },
      { property: "og:title", content: "Classement de la file d'attente Kudo" },
      {
        property: "og:description",
        content: "Points, filleuls et positions en direct. Invite tes camarades pour remonter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClassementPage,
});

export default function ClassementPage() {
  const [rows, setRows] = useState<PublicRankedEntry[]>([]);
  const [me, setMe] = useState<PublicRankedEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getRankedEntries().then((data) => {
      setRows(data);
      const myCode = localStorage.getItem("kudo.waitlist.me");
      if (myCode) {
        setMe(data.find((r) => r.code === myCode) || null);
      }
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.maskedEmail.toLowerCase().includes(q) || r.code.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const podium = rows.slice(0, 3);

  return (
    <main className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
        style={{ background: "var(--gradient-veil)" }}
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à l'accueil
          </Link>
          <Link
            href="/parrainage"
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            Mon parrainage
          </Link>
        </div>

        <p className="mt-12 text-xs tracking-[0.3em] text-primary uppercase">Classement</p>
        <h1 className="text-display mt-4 max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)]">
          La file, <span className="italic">en direct</span>.
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          {POINTS_PER_REFERRAL} points par filleul validé, {MAX_COUNTED_REFERRALS} filleuls
          comptabilisés au maximum. À égalité, l'ancienneté d'inscription départage. Les emails sont
          partiellement masqués.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {podium.map((r, i) => (
            <ImmersiveCard
              key={r.id}
              delay={i * 0.08}
              className={`surface-card rounded-2xl p-6 ${i === 0 ? "md:-translate-y-2" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-display text-5xl">#{r.position}</span>
                  {i === 0 && <Crown className="size-5 text-primary" />}
                </div>
                <p className="mt-4 truncate text-sm">{r.maskedEmail}</p>
                <p className="mt-1 font-mono text-xs text-primary">
                  {r.points} pts · {r.referrals} filleul{r.referrals > 1 ? "s" : ""}
                </p>
              </div>
            </ImmersiveCard>
          ))}
        </div>

        {me && (
          <div className="surface-card mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="size-4 text-primary" />
              <p className="text-sm">
                Ta place :{" "}
                <span className="text-display text-2xl text-primary">#{me.position}</span> sur{" "}
                {rows.length} inscrits
              </p>
            </div>
            <Link
              href="/parrainage"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Gagner des places
            </Link>
          </div>
        )}

        <div className="mt-10 flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un email ou un code de parrainage"
            aria-label="Rechercher dans le classement"
            className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-xs tracking-widest text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3 text-right">Filleuls</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
                  className={`border-t border-border transition-colors hover:bg-card/70 ${
                    me && r.id === me.id ? "bg-primary/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-primary">{r.position}</td>
                  <td className="px-4 py-3">{r.maskedEmail}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.code}</td>
                  <td className="px-4 py-3 text-right">{r.referrals}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.points}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Aucun résultat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
