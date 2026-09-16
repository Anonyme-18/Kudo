import { ImmersiveCard } from "@/components/ImmersiveCard";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { POINTS_PER_REFERRAL, MAX_COUNTED_REFERRALS } from "@/lib/waitlist";

const CAMPUS = [
  "Université de Lomé",
  "UCAD Dakar",
  "Unilag",
  "Université d'Abomey-Calavi",
  "University of Ghana",
  "Université Mohammed V",
  "Makerere",
  "Université Félix Houphouët-Boigny",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-border py-5">
      <div className="animate-marquee flex w-max gap-12 pr-12">
        {[...CAMPUS, ...CAMPUS].map((c, i) => (
          <span key={i} className="text-sm whitespace-nowrap text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    n: "01",
    title: "Le cours, capté même dans le bruit",
    body: "Enregistre l'amphi et récupère une transcription structurée en titres, définitions et questions d'examen probables.",
  },
  {
    n: "02",
    title: "Tes PDF deviennent des fiches",
    body: "Photo d'un polycopié, scan flou, capture WhatsApp : Kudo en extrait l'essentiel et génère des fiches de révision.",
  },
  {
    n: "03",
    title: "Hors ligne d'abord, data légère",
    body: "Tout fonctionne sans connexion et se synchronise quand le réseau revient. Moins de 4 Mo par heure de cours.",
  },
];

export function Features() {
  return (
    <section id="produit" className="mx-auto w-full max-w-6xl px-6 py-28">
      <p className="text-xs tracking-[0.3em] text-primary uppercase">Le produit</p>
      <h2 className="text-display mt-5 max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
        Trois gestes que tu fais déjà. En mieux.
      </h2>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <ImmersiveCard key={f.n} delay={i * 0.1} className="bg-background p-8 transition-colors duration-500 hover:bg-card">
            <article>
              <span className="font-mono text-xs text-primary">{f.n}</span>
              <h3 className="text-display mt-6 text-2xl">{f.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          </ImmersiveCard>
        ))}
      </div>
    </section>
  );
}

export function Referral() {
  return (
    <section id="parrainage" className="mx-auto w-full max-w-6xl px-6 py-28">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs tracking-[0.3em] text-primary uppercase">Parrainage</p>
          <h2 className="text-display mt-5 text-[clamp(2rem,5vw,3.5rem)]">
            La file avance <span className="italic">plus vite</span> à plusieurs.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Tu reçois un lien unique dès ton inscription. Chaque camarade qui s'inscrit avec ton
            lien te fait gagner des places, immédiatement et de façon vérifiable.
          </p>
          <a
            href="#rejoindre"
            className="mt-8 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-accent"
          >
            <Sparkles className="size-4" />
            Obtenir mon lien
          </a>
        </div>

        <ol className="grid gap-2">
          {[
            {
              t: "Tu prends ta place",
              d: "Un email suffit. Ton lien de parrainage unique est généré aussitôt.",
            },
            {
              t: `Chaque filleul = ${POINTS_PER_REFERRAL} points`,
              d: `Jusqu'à ${MAX_COUNTED_REFERRALS} filleuls comptabilisés, soit ${POINTS_PER_REFERRAL * MAX_COUNTED_REFERRALS} points maximum.`,
            },
            {
              t: "Classement recalculé à chaque validation",
              d: "Points décroissants, puis ancienneté d'inscription. Aucun auto-parrainage possible : ton propre lien ne compte jamais pour toi.",
            },
          ].map((s, i) => (
            <ImmersiveCard key={i} delay={i * 0.1} className="surface-card rounded-xl p-7">
              <li>
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <h3 className="mt-3 text-lg">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            </ImmersiveCard>
          ))}
        </ol>
      </div>
    </section>
  );
}
