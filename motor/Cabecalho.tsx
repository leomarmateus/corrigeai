// Selo fixo no topo da zona segura: prova · questão · matéria.
import React from "react";
import { tema } from "./tema";
import { ZONA } from "./zona";

export const Cabecalho: React.FC<{ prova: string; materia: string; entrada?: number }> = ({
  prova, materia, entrada = 1,
}) => (
  <div style={{ position: "absolute", top: ZONA.y0 + 6, left: 0, right: 0, display: "flex", justifyContent: "center",
    gap: 14, opacity: entrada, transform: `translateY(${(1 - entrada) * -30}px)`, fontFamily: tema.fonte }}>
    <span style={{ background: tema.cor.destaque, color: tema.cor.fundo, fontWeight: 800, fontSize: 34,
      padding: "8px 22px", borderRadius: 999 }}>{prova}</span>
    <span style={{ border: `3px solid ${tema.cor.textoSuave}`, color: tema.cor.texto, fontWeight: 600, fontSize: 34,
      padding: "5px 22px", borderRadius: 999 }}>{materia}</span>
  </div>
);
