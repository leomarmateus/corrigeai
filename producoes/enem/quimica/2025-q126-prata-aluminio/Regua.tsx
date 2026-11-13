// Régua vertical de potenciais-padrão de redução: ΔE° = distância entre dois degraus.
import React from "react";
import { tema } from "../../../../motor/tema";
import { Formula } from "../../../../motor/Formula";

const TOPO = 490; // y de +1,5 V
const BASE = 930; // y de −2,0 V
export const yDe = (v: number) => TOPO + ((1.5 - v) / 3.5) * (BASE - TOPO);
const EIXO_X = 370;
const COLCHETE_X = 590;

type Degrau = { tex: string; v: number; rotulo: string; aparece: number; tag?: { texto: string; cor: string; p: number } };

const Colchete: React.FC<{ de: number; ate: number; p: number; cor: string; rotulo: string; pRotulo: number }> = ({
  de, ate, p, cor, rotulo, pRotulo,
}) => {
  const y0 = yDe(de);
  const y1 = yDe(ate);
  const yAtual = y0 + (y1 - y0) * p;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={COLCHETE_X} y1={y0} x2={COLCHETE_X} y2={yAtual} stroke={cor} strokeWidth={10} strokeLinecap="round" />
        <line x1={COLCHETE_X - 26} y1={y0} x2={COLCHETE_X + 26} y2={y0} stroke={cor} strokeWidth={8} opacity={p > 0 ? 1 : 0} />
        {p > 0.98 && <line x1={COLCHETE_X - 26} y1={y1} x2={COLCHETE_X + 26} y2={y1} stroke={cor} strokeWidth={8} />}
        {p > 0.05 && (
          <polygon
            points={`${COLCHETE_X - 20},${yAtual + (y1 < y0 ? 26 : -26)} ${COLCHETE_X + 20},${yAtual + (y1 < y0 ? 26 : -26)} ${COLCHETE_X},${yAtual}`}
            fill={cor}
          />
        )}
      </svg>
      <div style={{ position: "absolute", left: COLCHETE_X + 50, top: (y0 + y1) / 2 - 45, fontSize: 76, fontWeight: 800,
        color: cor, opacity: pRotulo, transform: `scale(${0.7 + 0.3 * pRotulo})`, transformOrigin: "0 50%",
        whiteSpace: "nowrap" }}>
        {rotulo}
      </div>
    </>
  );
};

export const Regua: React.FC<{
  entrada: number;
  degraus: Degrau[];
  escurecer: { p: number; pRotulo: number };
  clarear: { p: number; pRotulo: number };
  eletrons: number;
  t: number;
}> = ({ entrada, degraus, escurecer, clarear, eletrons, t }) => (
  <div style={{ position: "absolute", inset: 0, opacity: entrada }}>
    {/* eixo */}
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={EIXO_X} y1={TOPO - 30} x2={EIXO_X} y2={BASE + 10} stroke={tema.cor.textoSuave} strokeWidth={6}
        strokeDasharray={`${(BASE - TOPO + 40) * entrada} 2000`} />
      <polygon points={`${EIXO_X - 16},${TOPO - 20} ${EIXO_X + 16},${TOPO - 20} ${EIXO_X},${TOPO - 50}`}
        fill={tema.cor.textoSuave} opacity={entrada} />
    </svg>
    <div style={{ position: "absolute", left: 96, top: 372, fontSize: 32, color: tema.cor.textoSuave,
      fontWeight: 600, whiteSpace: "nowrap" }}>E° de redução</div>

    {degraus.map((d) => {
      const y = yDe(d.v);
      return (
        <div key={d.tex} style={{ opacity: d.aparece }}>
          <div style={{ position: "absolute", left: EIXO_X - 40, top: y - 4, width: 80 * d.aparece, height: 8,
            background: tema.cor.texto, borderRadius: 4 }} />
          <div style={{ position: "absolute", right: 1080 - EIXO_X + 56, top: y - 58, textAlign: "right",
            transform: `translateX(${(1 - d.aparece) * -40}px)` }}>
            <Formula tex={d.tex} tamanho={40} larguraMax={230} />
            <div style={{ fontSize: 44, fontWeight: 800, color: tema.cor.destaque, marginTop: -6 }}>{d.rotulo}</div>
          </div>
          {d.tag && (
            <div style={{ position: "absolute", left: EIXO_X + 56, top: y - 30, fontSize: 36, fontWeight: 800,
              padding: "4px 16px", borderRadius: 12, background: d.tag.cor, color: tema.cor.fundo,
              opacity: d.tag.p, transform: `scale(${0.6 + 0.4 * d.tag.p})`, transformOrigin: "0 50%" }}>
              {d.tag.texto}
            </div>
          )}
        </div>
      );
    })}

    <Colchete de={-0.69} ate={1.23} p={escurecer.p} cor={tema.cor.acento} rotulo="+1,92 V" pRotulo={escurecer.pRotulo} />
    <Colchete de={-1.68} ate={-0.69} p={clarear.p} cor={tema.cor.certo} rotulo="+0,99 V" pRotulo={clarear.pRotulo} />

    {/* elétrons saindo do alumínio para o Ag₂S */}
    {eletrons > 0 &&
      Array.from({ length: 4 }, (_, i) => {
        const fase = (t * 0.8 + i * 0.25) % 1;
        const y = yDe(-1.68) + (yDe(-0.69) - yDe(-1.68)) * fase;
        return (
          <div key={i} style={{ position: "absolute", left: COLCHETE_X - 22, top: y - 22, width: 44, height: 44,
            borderRadius: "50%", background: tema.cor.destaque, color: tema.cor.fundo, fontSize: 22, fontWeight: 800,
            display: "grid", placeItems: "center", opacity: eletrons * Math.sin(fase * Math.PI) }}>e⁻</div>
        );
      })}
  </div>
);
