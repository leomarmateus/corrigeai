// Render final em MP4 (H.264, 1080×1920, 30 fps, AAC). Uso:
//   node ferramentas/render.mjs <pasta-ou-id> [--guia]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { renderMedia } from "@remotion/renderer";
import { preparar, idDaPasta, RAIZ } from "./remotion.mjs";
import { renderizarCapa } from "./capa.mjs";

const args = process.argv.slice(2);
const alvo = args[0];
const guia = args.includes("--guia");
const id = idDaPasta(alvo);
const pasta = fs.existsSync(alvo) ? path.resolve(alvo) : path.join(RAIZ, "out");
const saida = path.join(pasta, "saida", guia ? "reel-guia.mp4" : "reel.mp4");
fs.mkdirSync(path.dirname(saida), { recursive: true });
const inputProps = { guia };
const { serveUrl, composition } = await preparar(id, inputProps);
let ultimo = -1;
await renderMedia({
  serveUrl, composition, inputProps, codec: "h264", outputLocation: saida,
  crf: 18, audioBitrate: "192k", concurrency: 8,
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 10);
    if (p !== ultimo) { ultimo = p; process.stdout.write(`${p * 10}% `); }
  },
});
// volume no padrão de redes (−14 LUFS, pico −1,5 dBTP); vídeo copiado sem recodificar
const bruto = saida.replace(/\.mp4$/, ".bruto.mp4");
fs.renameSync(saida, bruto);
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", bruto, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
  "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", saida]);
fs.rmSync(bruto);
console.log("\n" + saida);
// toda produção sai com capa
console.log(await renderizarCapa(alvo, { serveUrl }));
