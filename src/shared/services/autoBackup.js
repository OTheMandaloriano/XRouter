// Backup automatico do banco (SQLite) — AUTOSSUFICIENTE.
// Sem aliases "@/" e sem depender do bundle do Next, pra poder ser ligado direto
// pelo custom-server.js no evento "listening" (ponto garantido no boot).
// Regra: so faz backup QUANDO o banco muda desde o ultimo, no maximo uma vez por
// intervalo escolhido. Usa o backup nativo do SQLite (.backup) => copia consistente,
// sem os problemas de WAL/SHM de uma copia de arquivo. Rotaciona (mantem N recentes).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import Database from "better-sqlite3";

const g = globalThis;
const APP_NAME = "9router";

// Resolve o data dir do mesmo jeito que src/lib/dataDir.js (DATA_DIR ou default).
function getDataDir() {
  const c = process.env.DATA_DIR;
  if (c && !(process.platform === "win32" && /^\//.test(c))) return c;
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), APP_NAME);
  }
  return path.join(os.homedir(), "." + APP_NAME);
}
function srcDbPath() {
  return path.join(getDataDir(), "db", "data.sqlite");
}
export function getDefaultBackupDir() {
  return path.join(os.homedir(), "Documents", "XRouter-backups");
}
function resolveBackupDir(bs) {
  const d = (bs.autoBackupDir || "").trim();
  return d || getDefaultBackupDir();
}

// Le as configs de backup direto da tabela settings (id=1), com defaults.
function readBackupSettings() {
  const def = { autoBackupEnabled: true, autoBackupIntervalMinutes: 5, autoBackupDir: "", autoBackupKeep: 30 };
  try {
    const db = new Database(srcDbPath(), { readonly: true, fileMustExist: true });
    const row = db.prepare("SELECT data FROM settings WHERE id = 1").get();
    db.close();
    const s = row ? JSON.parse(row.data) : {};
    return {
      autoBackupEnabled: s.autoBackupEnabled !== false,
      autoBackupIntervalMinutes: Number(s.autoBackupIntervalMinutes) || def.autoBackupIntervalMinutes,
      autoBackupDir: typeof s.autoBackupDir === "string" ? s.autoBackupDir : "",
      autoBackupKeep: Number(s.autoBackupKeep) || def.autoBackupKeep,
    };
  } catch {
    return def;
  }
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}h${p(d.getMinutes())}m${p(d.getSeconds())}s`;
}

function rotate(dir, keep) {
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.startsWith("xrouter-") && f.endsWith(".sqlite"))
      .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
    for (const { f } of files.slice(Math.max(1, keep))) {
      try { fs.unlinkSync(path.join(dir, f)); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}

let lastMtime = 0;
let lastAt = 0;

// force=true ignora "sem mudanca" e "desligado" (backup manual/baseline).
export async function runBackupNow(force = false) {
  const bs = readBackupSettings();
  if (!force && !bs.autoBackupEnabled) return { ok: false, reason: "disabled" };
  const src = srcDbPath();
  if (!fs.existsSync(src)) return { ok: false, reason: "no-db" };
  const mtime = fs.statSync(src).mtimeMs;
  if (!force && mtime === lastMtime) return { ok: false, reason: "unchanged" };

  const dir = resolveBackupDir(bs);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `xrouter-${stamp()}.sqlite`);
  const db = new Database(src, { readonly: true, fileMustExist: true });
  try {
    await db.backup(dest); // copia consistente (lida com WAL)
  } finally {
    db.close();
  }
  lastMtime = mtime;
  lastAt = Date.now();
  rotate(dir, bs.autoBackupKeep);
  return { ok: true, dest };
}

async function tick() {
  try {
    const bs = readBackupSettings();
    if (!bs.autoBackupEnabled) return;
    const intervalMs = Math.max(1, bs.autoBackupIntervalMinutes) * 60_000;
    if (Date.now() - lastAt < intervalMs) return;
    await runBackupNow(false);
  } catch (e) {
    console.warn("[AutoBackup] tick falhou:", e.message);
  }
}

export function startAutoBackup() {
  if (g.__xrAutoBackupInterval) return;
  g.__xrAutoBackupInterval = setInterval(tick, 60_000);
  if (g.__xrAutoBackupInterval.unref) g.__xrAutoBackupInterval.unref();
  console.log("[AutoBackup] ligado (backup so quando o banco muda, no intervalo configurado).");
  // baseline logo apos subir (garante 1 backup rapido), depois so quando mudar.
  setTimeout(() => {
    runBackupNow(true)
      .then((r) => { if (r.ok) console.log("[AutoBackup] baseline salvo:", r.dest); })
      .catch(() => {});
  }, 10_000);
}
