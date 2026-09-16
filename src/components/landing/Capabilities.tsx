"use client";

import { motion } from "framer-motion";
import { ImmersiveCard } from "@/components/ImmersiveCard";
import { FadingVideo } from "@/components/FadingVideo";
import notesFrame from "@/assets/capabilities-frame.jpg";
import notesLoop from "@/assets/notes-loop.mp4.asset.json";

const CAPABILITIES = [
  {
    title: "Amphi capté",
    tags: ["Bruit filtré", "Français & anglais", "Titres auto", "Hors ligne"],
    body: "Enregistre le cours et récupère une transcription structurée : définitions, formules et questions d'examen probables.",
  },
  {
    title: "PDF en fiches",
    tags: ["Scan flou", "Photo WhatsApp", "Résumé", "Quiz"],
    body: "Un polycopié photographié devient une fiche de révision propre, avec quiz généré pour t'auto-évaluer.",
  },
  {
    title: "Data légère",
    tags: ["Offline first", "Sync auto", "< 4 Mo/h", "Android d'abord"],
    body: "Tout fonctionne sans connexion et se synchronise quand le réseau revient. Pensé pour les forfaits limités.",
  },
];

export function Capabilities() {
  return (
    <section id="capacites" className="relative isolate min-h-screen overflow-hidden bg-ink">
      <img
        src={notesFrame.src}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={1088}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <FadingVideo
        src={notesLoop.url}
        poster={notesFrame.src}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,var(--background)_0%,transparent_22%,transparent_70%,var(--background)_100%)]"
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pt-28 pb-16">
        <div className="mb-auto">
          <p className="mb-6 text-sm text-foreground/80">// Capacités</p>
          <h2 className="text-display text-[clamp(3rem,8vw,6rem)] tracking-[-0.03em]">
            Réviser,
            <br />
            <span className="italic">autrement.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <ImmersiveCard
              key={c.title}
              delay={i * 0.12}
              className="liquid-glass min-h-[340px] rounded-[1.25rem] p-6"
            >
              <article className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="liquid-glass flex size-11 items-center justify-center rounded-[0.75rem] font-mono text-sm text-primary">
                  0{i + 1}
                </span>
                <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="liquid-glass rounded-full px-3 py-1 text-[11px] whitespace-nowrap text-foreground/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="text-display text-3xl md:text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-[32ch] text-sm leading-snug font-light text-foreground/90">
                  {c.body}
                </p>
              </div>
              </article>
            </ImmersiveCard>
          ))}
        </div>
      </div>
    </section>
  );
}
