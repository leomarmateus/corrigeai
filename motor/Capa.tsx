// Capa de toda produção (1080×1920). Na grade do perfil o Instagram mostra só o
// recorte central 3:4 (1080×1440, y 240–1680): tudo que importa fica dentro de RECORTE_GRADE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { tema, corDaBanca } from "./tema";

export const RECORTE_GRADE = { y0: 240, y1: 1680 } as const; // 3:4
export const RECORTE_QUADRADO = { y0: 420, y1: 1500 } as const; // 1:1 (prévias antigas/compartilhamento)

export type CapaProps = {
  banca: string; // "ENEM", "UFRGS", "FUVEST", "CEBRASPE"…
  ano: number | string;
  questao?: number | string;
  materia: string;
  /** pergunta da capa; trechos entre *asteriscos* ficam em destaque */
  pergunta: string;
  /** linha menor abaixo da pergunta (o que a questão pede) */
  apoio?: string;
  visual?: React.ReactNode;
  guia?: boolean;
};

const comDestaque = (texto: string) =>
  texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith("*") ? (
      <span key={i} style={{ color: tema.cor.destaque, whiteSpace: "nowrap" }}>{parte.slice(1, -1)}</span>
    ) : (
      <React.Fragment key={i}>{parte}</React.Fragment>
    ),
  );

export const Capa: React.FC<CapaProps> = ({ banca, ano, questao, materia, pergunta, apoio, visual, guia }) => {
  const cor = corDaBanca(banca);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 45%, #1B2230 0%, ${tema.cor.fundo} 72%)`,
      fontFamily: tema.fonte, color: tema.cor.texto }}>
      {/* faixa da banca */}
      <div style={{ position: "absolute", top: RECORTE_GRADE.y0 + 70, left: 0, right: 0, display: "flex",
        flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ background: cor, color: tema.cor.fundo, fontWeight: 800, fontSize: 92, letterSpacing: 2,
          padding: "10px 48px", borderRadius: 26, lineHeight: 1.1 }}>
          {banca} {ano}
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, color: tema.cor.textoSuave, letterSpacing: 1 }}>
          {questao !== undefined ? `Questão ${questao} · ` : ""}{materia}
        </div>
      </div>

      {/* pergunta */}
      <div style={{ position: "absolute", top: RECORTE_GRADE.y0 + 330, left: 90, right: 90, textAlign: "center",
        fontSize: 104, fontWeight: 800, lineHeight: 1.06, letterSpacing: -1 }}>
        {comDestaque(pergunta)}
        {apoio && (
          <div style={{ fontSize: 44, fontWeight: 600, color: tema.cor.textoSuave, marginTop: 28, lineHeight: 1.2,
            letterSpacing: 0 }}>{apoio}</div>
        )}
      </div>

      {/* visual da questão, na parte de baixo do recorte 3:4 */}
      {visual && (
        <div style={{ position: "absolute", top: 1110, bottom: 1920 - RECORTE_GRADE.y1 - 20, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {visual}
        </div>
      )}

      {guia && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect x={4} y={RECORTE_GRADE.y0} width={1072} height={RECORTE_GRADE.y1 - RECORTE_GRADE.y0} fill="none"
            stroke="#ff2bd6" strokeWidth={6} strokeDasharray="20 12" />
          <rect x={4} y={RECORTE_QUADRADO.y0} width={1072} height={RECORTE_QUADRADO.y1 - RECORTE_QUADRADO.y0}
            fill="none" stroke="#2bd6ff" strokeWidth={4} strokeDasharray="10 10" />
          <rect x={0} y={0} width={1080} height={RECORTE_GRADE.y0} fill="rgba(255,43,214,0.15)" />
          <rect x={0} y={RECORTE_GRADE.y1} width={1080} height={1920 - RECORTE_GRADE.y1} fill="rgba(255,43,214,0.15)" />
        </svg>
      )}
    </AbsoluteFill>
  );
};
