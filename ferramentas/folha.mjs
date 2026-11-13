// Folha de contato: N quadros espalhados pelo vídeo numa imagem só, para revisar
// o corte inteiro sem renderizar o MP4. Uso:
//   node ferramentas/folha.mjs <pasta-ou-id> [--n 16] [--guia]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { renderStill } from "@remotion/renderer";
import { preparar, idDaPasta, RAIZ } from "./remotion.mjs";

const args = process.argv.slice(2);
const alvo = args[0];
const n = Number(args[args.indexOf("--n") + 1]) || 16;
const guia = args.includes("--guia");
const id = idDaPasta(alvo);
const pasta = fs.existsSync(alvo) ? path.resolve(alvo) : path.join(RAIZ, "out");
const destino = path.join(pasta, "saida");
fs.mkdirSync(destino, { recursive: true });

const inputProps = { guia };
const { serveUrl, composition } = await preparar(id, inputProps);
const tmp = fs.mkdtempSync(path.join(RAIZ, "out-folha-"));
const fps = composition.fps;
const quadros = Array.from({ length: n }, (_, i) => Math.round(((i + 0.5) / n) * (composition.durationInFrames - 1)));
for (const [i, frame] of quadros.entries()) {
  await renderStill({ serveUrl, composition, frame, inputProps, scale: 0.25,
    output: path.join(tmp, `q${String(i).padStart(3, "0")}.png`) });
}
const cols = Math.min(8, n);
const saida = path.join(destino, "folha-de-contato.png");
// carimba o tempo em cada quadro e monta a grade
const rotulos = quadros.map((f) => (f / fps).toFixed(1) + "s");
const filtros = quadros.map((_, i) =>
  `[${i}:v]drawtext=text='${rotulos[i]}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(";");
const entradas = quadros.flatMap((_, i) => ["-i", path.join(tmp, `q${String(i).padStart(3, "0")}.png`)]);
const grade = quadros.map((_, i) => `[v${i}]`).join("") +
  `xstack=inputs=${n}:layout=` +
  quadros.map((_, i) => `${(i % cols) ? Array.from({length: i % cols}, () => "w0").join("+") : 0}_${Math.floor(i / cols) ? Array.from({length: Math.floor(i / cols)}, () => "h0").join("+") : 0}`).join("|");
execFileSync("ffmpeg", ["-y", "-v", "error", ...entradas, "-filter_complex", `${filtros};${grade}`, saida]);
fs.rmSync(tmp, { recursive: true });
console.log(saida);
