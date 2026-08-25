import { NextResponse } from "next/server";
import { syncAllProviderModels } from "@/shared/services/modelSync";

export const dynamic = "force-dynamic";

// Gatilho manual do sync de catalogo de modelos (tambem roda sozinho num timer).
export async function POST() {
  try {
    const results = await syncAllProviderModels({ prune: true });
    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}