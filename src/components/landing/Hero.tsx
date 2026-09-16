"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BlurText } from "@/components/BlurText";
import { FadingVideo } from "@/components/FadingVideo";
import { ImmersiveCard } from "@/components/ImmersiveCard";
import { type RankedEntry } from "@/lib/waitlist";
import heroFrame from "@/assets/hero-frame.jpg";
import heroLoop from "@/assets/hero-loop.mp4.asset.json";
import { useRef } from "react";
import { ReferralDemo, JoinForm, SpotCard } from "./ReferralComponents";

export function Hero({
  refCode,
  me,
  total,
  mounted,
  onJoin,
}: {
  refCode?: string | undefined;
  me: RankedEntry | null;
  total: number;
  mounted: boolean;
  onJoin: (e: RankedEntry) => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);

  const trackSpotlight = (event: React.PointerEvent<HTMLDivElement>) => {
    const hero = heroRef.current;
    if (!hero || event.pointerType === "touch") return;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    hero.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      id="rejoindre"
      ref={heroRef}
      onPointerMove={trackSpotlight}
      className="hero-spotlight relative isolate min-h-screen overflow-hidden bg-ink"
    >
      <img
        src={heroFrame.src}
        alt=""
        aria-hidden
        width={1920}
        height={1088}
        className="absolute top-0 left-1/2 z-0 h-[120%] w-[120%] max-w-none -translate-x-1/2 object-cover object-center opacity-90"
      />
      <FadingVideo
        src={heroLoop.url}
        poster={heroFrame.src}
        className="absolute top-0 left-1/2 z-0 -translate-x-1/2 object-cover object-center"
        style={{ width: "120%", height: "120%" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--ink)_55%,transparent)_0%,transparent_30%,color-mix(in_oklab,var(--ink)_70%,transparent)_72%,var(--background)_98%)]"
      />
      <div aria-hidden className="hero-halo hero-halo-one" />
      <div aria-hidden className="hero-halo hero-halo-two" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pt-28 pb-8">
        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="liquid-glass flex w-fit items-center gap-3 rounded-full pr-4"
          >
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">
              Bientôt
            </span>
            <span className="text-sm text-foreground/90">
              Première promo Kudo · rentrée 2026, depuis Lomé
            </span>
          </motion.div>

          <BlurText
            text="Tes cours, enfin à ta hauteur."
            className="text-display mt-7 max-w-3xl text-[clamp(2.6rem,7vw,5.4rem)] tracking-[-0.04em]"
          />

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-5 max-w-xl text-base leading-relaxed font-light text-foreground/90"
          >
            Kudo transforme un amphi bruyant, un PDF flou ou un vocal WhatsApp en notes claires,
            révisables et disponibles hors connexion. Pensé pour les campus africains, la data
            chère et les nuits de révision.
          </motion.p>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="mt-7 max-w-2xl"
          >
            {mounted && me ? (
              <SpotCard entry={me} />
            ) : (
              <div className="space-y-4">
                <ReferralDemo total={total} />
                <JoinForm refCode={refCode} onJoin={onJoin} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
            className="mt-6 flex flex-wrap items-stretch gap-4"
          >
            {[
              {
                value: mounted ? total.toLocaleString("fr-FR") : "—",
                label: "Étudiants déjà dans la file",
              },
              { value: "1 000", label: "Places gratuites à vie" },
              { value: "< 4 Mo", label: "De data par heure de cours" },
            ].map((s) => (
              <ImmersiveCard
                key={s.label}
                className="liquid-glass w-[210px] rounded-[1.25rem] p-5"
              >
                <p className="text-display text-4xl leading-none">{s.value}</p>
                <p className="mt-2 text-xs font-light text-foreground/80">{s.label}</p>
              </ImmersiveCard>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 pt-10"
        >
          <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-foreground">
            Déjà testé sur ces campus
          </span>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 md:gap-x-16">
            {["Lomé", "UCAD", "Unilag", "Legon", "UAC"].map((n) => (
              <span key={n} className="text-display text-2xl italic md:text-3xl">
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
