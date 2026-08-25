// Auto-sync de modelos dos provedores.
// Reconcilia os modelos habilitados (settings.customModels) com o catalogo ao vivo
// de cada provedor que expoe um modelsFetcher (opencode-free, openrouter-free,
// mimo-free). Remove SO os modelos que sumiram do catalogo; NUNCA remove quando a
// busca do catalogo falha ou volta vazia (evita zerar tudo quando a fonte cai).
// Registra um aviso por mudanca no Console Log. Roda no start e a cada SYNC_INTERVAL_MS.

import registry from "open-sse/providers/registry/index.js";
import { FILTERS } from "@/app/api/providers/suggested-models/filters.js";
import { getSettings, updateSettings } from "@/lib/localDb";
import * as log from "@/sse/utils/logger.js";

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6h
const BOOT_DELAY_MS = 15 * 1000;
const g = globalThis;

// Busca o catalogo ao vivo de um provedor via seu modelsFetcher. Retorna um array
// de { id, name } em caso de sucesso, ou null em qualquer falha (para o chamador
// nunca podar a lista quando a fonte esta fora do ar).
async function fetchCatalog(fetcher) {
  const filter = fetcher && FILTERS[fetcher.type];
  if (!fetcher?.url || typeof filter !== "function") return null;
  try {
    const res = await fetch(fetcher.url);
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.data ?? json.models ?? json;
    const data = filter(Array.isArray(raw) ? raw : []);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function providerAliases(p) {
  const set = new Set();
  for (const a of [p.uiAlias, p.alias, ...(p.aliases || [])]) if (a) set.add(a);
  return set;
}

function fetchableProviders() {
  return registry.filter((p) => p?.modelsFetcher && FILTERS[p.modelsFetcher.type]);
}

// Reconcilia todos os provedores com catalogo. Poda os modelos mortos num UNICO
// write de settings (merge). Retorna um resumo por provedor
// [{ provider, alias, removed:[ids], added:[ids] }].
export async function syncAllProviderModels({ prune = true } = {}) {
  const settings = await getSettings();
  const customModels = Array.isArray(settings.customModels) ? settings.customModels : [];
  const results = [];
  const gone = new Set(); // pares `${alias}::${id}` a remover

  for (const p of fetchableProviders()) {
    const catalog = await fetchCatalog(p.modelsFetcher);
    if (!catalog || catalog.length === 0) continue; // fetch falhou/vazio -> nunca poda

    const catalogIds = new Set(catalog.map((m) => m.id));
    const aliases = providerAliases(p);
    const enabled = customModels.filter((m) => m?.id && aliases.has(m.providerAlias));
    const enabledIds = new Set(enabled.map((m) => m.id));

    const removed = enabled.filter((m) => !catalogIds.has(m.id)).map((m) => m.id);
    const added = catalog.filter((m) => !enabledIds.has(m.id)).map((m) => m.id);
    const alias = p.uiAlias || p.alias || p.id;
    results.push({ provider: p.id, alias, removed, added });

    if (removed.length || added.length) {
      log.warn("MODEL-SYNC", `[${alias}] sumiram=[${removed.join(", ") || "-"}] novos=[${added.join(", ") || "-"}]`);
    }
    for (const id of removed) for (const a of aliases) gone.add(`${a}::${id}`);
  }

  if (prune && gone.size > 0) {
    const kept = customModels.filter((m) => !(m?.id && gone.has(`${m.providerAlias}::${m.id}`)));
    if (kept.length !== customModels.length) {
      await updateSettings({ customModels: kept });
      log.warn("MODEL-SYNC", `removidos ${customModels.length - kept.length} modelo(s) morto(s) de customModels`);
    }
  }

  return results;
}

// Inicia o auto-sync em background: uma vez logo apos o boot, depois no intervalo.
// Idempotente entre hot reloads via guard global.
export function startModelSync() {
  if (g.__modelSyncStarted) return;
  g.__modelSyncStarted = true;
  const run = () => syncAllProviderModels().catch((e) => log.warn("MODEL-SYNC", `falhou: ${e?.message || e}`));
  setTimeout(run, BOOT_DELAY_MS);
  g.__modelSyncInterval = setInterval(run, SYNC_INTERVAL_MS);
  if (g.__modelSyncInterval && typeof g.__modelSyncInterval.unref === "function") g.__modelSyncInterval.unref();
}