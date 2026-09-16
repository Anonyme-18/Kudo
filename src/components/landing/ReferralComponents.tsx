import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Check, Copy, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImmersiveCard } from "@/components/ImmersiveCard";
import { joinWaitlist, type RankedEntry } from "@/lib/actions";

export function ReferralDemo({ total }: { total: number }) {
  const [invites, setInvites] = useState(0);
  const basePosition = Math.max(total || 742, 184);
  const gains = [0, 12, 31, 58, 91, 137];
  const position = Math.max(1, basePosition - (gains[invites] ?? 0));

  return (
    <ImmersiveCard className="liquid-glass-strong rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Users className="size-3.5" />
            </span>
            Simule ta remontée
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Position</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={position}
                initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -14, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.28 }}
                className="text-display text-4xl text-primary"
              >
                #{position}
              </motion.strong>
            </AnimatePresence>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {invites === 0 ? "Ajoute des camarades pour voir l’effet" : `${invites} invitation${invites > 1 ? "s" : ""} · +${invites * 10} pts`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Retirer une invitation"
            onClick={() => setInvites((value) => Math.max(0, value - 1))}
            disabled={invites === 0}
            className="rounded-full"
          >
            −
          </Button>
          <span className="w-6 text-center font-mono text-sm">{invites}</span>
          <Button
            type="button"
            size="icon"
            aria-label="Ajouter une invitation"
            onClick={() => setInvites((value) => Math.min(5, value + 1))}
            disabled={invites === 5}
            className="rounded-full"
          >
            <UserPlus className="size-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${(invites / 5) * 100}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 20 }}
        />
      </div>
    </ImmersiveCard>
  );
}

export function JoinForm({
  refCode,
  onJoin,
}: {
  refCode?: string | undefined;
  onJoin: (e: RankedEntry) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        const value = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          setError("Entre une adresse email valide.");
          return;
        }
        setError(null);
        setLoading(true);
        const res = await joinWaitlist(value, refCode);
        setLoading(false);
        // Note: For full fix, onJoin needs to handle database fetching logic
        // or trigger a full page refresh/data update
        window.location.reload(); 
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
        disabled={loading}
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        {loading ? "Chargement..." : "Prendre ma place"}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      {error && (
        <p className="px-4 pb-2 text-sm text-destructive sm:absolute sm:mt-24">{error}</p>
      )}
    </form>
  );
}

export function SpotCard({ entry }: { entry: RankedEntry }) {
  const [copied, setCopied] = useState(false);
  const link = React.useMemo(() => {
    if (typeof window === "undefined") return `?ref=${entry.code}`;
    return `${window.location.origin}/?ref=${entry.code}`;
  }, [entry.code]);

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
        <span className="text-foreground">10 points</span> et te fait remonter
        la file.
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
    </div>
  );
}
import * as React from 'react';
