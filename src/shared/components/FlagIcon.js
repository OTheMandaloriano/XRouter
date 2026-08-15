"use client";

import { LOCALE_COUNTRY, LOCALE_FLAGS } from "@/shared/constants/locales";

// Bandeira do idioma via flag-icons (SVG, lipis/flag-icons) - renderiza em QUALQUER
// sistema. Emoji de bandeira NAO renderiza no Windows (vira o codigo do pais), por
// isso trocamos por SVG. O tamanho e controlado por `fontSize` no style (altura = 1em).
export default function FlagIcon({ locale, className = "", style }) {
  const country = LOCALE_COUNTRY[locale];
  if (country) {
    return (
      <span
        className={`fi fi-${country} rounded-sm ${className}`.trim()}
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08)", ...style }}
        aria-hidden="true"
      />
    );
  }
  // Fallback (locale sem mapa): emoji/globo.
  return (
    <span className={className} style={style} aria-hidden="true">
      {LOCALE_FLAGS[locale] || "🌐"}
    </span>
  );
}
