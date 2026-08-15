import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// FloatRates: cotacao de mercado em tempo real, base USD, sem limite de requisicoes.
const FLOATRATES_URL = "https://www.floatrates.com/daily/usd.json";
// Intervalo recomendado: 10 min. Cacheamos no servidor p/ nao atualizar sem necessidade.
const TTL_MS = 10 * 60 * 1000;

let cache = { at: 0, rates: null };

function toRatesMap(data) {
  // FloatRates: { "brl": { code:"BRL", rate: 5.4, ... }, ... } (chaves em minusculo)
  const rates = { USD: 1 };
  for (const k of Object.keys(data || {})) {
    const code = data[k]?.code;
    const rate = parseFloat(data[k]?.rate); // FloatRates devolve rate como string
    if (code && Number.isFinite(rate) && rate > 0) rates[String(code).toUpperCase()] = rate;
  }
  return rates;
}

export async function GET() {
  const now = Date.now();
  if (cache.rates && now - cache.at < TTL_MS) {
    return NextResponse.json({ base: "USD", rates: cache.rates, cachedAt: cache.at });
  }
  try {
    const res = await fetch(FLOATRATES_URL, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`FloatRates HTTP ${res.status}`);
    const data = await res.json();
    const rates = toRatesMap(data);
    if (Object.keys(rates).length < 2) throw new Error("FloatRates returned no rates");
    cache = { at: now, rates };
    return NextResponse.json({ base: "USD", rates, cachedAt: now });
  } catch (error) {
    // Se falhar, devolve o cache antigo (se houver) para nao quebrar a UI.
    if (cache.rates) {
      return NextResponse.json({ base: "USD", rates: cache.rates, cachedAt: cache.at, stale: true });
    }
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
