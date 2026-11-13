// Painel das alternativas A–E: riscar erradas, destacar a certa.
import React from "react";
import { tema } from "./tema";

export type EstadoAlt = { riscada?: number; certa?: number; nota?: string };

export const Alternativas: React.FC<{
  itens: { letra: string; texto: string }[];
  /** por letra: riscada 0..1 (progresso do risco), certa 0..1 (progresso do destaque) */
  estado?: Record<string, EstadoAlt>;
  entrada?: number; // 0..1, cada linha entra em cascata
  tamanho?: number;
  largura?: number;
}> = ({ itens, estado = {}, entrada = 1, tamanho = 46, largura = 760 }) => (
  <div style={{ width: largura, display: "flex", flexDirection: "column", gap: 10 }}>
    {itens.map((it, i) => {
      const e = estado[it.letra] ?? {};
      const p = Math.max(0, Math.min(1, entrada * itens.length - i * 0.6));
      const certa = e.certa ?? 0;
      const riscada = e.riscada ?? 0;
      return (
        <div
          key={it.letra}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "8px 20px",
            borderRadius: 20,
            background: certa > 0 ? `rgba(61,220,151,${0.18 * certa})` : tema.cor.fundo2,
            border: `3px solid ${certa > 0 ? tema.cor.certo : "rgba(255,255,255,0.08)"}`,
            opacity: p * (1 - 0.55 * riscada),
            transform: `translateX(${(1 - p) * -60}px) scale(${1 + 0.05 * certa})`,
            fontSize: tamanho,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: tamanho * 1.35,
              height: tamanho * 1.35,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              background: certa > 0 ? tema.cor.certo : "rgba(255,255,255,0.12)",
              color: certa > 0 ? tema.cor.fundo : tema.cor.texto,
              flexShrink: 0,
            }}
          >
            {it.letra}
          </span>
          <span style={{ whiteSpace: "nowrap" }}>{it.texto}</span>
          {e.nota && riscada > 0.5 && (
            <span style={{ marginLeft: "auto", fontSize: tamanho * 0.7, color: tema.cor.errado, position: "relative", zIndex: 1, background: tema.cor.fundo2, padding: "0 8px", whiteSpace: "nowrap", fontWeight: 800,
              opacity: (riscada - 0.5) * 2 }}>{e.nota}</span>
          )}
          {riscada > 0 && (
            <div style={{ position: "absolute", left: 16, top: "50%", height: 6, borderRadius: 3,
              width: `calc(${riscada * 100}% - 32px)`, background: tema.cor.errado }} />
          )}
        </div>
      );
    })}
  </div>
);
