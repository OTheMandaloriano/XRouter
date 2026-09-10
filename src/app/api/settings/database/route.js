import { NextResponse } from "next/server";
import fs from "node:fs";
import { exportDb, getSettings, importDb, restoreSqliteDb } from "@/lib/localDb";
import { DATA_FILE } from "@/lib/db/paths";
import { getAdapter } from "@/lib/db/driver";
import { applyOutboundProxyEnv } from "@/lib/network/outboundProxy";
import { verifyDashboardPassword } from "@/lib/auth/dashboardSession";

const CLI_TOKEN_HEADER = "x-9r-cli-token";
const PASSWORD_HEADER = "x-9r-password";

function isCliRequest(request) {
  return Boolean(request.headers.get(CLI_TOKEN_HEADER));
}

function getFilenameStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}h${p(d.getMinutes())}m${p(d.getSeconds())}s`;
}

export async function GET(request) {
  try {
    if (!isCliRequest(request) && !(await verifyDashboardPassword(request.headers.get(PASSWORD_HEADER)))) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "sqlite").toLowerCase();

    if (format === "json") {
      const payload = await exportDb();
      return NextResponse.json(payload);
    }

    // SQLite export (padrao consistente com backups automaticos)
    try {
      const db = await getAdapter();
      if (typeof db.checkpoint === "function") {
        db.checkpoint();
      }
    } catch {}

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(DATA_FILE);
    const filename = `xrouter-backup-${getFilenameStamp()}.sqlite`;

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/x-sqlite3",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(fileBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exporting database:", error);
    return NextResponse.json({ error: "Failed to export database" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Upload via multipart/form-data (.sqlite, .db, ou .json)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const password = formData.get("password") || request.headers.get(PASSWORD_HEADER);

      if (!isCliRequest(request) && !(await verifyDashboardPassword(password))) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      const file = formData.get("file");
      if (!file) {
        return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sqliteHeader = Buffer.from("SQLite format 3\0");
      const isSqlite = buffer.length >= 16 && buffer.subarray(0, 16).equals(sqliteHeader);

      if (isSqlite || (file.name && /\.(sqlite|db)$/i.test(file.name))) {
        await restoreSqliteDb(buffer);
      } else {
        // Tratar como JSON legado
        const text = buffer.toString("utf8");
        const payload = JSON.parse(text);
        await importDb(payload);
      }
    } else {
      // 2. Upload via JSON legado
      const { password, ...payload } = await request.json();
      if (!isCliRequest(request) && !(await verifyDashboardPassword(password))) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      if (payload.fileBase64) {
        const buffer = Buffer.from(payload.fileBase64, "base64");
        await restoreSqliteDb(buffer);
      } else {
        await importDb(payload);
      }
    }

    // Re-apply outbound proxy settings immediately
    try {
      const settings = await getSettings();
      applyOutboundProxyEnv(settings);
    } catch (err) {
      console.warn("[Settings][DatabaseImport] Failed to re-apply outbound proxy env:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error importing database:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to import database" },
      { status: 400 }
    );
  }
}
