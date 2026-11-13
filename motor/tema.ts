// Tokens visuais. PROVISÓRIOS até a marca ser escolhida (ver marca/MARCA.md).
import { loadFont as carregarLexend } from "@remotion/google-fonts/Lexend";
import { loadFont as carregarMono } from "@remotion/google-fonts/JetBrainsMono";

const lexend = carregarLexend("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] });
const mono = carregarMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;

export const tema = {
  fonte: lexend.fontFamily,
  fonteMono: mono.fontFamily,
  cor: {
    fundo: "#0E1116",
    fundo2: "#171C24",
    texto: "#F4F1EA",
    textoSuave: "#9AA3AF",
    destaque: "#FFD23F", // palavra falada na legenda, marca-texto
    certo: "#3DDC97",
    errado: "#FF5D5D",
    acento: "#5B8CFF",
  },
} as const;

// Cor do selo de cada banca (capa e cabeçalho). Banca nova cai no destaque padrão.
const CORES_BANCA: Record<string, string> = {
  ENEM: "#FFD23F",
  UFRGS: "#5B8CFF",
  FUVEST: "#FF8A3D",
  UNICAMP: "#FF5D8F",
};
export const corDaBanca = (banca: string) => CORES_BANCA[banca.toUpperCase()] ?? tema.cor.destaque;
