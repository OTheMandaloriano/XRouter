import { NextResponse } from "next/server";
import { execFile } from "child_process";
import os from "os";

export const dynamic = "force-dynamic";

// Abre a janela NATIVA de "escolher pasta" do Windows (o XRouter roda local, entao
// o servidor consegue abrir o dialog na tela do usuario). Devolve o caminho escolhido.
export async function POST(request) {
  if (os.platform() !== "win32") {
    return NextResponse.json({ error: "Seletor de pasta disponível apenas no Windows" }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const initial = String(body.initial || "").replace(/'/g, "''");

  const script = [
    "Add-Type -AssemblyName System.Windows.Forms",
    "$d = New-Object System.Windows.Forms.FolderBrowserDialog",
    "$d.Description = 'Escolha a pasta do backup do XRouter'",
    "$d.ShowNewFolderButton = $true",
    `try { if ('${initial}') { $d.SelectedPath = '${initial}' } } catch {}`,
    "$top = New-Object System.Windows.Forms.Form",
    "$top.TopMost = $true; $top.ShowInTaskbar = $false; $top.Opacity = 0",
    "if ($d.ShowDialog($top) -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($d.SelectedPath) }",
    "$top.Dispose()",
  ].join("\n");
  const b64 = Buffer.from(script, "utf16le").toString("base64");

  return await new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-STA", "-EncodedCommand", b64],
      { windowsHide: true, timeout: 180000 },
      (err, stdout) => {
        const p = String(stdout || "").trim();
        if (p) { resolve(NextResponse.json({ path: p })); return; }
        if (err) { resolve(NextResponse.json({ error: err.message }, { status: 500 })); return; }
        resolve(NextResponse.json({ cancelled: true }));
      },
    );
  });
}
