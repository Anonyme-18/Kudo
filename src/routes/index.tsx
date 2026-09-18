"use client";

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { Capabilities } from "@/components/landing/Capabilities";
import { Marquee, Features, Referral } from "@/components/landing/FeaturesSection";
import { Faq, Footer } from "@/components/landing/FaqFooter";
import { getRankedEntries, type PublicRankedEntry } from "@/lib/actions";

export const Route = createFileRoute()({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Kudo — La prise de notes pensée pour les étudiants africains" },
      {
        name: "description",
        content:
          "Kudo transforme cours, PDF et audios en notes claires, même hors ligne. Rejoins la liste d'attente et remonte la file en invitant tes camarades.",
      },
      { property: "og:title", content: "Kudo — Notes intelligentes pour étudiants africains" },
      {
        property: "og:description",
        content:
          "Liste d'attente ouverte. Chaque camarade invité te fait gagner des places dans la file.",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-6 lg:px-14">
      <div className="flex items-center justify-between">
        <span className="liquid-glass text-display flex size-12 items-center justify-center rounded-full text-2xl italic">
          k
        </span>
        <div className="hidden items-center gap-1 md:flex">
          <nav className="liquid-glass flex items-center rounded-full p-1.5">
            {[
              { href: "#produit", label: "Le produit" },
              { href: "#capacites", label: "Capacités" },
              { href: "#faq", label: "Questions" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/parrainage"
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
            >
              Parrainage
            </Link>
            <Link
              href="/classement"
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
            >
              Classement
            </Link>
          </nav>
          <a
            href="#rejoindre"
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-sand px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink"
          >
            Prendre ma place
          </a>
        </div>
        <a
          href="#rejoindre"
          className="liquid-glass rounded-full px-4 py-2.5 text-sm text-foreground md:hidden"
        >
          Rejoindre
        </a>
      </div>
    </header>
  );
}

export default function Landing() {
  const [refCode, setRefCode] = useState<string | undefined>(undefined);
  const [me, setMe] = useState<PublicRankedEntry | null>(null);
  const [entries, setEntries] = useState<PublicRankedEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRefCode(new URLSearchParams(window.location.search).get("ref") ?? undefined);
    getRankedEntries().then((data) => {
      setEntries(data);
      const myCode = localStorage.getItem("kudo.waitlist.me");
      setMe(myCode ? (data.find((entry) => entry.code === myCode) ?? null) : null);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero
        refCode={refCode}
        me={me}
        total={entries.length}
        mounted={mounted}
        onJoin={(e) => {
          // Refresh data
          getRankedEntries().then(setEntries);
        }}
      />
      <Capabilities />
      <Marquee />
      <Features />
      <Referral />
      <Faq />
      <Footer />
    </main>
  );
}
