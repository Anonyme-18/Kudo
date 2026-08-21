import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";
import heroGlow from "@/assets/hero-glow.jpg";
import {
  MAX_COUNTED_REFERRALS,
  POINTS_PER_REFERRAL,
  join,
  loadMe,
  readAll,
  type RankedEntry,
} from "@/lib/waitlist";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, shown } = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`mx-auto w-full max-w-6xl px-6 transition-all duration-1000 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </section>
  );
}

function Landing() {
  const { ref: refCode } = Route.useSearch();
  const [me, setMe] = useState<RankedEntry | null>(null);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMe(loadMe());
    setTotal(readAll().length);
  }, []);

  const refresh = () => {
    setMe(loadMe());
    setTotal(readAll().length);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero
        refCode={refCode}
        me={me}
        total={total}
        mounted={mounted}
        onJoin={(e) => {
          setMe(e);
          refresh();
        }}
      />
      <Marquee />
      <Features />
      <Referral />
      <Faq />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-display text-2xl tracking-tight">
          Kudo<span className="text-primary">.</span>
        </span>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#produit" className="transition-colors hover:text-foreground">
            Le produit
          </a>
          <a href="#parrainage" className="transition-colors hover:text-foreground">
            Parrainage
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            Questions
          </a>
        </nav>
        <a
          href="#rejoindre"
          className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          Rejoindre la file
        </a>
      </div>
    </header>
  );
}

function Hero({
  refCode,
  me,
  total,
  mounted,
  onJoin,
}: {
  refCode?: string;
  me: RankedEntry | null;
  total: number;
  mounted: boolean;
  onJoin: (e: RankedEntry) => void;
}) {
  return (
    <div id="rejoindre" className="relative isolate">
      <img
        src={heroGlow}
        alt=""
        aria-hidden
        width={1600}
        height={1008}
        className="animate-drift pointer-events-none absolute inset-x-0 top-0 -z-10 h-[110vh] w-full object-cover opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_35%,var(--background)_92%)]"
      />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-32 pb-20">
        <div className="animate-rise inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs tracking-wide text-muted-foreground backdrop-blur">
          <span className="animate-pulse-ring size-1.5 rounded-full bg-primary" />
          Lancement 2026 · conçu à Lomé, Togo
        </div>

        <h1
          className="text-display animate-rise mt-8 max-w-3xl text-[clamp(2.9rem,8vw,6.2rem)]"
          style={{ animationDelay: "80ms" }}
        >
          Tes cours,{" "}
          <span className="text-ember-gradient italic">enfin</span> à ta hauteur.
        </h1>

        <p
          className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "160ms" }}
        >
          Kudo transforme un amphi bruyant, un PDF flou ou un vocal WhatsApp en notes claires,
          révisables et disponibles hors connexion. Pensé pour les campus africains, la data chère
          et les nuits de révision.
        </p>

        <div className="animate-rise mt-10 max-w-xl" style={{ animationDelay: "240ms" }}>
          {mounted && me ? (
            <SpotCard entry={me} />
          ) : (
            <JoinForm refCode={refCode} onJoin={onJoin} />
          )}
        </div>

        <div
          className="animate-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          <span className="font-mono text-foreground">
            {mounted ? total.toLocaleString("fr-FR") : "—"} étudiants déjà dans la file
          </span>
          <span>Gratuit pour les 1 000 premiers</span>
          <span>Aucune carte bancaire</span>
        </div>
      </div>
    </div>
  );
}

function JoinForm({
  refCode,
  onJoin,
}: {
  refCode?: string;
  onJoin: (e: RankedEntry) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const value = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          setError("Entre une adresse email valide.");
          return;
        }
        setError(null);
        const res = join(value, refCode);
        onJoin(res.entry);
      }}
      className="surface-card flex flex-col gap-3 rounded-2xl p-2 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ton.email@universite.tg"
        aria-label="Adresse email"
        className="w-full flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        Prendre ma place
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      {error && (
        <p className="px-4 pb-2 text-sm text-destructive sm:absolute sm:mt-24">{error}</p>
      )}
    </form>
  );
}

function SpotCard({ entry }: { entry: RankedEntry }) {
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => {
    if (typeof window === "undefined") return `?ref=${entry.code}`;
    return `${window.location.origin}/?ref=${entry.code}`;
  }, [entry.code]);

  const remaining = Math.max(0, MAX_COUNTED_REFERRALS - entry.referrals);

  return (
    <div className="surface-card animate-rise rounded-2xl p-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-widest text-muted-foreground uppercase">Ta position</p>
          <p className="text-display mt-1 text-6xl">
            <span className="text-muted-foreground">#</span>
            {entry.position}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-mono text-primary">{entry.points} pts</p>
          <p className="text-muted-foreground">
            {entry.referrals} filleul{entry.referrals > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        Partage ton lien : chaque inscription validée te rapporte{" "}
        <span className="text-foreground">{POINTS_PER_REFERRAL} points</span> et te fait remonter
        la file. {remaining > 0 ? `${remaining} filleuls encore comptabilisés.` : "Palier maximum atteint, bravo."}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/40 p-2">
        <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">{link}</span>
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

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(entry.countedReferrals / MAX_COUNTED_REFERRALS) * 100}%`,
            background: "var(--gradient-ember)",
          }}
        />
      </div>
    </div>
  );
}

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

function Marquee() {
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

function Features() {
  return (
    <Section id="produit" className="py-28">
      <p className="text-xs tracking-[0.3em] text-primary uppercase">Le produit</p>
      <h2 className="text-display mt-5 max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
        Trois gestes que tu fais déjà. En mieux.
      </h2>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.n}
            className="group bg-background p-8 transition-colors duration-500 hover:bg-card"
          >
            <span className="font-mono text-xs text-primary">{f.n}</span>
            <h3 className="text-display mt-6 text-2xl">{f.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Referral() {
  return (
    <Section id="parrainage" className="py-28">
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

        <ol className="space-y-px overflow-hidden rounded-2xl border border-border bg-border">
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
            <li key={i} className="bg-background p-7">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-lg">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

const FAQ = [
  {
    q: "Que se passe-t-il si je m'inscris deux fois avec le même email ?",
    a: "Rien de perdu : une adresse email correspond à une seule place. On te réaffiche simplement ta position et ton lien existants, sans créer de doublon ni te faire reculer.",
  },
  {
    q: "Puis-je utiliser mon propre lien pour remonter ?",
    a: "Non. Un auto-parrainage (même email ou même code) est détecté et ignoré dans le calcul du classement.",
  },
  {
    q: "Combien de places je gagne par filleul ?",
    a: `${POINTS_PER_REFERRAL} points par filleul validé, plafonnés à ${MAX_COUNTED_REFERRALS} filleuls. Le nombre de places gagnées dépend ensuite des points des autres inscrits : le classement est recalculé intégralement à chaque nouveau parrainage.`,
  },
  {
    q: "Kudo fonctionne-t-il sans connexion ?",
    a: "Oui. Les notes sont stockées localement et la synchronisation se fait quand le réseau est disponible.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="py-28">
      <h2 className="text-display text-[clamp(2rem,5vw,3.5rem)]">Questions honnêtes</h2>
      <div className="mt-12 border-t border-border">
        {FAQ.map((item, i) => (
          <div key={i} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
            >
              <span className="text-lg">{item.q}</span>
              <span className="font-mono text-primary">{open === i ? "−" : "+"}</span>
            </button>
            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
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
          <Link to="/admin" className="transition-colors hover:text-foreground">
            Espace fondateur
          </Link>
        </div>
      </div>
    </footer>
  );
}
