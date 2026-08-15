"use client";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Card from "@/shared/components/Card";
import { LOCALE_COOKIE, normalizeLocale } from "@/i18n/config";
import { onLocaleChange } from "@/i18n/runtime";
import { LOCALE_CURRENCY } from "@/shared/constants/locales";

const fmt = (n) => new Intl.NumberFormat().format(n || 0);

function getLocaleFromCookie() {
  if (typeof document === "undefined") return "en";
  const c = document.cookie.split(";").find((x) => x.trim().startsWith(`${LOCALE_COOKIE}=`));
  return normalizeLocale(c ? decodeURIComponent(c.split("=")[1]) : "en");
}

// Cache no nivel do modulo: trocar de idioma/periodo NAO refaz o fetch das cotacoes.
const RATES_TTL_MS = 10 * 60 * 1000;
let ratesCache = { at: 0, rates: null };
let ratesInFlight = null;

async function loadRates() {
  if (ratesCache.rates && Date.now() - ratesCache.at < RATES_TTL_MS) return ratesCache.rates;
  if (ratesInFlight) return ratesInFlight;
  ratesInFlight = fetch("/api/currency/rates")
    .then((r) => r.json())
    .then((d) => {
      if (d && d.rates) ratesCache = { at: Date.now(), rates: d.rates };
      return ratesCache.rates;
    })
    .catch(() => ratesCache.rates)
    .finally(() => { ratesInFlight = null; });
  return ratesInFlight;
}

// Converte o custo estimado (base USD) para a moeda do idioma selecionado e formata
// de forma nativa (simbolo + separadores do pais). Sem "~": ja ha o aviso "Estimated".
function formatCost(amountUsd, locale, rates) {
  const currency = LOCALE_CURRENCY[locale] || "USD";
  const rate = currency === "USD" ? 1 : rates?.[currency];
  const value = (amountUsd || 0) * (rate || 1);
  const cur = rate ? currency : "USD";
  const intlLocale = locale === "en" ? "en-US" : locale;
  try {
    return new Intl.NumberFormat(intlLocale, { style: "currency", currency: cur, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${cur} ${value.toFixed(2)}`;
  }
}

export default function OverviewCards({ stats }) {
  const [locale, setLocale] = useState("en");
  const [rates, setRates] = useState(ratesCache.rates);

  useEffect(() => {
    let active = true;
    setLocale(getLocaleFromCookie());
    const off = onLocaleChange(() => active && setLocale(getLocaleFromCookie()));
    const refresh = () => loadRates().then((r) => { if (active && r) setRates(r); });
    refresh();
    const id = setInterval(refresh, RATES_TTL_MS);
    return () => { active = false; if (off) off(); clearInterval(id); };
  }, []);

  const costLabel = formatCost(stats.totalCost, locale, rates);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
      <Card className="flex min-w-0 flex-col gap-1 px-4 py-3">
        <span className="text-text-muted text-sm uppercase font-semibold">Total Requests</span>
        <span className="truncate text-2xl font-bold">{fmt(stats.totalRequests)}</span>
      </Card>
      <Card className="flex min-w-0 flex-col gap-1 px-4 py-3">
        <span className="text-text-muted text-sm uppercase font-semibold">Total Input Tokens</span>
        <span className="truncate text-2xl font-bold text-primary">{fmt(stats.totalPromptTokens)}</span>
      </Card>
      <Card className="flex min-w-0 flex-col gap-1 px-4 py-3">
        <span className="text-text-muted text-sm uppercase font-semibold">Cached Tokens</span>
        <span className="truncate text-2xl font-bold text-info">{fmt(stats.totalCachedTokens)}</span>
      </Card>
      <Card className="flex min-w-0 flex-col gap-1 px-4 py-3">
        <span className="text-text-muted text-sm uppercase font-semibold">Output Tokens</span>
        <span className="truncate text-2xl font-bold text-success">{fmt(stats.totalCompletionTokens)}</span>
      </Card>
      <Card className="flex min-w-0 flex-col gap-1 px-4 py-3">
        <span className="text-text-muted text-sm uppercase font-semibold">Est. Cost</span>
        <span className="truncate text-2xl font-bold text-warning" title="Estimated, not actual billing">{costLabel}</span>
        <span className="text-[10px] text-text-muted">Estimated, not actual billing</span>
      </Card>
    </div>
  );
}

OverviewCards.propTypes = {
  stats: PropTypes.object.isRequired,
};
