// Utilitário comum: empacota o motor uma vez e acha a composição.
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";

export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

export async function preparar(id, inputProps = {}, serveUrlPronto) {
  const serveUrl = serveUrlPronto ?? (await bundle({ entryPoint: path.join(RAIZ, "motor/index.ts") }));
  const composition = await selectComposition({ serveUrl, id, inputProps });
  return { serveUrl, composition };
}

/** "producoes/enem/quimica/2023-q91-x" -> "enem-quimica-2023-q91-x"; aceita também o id. */
export function idDaPasta(arg) {
  const rel = path.relative(path.join(RAIZ, "producoes"), path.resolve(arg));
  if (rel.startsWith("..")) return arg; // já é id
  return rel.split(path.sep).join("-").replace(/_/g, "").toLowerCase();
}
