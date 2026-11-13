// Render final em MP4 (H.264, 1080×1920, 30 fps, AAC). Uso:
//   node ferramentas/render.mjs <pasta-ou-id> [--guia]
import fs from "node:fs";
import path from "node:path";
import { renderMedia } from "@remotion/renderer";
import { preparar, idDaPasta, RAIZ } from "./remotion.mjs";

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
console.log("\n" + saida);
