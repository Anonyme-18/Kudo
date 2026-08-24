/**
 * Personnalisation front du thème (couleurs + typo).
 * Les valeurs sont écrites en variables CSS sur <html> et persistées en localStorage.
 */

export type ThemeVars = {
  background: string;
  foreground: string;
  card: string;
  ember: string;
  clay: string;
  sand: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  hint: string;
  swatch: string[];
  vars: ThemeVars;
};

export type FontPreset = {
  id: string;
  label: string;
  display: string;
  sans: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ember",
    label: "Braise",
    hint: "Encre profonde, accents ambre",
    swatch: ["#1a1512", "#e8a33d", "#c46a3a"],
    vars: {
      background: "oklch(0.16 0.012 60)",
      foreground: "oklch(0.95 0.012 85)",
      card: "oklch(0.2 0.014 62)",
      ember: "oklch(0.74 0.16 62)",
      clay: "oklch(0.6 0.14 32)",
      sand: "oklch(0.93 0.02 82)",
    },
  },
  {
    id: "harmattan",
    label: "Harmattan",
    hint: "Sable clair, encre chaude",
    swatch: ["#f2ece1", "#b4531f", "#7c5c3e"],
    vars: {
      background: "oklch(0.95 0.014 85)",
      foreground: "oklch(0.22 0.02 60)",
      card: "oklch(0.98 0.008 85)",
      ember: "oklch(0.58 0.16 45)",
      clay: "oklch(0.52 0.09 60)",
      sand: "oklch(0.32 0.02 60)",
    },
  },
  {
    id: "lagune",
    label: "Lagune",
    hint: "Nuit bleue, néon menthe",
    swatch: ["#0b1620", "#39e0c0", "#4aa8ff"],
    vars: {
      background: "oklch(0.17 0.03 240)",
      foreground: "oklch(0.95 0.01 220)",
      card: "oklch(0.22 0.035 240)",
      ember: "oklch(0.82 0.14 176)",
      clay: "oklch(0.68 0.13 245)",
      sand: "oklch(0.93 0.02 220)",
    },
  },
  {
    id: "kola",
    label: "Kola",
    hint: "Violet profond, rose vif",
    swatch: ["#160f1e", "#e0559a", "#9b6bff"],
    vars: {
      background: "oklch(0.16 0.03 305)",
      foreground: "oklch(0.95 0.012 310)",
      card: "oklch(0.21 0.04 305)",
      ember: "oklch(0.72 0.19 350)",
      clay: "oklch(0.62 0.19 295)",
      sand: "oklch(0.94 0.015 310)",
    },
  },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "editorial",
    label: "Éditorial",
    display: '"Instrument Serif", Georgia, serif',
    sans: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "moderne",
    label: "Moderne",
    display: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    sans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "campus",
    label: "Campus",
    display: '"Bebas Neue", Impact, sans-serif',
    sans: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "litteraire",
    label: "Littéraire",
    display: '"Playfair Display", Georgia, serif',
    sans: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  },
];

export type ThemeState = {
  presetId: string;
  fontId: string;
  ember: string | null;
  radius: number | null;
};

const KEY = "kudo.theme.v1";

export const DEFAULT_THEME: ThemeState = {
  presetId: "ember",
  fontId: "editorial",
  ember: null,
  radius: null,
};

export function hexToOklchish(hex: string): string {
  // conversion sRGB -> oklch (approximation standard, suffisante pour l'aperçu)
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return hex;
  const int = parseInt(m[1], 16);
  const srgb = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  const [r, g, b] = srgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m2 = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m2 - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m2 + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m2 - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

export function applyTheme(state: ThemeState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const preset = THEME_PRESETS.find((p) => p.id === state.presetId) ?? THEME_PRESETS[0]!;
  const font = FONT_PRESETS.find((f) => f.id === state.fontId) ?? FONT_PRESETS[0]!;
  const v = preset.vars;
  const ember = state.ember ? hexToOklchish(state.ember) : v.ember;
  const isLight = preset.id === "harmattan";

  const set = (k: string, value: string) => root.style.setProperty(k, value);

  set("--background", v.background);
  set("--foreground", v.foreground);
  set("--card", v.card);
  set("--card-foreground", v.foreground);
  set("--popover", v.card);
  set("--popover-foreground", v.foreground);
  set("--primary", ember);
  set("--primary-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.18 0.02 60)");
  set("--secondary", `color-mix(in oklab, ${v.foreground} 10%, ${v.background})`);
  set("--secondary-foreground", v.foreground);
  set("--muted", `color-mix(in oklab, ${v.foreground} 8%, ${v.background})`);
  set("--muted-foreground", `color-mix(in oklab, ${v.foreground} 62%, ${v.background})`);
  set("--accent", v.clay);
  set("--accent-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.97 0.01 85)");
  set("--border", `color-mix(in oklab, ${v.foreground} 18%, transparent)`);
  set("--input", `color-mix(in oklab, ${v.foreground} 22%, transparent)`);
  set("--ring", ember);
  set("--ink", isLight ? v.foreground : "oklch(0.12 0.01 60)");
  set("--ember", ember);
  set("--ember-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.18 0.02 60)");
  set("--clay", v.clay);
  set("--sand", v.sand);
  set("--font-display", font.display);
  set("--font-sans", font.sans);
  if (state.radius != null) set("--radius", `${state.radius}rem`);
}

export function loadTheme(): ThemeState {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_THEME;
    return { ...DEFAULT_THEME, ...(JSON.parse(raw) as Partial<ThemeState>) };
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(state: ThemeState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetTheme() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  if (typeof document !== "undefined") document.documentElement.removeAttribute("style");
}
