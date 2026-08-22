import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { BlurText } from "@/components/BlurText";
import { FadingVideo } from "@/components/FadingVideo";
import heroFrame from "@/assets/hero-frame.jpg";
import notesFrame from "@/assets/capabilities-frame.jpg";
import heroLoop from "@/assets/hero-loop.mp4.asset.json";
import notesLoop from "@/assets/notes-loop.mp4.asset.json";
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
      <Capabilities />
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
              { href: "#parrainage", label: "Parrainage" },
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
          </nav>
          <a
            href="#rejoindre"
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-sand px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink"
          >
            Prendre ma place
            <ArrowUpRight className="size-4" />
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

function Hero({
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
  return (
    <div id="rejoindre" className="relative isolate min-h-screen overflow-hidden bg-ink">
      <FadingVideo
        src={heroLoop.url}
        poster={heroFrame}
        className="absolute top-0 left-1/2 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--ink)_65%,transparent)_0%,transparent_35%,var(--background)_96%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pt-32 pb-10">
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
            className="text-display mt-7 max-w-3xl text-[clamp(3rem,9vw,6.5rem)] tracking-[-0.04em]"
          />

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-relaxed font-light text-foreground/90"
          >
            Kudo transforme un amphi bruyant, un PDF flou ou un vocal WhatsApp en notes claires,
            révisables et disponibles hors connexion. Pensé pour les campus africains, la data
            chère et les nuits de révision.
          </motion.p>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="mt-9 max-w-xl"
          >
            {mounted && me ? (
              <SpotCard entry={me} />
            ) : (
              <JoinForm refCode={refCode} onJoin={onJoin} />
            )}
          </motion.div>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-stretch gap-4"
          >
            {[
              {
                value: mounted ? total.toLocaleString("fr-FR") : "—",
                label: "Étudiants déjà dans la file",
              },
              { value: "1 000", label: "Places gratuites à vie" },
              { value: "< 4 Mo", label: "De data par heure de cours" },
            ].map((s) => (
              <div key={s.label} className="liquid-glass w-[210px] rounded-[1.25rem] p-5">
                <p className="text-display text-4xl leading-none">{s.value}</p>
                <p className="mt-2 text-xs font-light text-foreground/80">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 pt-14"
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

function Capabilities() {
  return (
    <section id="capacites" className="relative isolate min-h-screen overflow-hidden bg-ink">
      <FadingVideo
        src={notesLoop.url}
        poster={notesFrame}
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
            <motion.article
              key={c.title}
              initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
              className="liquid-glass flex min-h-[340px] flex-col rounded-[1.25rem] p-6"
            >
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinForm({
  refCode,
  onJoin,
}: {
  refCode?: string | undefined;
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
          <Link to="/admin" search={{}} className="transition-colors hover:text-foreground">
            Espace fondateur
          </Link>
        </div>
      </div>
    </footer>
  );
}
