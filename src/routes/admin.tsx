"use client";

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Lock, Loader2 } from "lucide-react";
import { getAdminRankedEntries, verifyAdmin, logoutAdmin, type RankedEntry } from "@/lib/actions";

export const Route = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Espace fondateur — Kudo" },
      { name: "description", content: "Tableau de bord privé de la liste d'attente Kudo." },
      { property: "og:title", content: "Espace fondateur — Kudo" },
      { property: "og:description", content: "Accès réservé à l'équipe Kudo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const SESSION_KEY = "kudo.admin.session";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<RankedEntry[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "ok") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) {
      setLoading(true);
      getAdminRankedEntries()
        .then((data) => setRows(data))
        .catch(() => {
          sessionStorage.removeItem(SESSION_KEY);
          setAuthed(false);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [authed]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      parrainages: rows.reduce((s, r) => s + r.referrals, 0),
      ambassadeurs: rows.filter((r) => r.referrals > 0).length,
    }),
    [rows],
  );

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const isValid = await verifyAdmin(pwd);
              if (isValid) {
                sessionStorage.setItem(SESSION_KEY, "ok");
                setAuthed(true);
              } else {
                setError(true);
              }
            } catch {
              setError(true);
            }
            setLoading(false);
          }}
          className="surface-card animate-rise w-full max-w-sm rounded-2xl p-8"
        >
          <Lock className="size-5 text-primary" />
          <h1 className="text-display mt-5 text-3xl">Espace fondateur</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Zone privée. Accès réservé à l'équipe Kudo.
          </p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(false);
            }}
            placeholder="Mot de passe"
            className="mt-6 w-full rounded-xl border border-border bg-background/50 px-4 py-3 outline-none focus:border-primary"
          />
          {error && <p className="mt-2 text-sm text-destructive">Mot de passe incorrect.</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Entrer
          </button>
          <Link
            href="/"
            className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Retour à la landing
          </Link>
        </form>
      </main>
    );
  }

  const exportCsv = () => {
    // toCsv needs RankedEntry from lib/waitlist which has slight type difference (Date vs number),
    // but the properties we use are compatible.
    const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      ["position", "email", "code_parrainage", "parraine_par", "filleuls", "points", "date"]
        .map(escapeCsv)
        .join(","),
      ...rows.map((r) =>
        [
          r.position,
          r.email,
          r.code,
          r.referredBy ?? "",
          r.referrals,
          r.points,
          r.joinedAt.toISOString(),
        ]
          .map(escapeCsv)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kudo-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-primary uppercase">Tableau de bord</p>
          <h1 className="text-display mt-3 text-4xl">Liste d'attente</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            <Download className="size-4" />
            Exporter en CSV
          </button>
          <button
            onClick={() => {
              void logoutAdmin();
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
            }}
            className="rounded-xl border border-border px-5 py-3 text-sm"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {[
          ["Inscrits", stats.total],
          ["Parrainages validés", stats.parrainages],
          ["Ambassadeurs actifs", stats.ambassadeurs],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-background p-6">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-display mt-2 text-4xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs tracking-wider text-muted-foreground uppercase">
            <tr>
              {["#", "Email", "Code", "Parrainé par", "Filleuls", "Points", "Inscrit le"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-primary">{r.position}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.code}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {r.referredBy ?? "—"}
                </td>
                <td className="px-4 py-3">{r.referrals}</td>
                <td className="px-4 py-3">{r.points}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(r.joinedAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Données issues de PostgreSQL. Export trié par position.
      </p>
    </main>
  );
}
