// Linha do tempo da narração: blocos de áudio em sequência, cada um com o tempo
// das palavras (gerado por ferramentas/narrar.py em narracao/tempos.json).
import { FPS } from "./tema";

export type Palavra = { palavra: string; inicio: number; fim: number };
export type BlocoTempos = { id: string; audio: string; duracao: number; palavras: Palavra[] };
export type Tempos = { voz: string; modelo: string; blocos: BlocoTempos[] };

export type BlocoNaLinha = BlocoTempos & {
  src: string; // asset importado (mp3)
  inicio: number; // s, absoluto no vídeo
  fim: number;
  deFrame: number;
  frames: number;
};

/**
 * Posiciona os blocos um depois do outro.
 * @param audios id do bloco -> asset importado
 * @param pausas id do bloco -> silêncio (s) ANTES dele (padrão `pausaPadrao`)
 */
export function linhaDoTempo(
  tempos: Tempos,
  audios: Record<string, string>,
  { inicio = 0, pausaPadrao = 0.25, pausas = {} as Record<string, number> } = {},
): BlocoNaLinha[] {
  let t = inicio;
  return tempos.blocos.map((b, i) => {
    if (i > 0) t += pausas[b.id] ?? pausaPadrao;
    const bloco: BlocoNaLinha = {
      ...b,
      src: audios[b.id],
      inicio: t,
      fim: t + b.duracao,
      deFrame: Math.round(t * FPS),
      frames: Math.ceil(b.duracao * FPS),
    };
    t += b.duracao;
    return bloco;
  });
}

/** Todas as palavras com tempo absoluto no vídeo. */
export function palavrasAbsolutas(linha: BlocoNaLinha[]): Palavra[] {
  return linha.flatMap((b) =>
    b.palavras.map((p) => ({ palavra: p.palavra, inicio: p.inicio + b.inicio, fim: p.fim + b.inicio })),
  );
}

/** Momento (s) em que a palavra de índice `n` do bloco `id` começa: âncora para animações. */
export function marca(linha: BlocoNaLinha[], id: string, n = 0): number {
  const b = linha.find((x) => x.id === id);
  if (!b) throw new Error(`bloco ${id} não existe`);
  return b.inicio + (b.palavras[n]?.inicio ?? 0);
}

/** Primeira ocorrência de um trecho (ex.: "letra D") dentro de um bloco. */
export function marcaTexto(linha: BlocoNaLinha[], id: string, trecho: string): number {
  const b = linha.find((x) => x.id === id);
  if (!b) throw new Error(`bloco ${id} não existe`);
  const limpa = (x: string) => x.toLowerCase().replace(/[.,!?;:"“”]/g, "");
  const alvo = trecho.split(/\s+/).map(limpa);
  const ps = b.palavras.map((p) => limpa(p.palavra));
  for (let i = 0; i <= ps.length - alvo.length; i++) {
    if (alvo.every((a, k) => ps[i + k] === a)) return b.inicio + b.palavras[i].inicio;
  }
  throw new Error(`"${trecho}" não achado no bloco ${id}`);
}

export const duracaoTotal = (linha: BlocoNaLinha[], cauda = 1.2) =>
  Math.ceil((linha[linha.length - 1].fim + cauda) * FPS);
