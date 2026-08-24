import { AnimatePresence, motion } from "framer-motion";
import { Palette, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DEFAULT_THEME,
  FONT_PRESETS,
  THEME_PRESETS,
  applyTheme,
  loadTheme,
  resetTheme,
  saveTheme,
  type ThemeState,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ThemeState>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadTheme();
    setState(loaded);
    applyTheme(loaded);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyTheme(state);
    saveTheme(state);
  }, [state, ready]);

  const update = (patch: Partial<ThemeState>) => setState((s) => ({ ...s, ...patch }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Personnaliser l'apparence"
        className="liquid-glass fixed right-5 bottom-5 z-[70] inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-foreground transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Palette className="size-4 text-primary" />
        <span className="hidden sm:inline">Apparence</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass-strong fixed right-5 bottom-20 z-[70] w-[min(92vw,22rem)] rounded-3xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] text-primary uppercase">Apparence</p>
                <h2 className="text-display mt-1 text-2xl">Fais-la à ton image</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-4 text-xs tracking-widest text-muted-foreground uppercase">Thèmes</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update({ presetId: p.id, ember: null })}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5",
                    state.presetId === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/30",
                  )}
                >
                  <span className="flex gap-1">
                    {p.swatch.map((c) => (
                      <span
                        key={c}
                        className="size-3.5 rounded-full ring-1 ring-black/20"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 block text-sm">{p.label}</span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    {p.hint}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs tracking-widest text-muted-foreground uppercase">
              Typographie
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {FONT_PRESETS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => update({ fontId: f.id })}
                  style={{ fontFamily: f.display }}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-left text-lg transition-colors",
                    state.fontId === f.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background/30 text-muted-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <label className="text-xs tracking-widest text-muted-foreground uppercase">
                Accent
              </label>
              <input
                type="color"
                value={state.ember ?? "#e8a33d"}
                onChange={(e) => update({ ember: e.target.value })}
                aria-label="Couleur d'accent"
                className="h-9 w-16 cursor-pointer rounded-lg border border-border bg-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="text-xs tracking-widest text-muted-foreground uppercase">
                Arrondi · {(state.radius ?? 0.75).toFixed(2)}rem
              </label>
              <input
                type="range"
                min={0}
                max={1.75}
                step={0.05}
                value={state.radius ?? 0.75}
                onChange={(e) => update({ radius: Number(e.target.value) })}
                className="mt-2 w-full accent-[var(--ember)]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                resetTheme();
                setState(DEFAULT_THEME);
                applyTheme(DEFAULT_THEME);
              }}
              className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <RotateCcw className="size-3.5" />
              Revenir au thème d'origine
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
