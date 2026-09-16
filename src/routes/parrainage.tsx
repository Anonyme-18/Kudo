"use client";

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Share2, Sparkles, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import { ImmersiveCard } from "@/components/ImmersiveCard";
import { Button } from "@/components/ui/button";
import { getRankedEntries, joinWaitlist, type RankedEntry } from "@/lib/actions";
import { POINTS_PER_REFERRAL, MAX_COUNTED_REFERRALS } from "@/lib/constants";

export const Route = createFileRoute("/parrainage")({
  head: () => ({
    meta: [
      { title: "Parrainage Kudo — Fais remonter ta place dans la file" },
      {
        name: "description",
        content:
          "Ton lien unique, tes points, ta progression : découvre comment chaque camarade invité te fait gagner des places dans la liste d'attente Kudo.",
      },
      { property: "og:title", content: "Parrainage Kudo — Remonte la file d'attente" },
      {
        property: "og:description",
        content: "10 points par filleul validé, jusqu'à 10 filleuls. Classement recalculé en direct.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParrainagePage,
});

export default function ParrainagePage() {
  const [me, setMe] = useState<RankedEntry | null>(null);
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getRankedEntries();
    setTotal(data.length);
    const myCode = localStorage.getItem("kudo.waitlist.me");
    if (myCode) {
      setMe(data.find(r => r.code === myCode) || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const link = useMemo(() => {
    if (!me) return "";
    if (typeof window === "undefined") return `/?ref=${me.code}`;
    return `${window.location.origin}/?ref=${me.code}`;
  }, [me]);

  const nextTarget = useMemo(() => {
    if (!me) return null;
    const rows = rank(readAll());
    return rows.find((r) => r.position === me.position - 1) ?? null;
  }, [me]);

  return (
    <main className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: "var(--gradient-veil)" }}
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-16">
        <PageNav />

        <p className="mt-12 text-xs tracking-[0.3em] text-primary uppercase">Parrainage</p>
        <h1 className="text-display mt-4 max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)]">
          Chaque camarade invité te <span className="italic">rapproche</span> du lancement.
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          {POINTS_PER_REFERRAL} points par filleul validé, jusqu'à {MAX_COUNTED_REFERRALS} filleuls
          comptabilisés. Le classement est recalculé intégralement à chaque inscription : points
          décroissants, puis ancienneté.
        </p>

        {me ? (
          <div className="mt-10 grid gap-5 md:grid-cols-[1.15fr_1fr]">
            <ImmersiveCard className="surface-card rounded-2xl p-7">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Ta position actuelle
                </p>
                <div className="mt-2 flex items-end gap-6">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={me.position}
                      initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -16, opacity: 0 }}
                      className="text-display text-7xl"
                    >
                      <span className="text-muted-foreground">#</span>
                      {me.position}
                    </motion.p>
                  </AnimatePresence>
                  <div className="pb-2 text-sm">
                    <p className="font-mono text-primary">{me.points} pts</p>
                    <p className="text-muted-foreground">
                      {me.referrals} filleul{me.referrals > 1 ? "s" : ""} · {total} inscrits
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background/40 p-2">
                  <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">
                    {link}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copié" : "Copier"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Je teste Kudo, l'app de notes pensée pour nos amphis. Prends ta place avec mon lien : ${link}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:border-primary hover:text-primary"
                  >
                    <Share2 className="size-3.5" />
                    Partager sur WhatsApp
                  </a>
                  <Link
                    href="/classement"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:border-primary hover:text-primary"
                  >
                    <Trophy className="size-3.5" />
                    Voir le classement
                  </Link>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progression vers le palier max</span>
                    <span className="font-mono">
                      {me.countedReferrals}/10
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-ember)" }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(me.countedReferrals / 10) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>
            </ImmersiveCard>

            <ImmersiveCard delay={0.1} className="surface-card rounded-2xl p-7">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Prochain objectif
                </p>
                {me.position > 1 ? (
                  <>
                    <p className="text-display mt-3 text-3xl">
                      Doubler la place #{me.position - 1}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Invite tes camarades pour remonter dans la file. Chaque inscription validée avec ton lien est prise en
                      compte immédiatement.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-display mt-3 text-3xl">Tu es en tête 🎉</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Garde ta première place : les autres continuent d'inviter.
                    </p>
                  </>
                )}

                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <Users className="mt-0.5 size-4 shrink-0 text-primary" />
                    Un email = une seule place. Les doublons ne rapportent rien.
                  </li>
                  <li className="flex gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                    L'auto-parrainage est détecté et ignoré.
                  </li>
                  <li className="flex gap-3">
                    <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
                    À égalité de points, c'est l'ancienneté qui départage.
                  </li>
                </ul>
              </div>
            </ImmersiveCard>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setJoining(true);
              setError(null);
              const refCode = new URLSearchParams(window.location.search).get("ref");
              const res = await joinWaitlist(email, refCode);
              if (res.success) {
                localStorage.setItem("kudo.waitlist.me", res.code);
                refresh();
              } else {
                setError("Erreur lors de l'inscription.");
              }
              setJoining(false);
            }}
            className="surface-card mt-10 flex max-w-xl flex-col gap-3 rounded-2xl p-2 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton.email@universite.tg"
              aria-label="Adresse email"
              className="w-full flex-1 bg-transparent px-4 py-3 outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" disabled={joining} className="rounded-xl px-6 py-6 sm:py-3">
              {joining ? "Chargement..." : "Générer mon lien"}
            </Button>
          </form>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "1 · Prends ta place",
              d: "Un email suffit. Ton code de parrainage unique est généré immédiatement.",
            },
            {
              t: "2 · Partage ton lien",
              d: "WhatsApp, groupe de promo, statut : chaque inscription validée compte.",
            },
            {
              t: "3 · Regarde la file bouger",
              d: "Ton rang est recalculé en direct, visible sur la page classement.",
            },
          ].map((s, i) => (
            <ImmersiveCard key={s.t} delay={i * 0.08} className="surface-card rounded-xl p-6">
              <div>
                <h2 className="text-lg">{s.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </ImmersiveCard>
          ))}
        </div>
      </div>
    </main>
  );
}

function PageNav() {
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour à l'accueil
      </Link>
      <Link
        href="/classement"
        className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
      >
        Classement
      </Link>
    </div>
  );
}
