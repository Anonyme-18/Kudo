"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FAQ: { cat: string; q: string; a: string }[] = [
  {
    cat: "Inscription",
    q: "Que se passe-t-il si je m'inscris deux fois avec le même email ?",
    a: "Rien de perdu, et rien de dupliqué : une adresse email correspond à une seule place. Si tu la ressaisis, on retrouve simplement ton entrée existante et on te réaffiche ta position, tes points et ton lien de parrainage. Ton ancienneté d'inscription reste celle de la première fois — te réinscrire ne te fait donc jamais reculer, mais ne te fait pas avancer non plus.",
  },
  {
    cat: "Inscription",
    q: "Combien de places sont vraiment disponibles ?",
    a: "1 000 places gratuites à vie pour la première promo, ouvertes dans l'ordre de la file au lancement de la rentrée 2026. Au-delà de la 1000e place, tu restes dans la file et tu accèdes à Kudo par vagues successives — sauf si le parrainage te fait remonter dans les 1 000 premiers d'ici là. Aucune place n'est réservée ni vendue : la seule façon d'avancer, c'est d'inviter.",
  },
  {
    cat: "Classement",
    q: "Comment ma position évolue-t-elle exactement ?",
    a: `Chaque filleul validé te rapporte 10 points, jusqu'à 10 filleuls comptabilisés (soit 100 points maximum). Le classement est ensuite recalculé intégralement, à chaque nouvelle inscription : d'abord par points décroissants, puis, à égalité de points, par ancienneté d'inscription croissante. Concrètement, tu ne « perds » jamais de points : tu peux reculer uniquement si quelqu'un d'autre invite plus que toi.`,
  },
  {
    cat: "Classement",
    q: "Puis-je utiliser mon propre lien pour remonter ?",
    a: "Non, et c'est volontaire. Un auto-parrainage — même email ou même code — est détecté et purement ignoré dans le calcul. Les doublons d'email ne créant pas de nouvelle entrée, gonfler artificiellement son score est impossible. Le classement reste vérifiable par tout le monde sur la page classement.",
  },
  {
    cat: "Classement",
    q: "Mes filleuls doivent-ils faire quelque chose pour que ça compte ?",
    a: "Juste s'inscrire depuis ton lien avec une adresse email valide qui n'est pas déjà dans la file. Le point est crédité immédiatement, sans validation manuelle ni délai. Si la personne était déjà inscrite avant, elle garde sa place d'origine et le parrainage n'est pas comptabilisé.",
  },
  {
    cat: "Produit",
    q: "Kudo fonctionne-t-il sans connexion ?",
    a: "Oui. Les notes, transcriptions et fiches sont stockées sur ton téléphone et la synchronisation se fait quand le réseau revient. Compte moins de 4 Mo de data par heure de cours.",
  },
  {
    cat: "Données",
    q: "Que faites-vous de mon email ?",
    a: "Il sert uniquement à te prévenir de l'ouverture de ta place et à tenir la file. Pas de revente, pas de newsletter subie, et tu peux demander sa suppression à tout moment avant le lancement.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-6 py-28">
      <p className="text-xs tracking-[0.3em] text-primary uppercase">Questions</p>
      <h2 className="text-display mt-5 max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
        Les réponses avant les <span className="italic">hésitations</span>.
      </h2>

      <div className="mt-12 border-t border-border">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-border">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 py-6 text-left"
              >
                <span className="hidden w-28 shrink-0 font-mono text-[11px] tracking-widest text-primary uppercase sm:block">
                  {item.cat}
                </span>
                <span className="flex-1 text-lg transition-colors group-hover:text-primary">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-primary"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={{ y: 10, filter: "blur(6px)" }}
                      animate={{ y: 0, filter: "blur(0px)" }}
                      exit={{ y: 6, filter: "blur(4px)" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="max-w-2xl pb-7 text-sm leading-relaxed text-muted-foreground sm:pl-33"
                    >
                      {item.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="surface-card mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">
          Encore un doute ? Regarde la file bouger en direct avant de t'inscrire.
        </p>
        <div className="flex gap-2">
          <Link
            href="/classement"
            className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            Voir le classement
          </Link>
          <a
            href="#rejoindre"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Prendre ma place
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-display text-4xl">
              Kudo<span className="text-primary">.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fait à Lomé, pour les campus du continent.
            </p>
          </div>
          <a
            href="#rejoindre"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Rejoindre la liste d'attente
          </a>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Kudo</span>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Espace fondateur
          </Link>
        </div>
      </div>
    </footer>
  );
}
