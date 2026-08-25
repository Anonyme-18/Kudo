import { DEFAULT_THEME, FONT_PRESETS, THEME_PRESETS } from "./theme";

type MinimalPreset = {
  id: string;
  background: string;
  foreground: string;
  card: string;
  ember: string;
  clay: string;
  sand: string;
};

type MinimalFont = {
  id: string;
  display: string;
  sans: string;
};

/**
 * Génère un script inline à injecter dans <head> pour appliquer le thème
 * sauvegardé AVANT le premier rendu, évitant ainsi tout flash visuel.
 * Le script est volontairement en ES5 (var + fonctions) pour une compatibilité
 * maximale avec les vieux navigateurs.
 */
export function getThemeInlineScript(): string {
  const presets: MinimalPreset[] = THEME_PRESETS.map((p) => ({
    id: p.id,
    background: p.vars.background,
    foreground: p.vars.foreground,
    card: p.vars.card,
    ember: p.vars.ember,
    clay: p.vars.clay,
    sand: p.vars.sand,
  }));

  const fonts: MinimalFont[] = FONT_PRESETS.map((f) => ({
    id: f.id,
    display: f.display,
    sans: f.sans,
  }));

  return `
(function(){
  try {
    var KEY = ${JSON.stringify("kudo.theme.v1")};
    var DEFAULT = ${JSON.stringify(DEFAULT_THEME)};
    var PRESETS = ${JSON.stringify(presets)};
    var FONTS = ${JSON.stringify(fonts)};
    var raw = localStorage.getItem(KEY);
    var state = raw ? Object.assign({}, DEFAULT, JSON.parse(raw)) : DEFAULT;
    var preset = PRESETS.find(function(p){ return p.id === state.presetId; }) || PRESETS[0];
    var font = FONTS.find(function(f){ return f.id === state.fontId; }) || FONTS[0];
    var isLight = preset.id === "harmattan";
    var ember = state.ember || preset.ember;
    var root = document.documentElement;
    function set(k, v){ root.style.setProperty(k, v); }
    set("--background", preset.background);
    set("--foreground", preset.foreground);
    set("--card", preset.card);
    set("--card-foreground", preset.foreground);
    set("--popover", preset.card);
    set("--popover-foreground", preset.foreground);
    set("--primary", ember);
    set("--primary-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.18 0.02 60)");
    set("--secondary", "color-mix(in oklab, " + preset.foreground + " 10%, " + preset.background + ")");
    set("--secondary-foreground", preset.foreground);
    set("--muted", "color-mix(in oklab, " + preset.foreground + " 8%, " + preset.background + ")");
    set("--muted-foreground", "color-mix(in oklab, " + preset.foreground + " 62%, " + preset.background + ")");
    set("--accent", preset.clay);
    set("--accent-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.97 0.01 85)");
    set("--border", "color-mix(in oklab, " + preset.foreground + " 18%, transparent)");
    set("--input", "color-mix(in oklab, " + preset.foreground + " 22%, transparent)");
    set("--ring", ember);
    set("--ink", isLight ? preset.foreground : "oklch(0.12 0.01 60)");
    set("--ember", ember);
    set("--ember-foreground", isLight ? "oklch(0.98 0.01 85)" : "oklch(0.18 0.02 60)");
    set("--clay", preset.clay);
    set("--sand", preset.sand);
    set("--font-display", font.display);
    set("--font-sans", font.sans);
    if (state.radius != null) set("--radius", state.radius + "rem");
    requestAnimationFrame(function(){ root.classList.add("theme-ready"); });
  } catch(e){}
})();
  `.trim();
}
