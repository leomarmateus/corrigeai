// Legenda queimada, estilo karaokê: grupos curtos, palavra falada em destaque.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tema } from "./tema";
import { MIOLO, ZONA } from "./zona";
import type { Palavra } from "./narracao";

type Grupo = { palavras: Palavra[]; inicio: number; fim: number };

/** Quebra em grupos de até `maxPalavras` / `maxChars`, cortando em pontuação. */
export function agrupar(palavras: Palavra[], maxPalavras = 4, maxChars = 22): Grupo[] {
  const grupos: Grupo[] = [];
  let atual: Palavra[] = [];
  const fecha = () => {
    if (atual.length) grupos.push({ palavras: atual, inicio: atual[0].inicio, fim: atual[atual.length - 1].fim });
    atual = [];
  };
  for (const p of palavras) {
    const chars = [...atual, p].map((x) => x.palavra).join(" ").length;
    if (atual.length && (atual.length >= maxPalavras || chars > maxChars)) fecha();
    atual.push(p);
    if (/[.!?;:,]$/.test(p.palavra)) fecha();
  }
  fecha();
  // cada grupo fica na tela até o próximo começar (sem piscar em pausas curtas)
  grupos.forEach((g, i) => {
    const prox = grupos[i + 1];
    g.fim = prox ? Math.min(prox.inicio, g.fim + 0.6) : g.fim + 0.6;
  });
  return grupos;
}

const limpa = (s: string) => s.replace(/[,;:]$/, "");

export const Legenda: React.FC<{
  palavras: Palavra[];
  /** y da LINHA DE BASE da legenda; padrão: perto do limite inferior da zona segura */
  y?: number;
  tamanho?: number;
  maiusculas?: boolean;
}> = ({ palavras, y = ZONA.y1Coluna - 40, tamanho = 64, maiusculas = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grupos = useMemo(() => agrupar(palavras), [palavras]);
  const g = grupos.find((x) => t >= x.inicio && t < x.fim);
  if (!g) return null;

  const entrada = spring({ frame: frame - Math.round(g.inicio * fps), fps, config: { damping: 14, stiffness: 220 } });
  const escala = interpolate(entrada, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: MIOLO.x0,
          width: MIOLO.largura,
          bottom: 1920 - y,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.28em",
          fontFamily: tema.fonte,
          fontWeight: 800,
          fontSize: tamanho,
          lineHeight: 1.12,
          textAlign: "center",
          textTransform: maiusculas ? "uppercase" : "none",
          transform: `scale(${escala})`,
          transformOrigin: "50% 100%",
          opacity: entrada,
        }}
      >
        {g.palavras.map((p, i) => {
          const falando = t >= p.inicio && t < Math.max(p.fim, p.inicio + 0.12);
          const jaFoi = t >= p.inicio;
          return (
            <span
              key={i}
              style={{
                color: falando ? tema.cor.destaque : tema.cor.texto,
                opacity: jaFoi ? 1 : 0.55,
                WebkitTextStroke: "10px rgba(0,0,0,0.9)",
                paintOrder: "stroke fill",
                textShadow: "0 6px 18px rgba(0,0,0,0.55)",
              }}
            >
              {limpa(p.palavra)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
