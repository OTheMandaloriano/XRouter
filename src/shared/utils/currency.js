"use client";

// Conversão de moeda compartilhada: converte valores em USD para a moeda do
// idioma selecionado (via /api/currency/rates -> FloatRates), com cache de 10min,
// atualização automática e re-render dos componentes que usam o hook `useCurrency`.
import { useState, useEffect } from "react";
import { LOCALE_COOKIE, normalizeLocale } from "@/i18n/config";
import { onLocaleChange } from "@/i18n/runtime";
import { LOCALE_CURRENCY } from "@/shared/constants/locales";

const RATES_TTL_MS = 10 * 60 * 1000;
let ratesCache = { at: 0, rates: null };
let ratesInFlight = null;

// Estado atual (nivel de modulo), lido por formatCost().
let state = { locale: "en", currency: "USD", rate: 1, intlLocale: "en-US" };
const subs = new Set();
const notify = () => subs.forEach((cb) => cb());

function localeFromCookie() {
  if (typeof document === "undefined") return "en";
  const c = document.cookie.split(";").find((x) => x.trim().startsWith(`${LOCALE_COOKIE}=`));
  return normalizeLocale(c ? decodeURIComponent(c.split("=")[1]) : "en");
}

function recompute() {
  const locale = localeFromCookie();
  const wanted = LOCALE_CURRENCY[locale] || "USD";
  const r = wanted === "USD" ? 1 : ratesCache.rates?.[wanted];
  const next = {
    locale,
    currency: r ? wanted : "USD",
    rate: r || 1,
    intlLocale: locale === "en" ? "en-US" : locale,
  };
  if (next.currency !== state.currency || next.rate !== state.rate || next.locale !== state.locale) {
    state = next;
    notify();
  }
}

async function loadRates() {
  if (ratesCache.rates && Date.now() - ratesCache.at < RATES_TTL_MS) return;
  if (ratesInFlight) return ratesInFlight;
  ratesInFlight = fetch("/api/currency/rates")
    .then((r) => r.json())
    .then((d) => {
      if (d && d.rates) {
        ratesCache = { at: Date.now(), rates: d.rates };
        recompute();
      }
    })
    .catch(() => {})
    .finally(() => { ratesInFlight = null; });
  return ratesInFlight;
}

// Formata um valor USD na moeda atual (simbolo + separadores nativos do pais).
// Reativo quando o componente que chama esta sob um `useCurrency()`.
export function formatCost(amountUsd, opts = {}) {
  const value = (amountUsd || 0) * state.rate;
  const maximumFractionDigits = opts.maximumFractionDigits ?? 2;
  try {
    return new Intl.NumberFormat(state.intlLocale, {
      style: "currency",
      currency: state.currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${state.currency} ${value.toFixed(maximumFractionDigits)}`;
  }
}

export function getCurrencyState() {
  return state;
}

// Hook: mantem locale/cotacoes em sincronia e re-renderiza o componente na troca.
// Chame em qualquer componente que exiba custo (direta ou indiretamente via formatCost).
export function useCurrency() {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((n) => n + 1);
    subs.add(cb);
    recompute();
    loadRates();
    const offLocale = onLocaleChange(() => recompute());
    const id = setInterval(() => loadRates(), RATES_TTL_MS);
    return () => { subs.delete(cb); if (offLocale) offLocale(); clearInterval(id); };
  }, []);
  return { formatCost, ...state };
}

export default useCurrency;
