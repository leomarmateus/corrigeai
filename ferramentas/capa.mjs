// Capa da produção: saida/capa.png (1080×1920) + saida/capa-grade.png (recorte 3:4 do perfil).
//   node ferramentas/capa.mjs <pasta-ou-id> [--guia]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { renderStill } from "@remotion/renderer";
import { preparar, idDaPasta, RAIZ } from "./remotion.mjs";

export async function renderizarCapa(alvo, { guia = false, serveUrl } = {}) {
  const id = `${idDaPasta(alvo)}-capa`;
  const pasta = fs.existsSync(alvo) ? path.resolve(alvo) : path.join(RAIZ, "out");
  const destino = path.join(pasta, "saida");
  fs.mkdirSync(destino, { recursive: true });
  const inputProps = { guia };
  const prep = await preparar(id, inputProps, serveUrl);
  const capa = path.join(destino, guia ? "capa-guia.png" : "capa.png");
  await renderStill({ serveUrl: prep.serveUrl, composition: prep.composition, inputProps, output: capa });
  if (!guia) {
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", capa, "-vf", "crop=1080:1440:0:240",
      path.join(destino, "capa-grade.png")]);
  }
  return capa;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  console.log(await renderizarCapa(args[0], { guia: args.includes("--guia") }));
}
