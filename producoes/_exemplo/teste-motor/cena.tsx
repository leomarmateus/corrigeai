// Cena de teste do motor: narração + legenda + fórmula sincronizadas.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tema } from "../../../motor/tema";
import { ZONA } from "../../../motor/zona";
import { Legenda } from "../../../motor/Legenda";
import { Formula } from "../../../motor/Formula";
import { Narracao } from "../../../motor/Narracao";
import { GuiaZona } from "../../../motor/GuiaZona";
import { linhaDoTempo, palavrasAbsolutas, marcaTexto, duracaoTotal, type Tempos } from "../../../motor/narracao";
import tempos from "./narracao/tempos.json";
import hook from "./narracao/hook.mp3";
import meio from "./narracao/meio.mp3";
import fim from "./narracao/fim.mp3";

const linha = linhaDoTempo(tempos as Tempos, { hook, meio, fim }, { inicio: 0.15 });
const palavras = palavrasAbsolutas(linha);
const tCO2 = marcaTexto(linha, "meio", "CO₂");
const tResposta = marcaTexto(linha, "fim", "letra D.");

export const duracao = duracaoTotal(linha);

export const Cena: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pop = (s: number) => spring({ frame: frame - Math.round(s * fps), fps, config: { damping: 12 } });

  const numero = Math.round(interpolate(t, [0.1, 1.2], [0, 90], { extrapolateRight: "clamp" }));
  const sobeHook = interpolate(t, [3.8, 4.4], [0, -40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tema.cor.fundo, fontFamily: tema.fonte, color: tema.cor.texto }}>
      <div style={{ position: "absolute", top: ZONA.y0 + 40 + sobeHook, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 220, fontWeight: 800, color: tema.cor.errado, lineHeight: 1 }}>{numero}%</div>
        <div style={{ fontSize: 56, fontWeight: 600 }}>erraram esta questão</div>
      </div>

      <div style={{ position: "absolute", top: 760, width: "100%", display: "flex", justifyContent: "center",
        opacity: pop(tCO2), transform: `scale(${interpolate(pop(tCO2), [0, 1], [0.7, 1])})` }}>
        <Formula tex={String.raw`\ce{CO2(g) + H2O(l) <=> H2CO3(aq)}`} tamanho={60} />
      </div>

      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center",
        opacity: pop(tResposta) }}>
        <div style={{ fontSize: 150, fontWeight: 800, color: tema.cor.fundo, background: tema.cor.certo,
          borderRadius: 32, padding: "10px 60px", transform: `scale(${pop(tResposta)})` }}>D</div>
      </div>

      <Legenda palavras={palavras} />
      <Narracao linha={linha} />
      {guia && <GuiaZona />}
    </AbsoluteFill>
  );
};
