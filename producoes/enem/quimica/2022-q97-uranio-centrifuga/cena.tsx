// ENEM 2022 · Q97 · enriquecimento de urânio (separação de misturas). Gabarito: B.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { tema, corDaBanca } from "../../../../motor/tema";
import { Legenda } from "../../../../motor/Legenda";
import { Narracao } from "../../../../motor/Narracao";
import { GuiaZona } from "../../../../motor/GuiaZona";
import { Cabecalho } from "../../../../motor/Cabecalho";
import { Alternativas } from "../../../../motor/Alternativas";
import { entra, rampa, janela } from "../../../../motor/anim";
import { linhaDoTempo, palavrasAbsolutas, marca, marcaTexto, duracaoTotal, type Tempos } from "../../../../motor/narracao";
import { Centrifugas, Grade, UF6, Efusao, K25, Rotor } from "./pecas";
import tempos from "./narracao/tempos.json";
import hook from "./narracao/hook.mp3";
import enriquecer from "./narracao/enriquecer.mp3";
import massa from "./narracao/massa.mp3";
import efusao from "./narracao/efusao.mp3";
import eliminar from "./narracao/eliminar.mp3";
import resposta from "./narracao/resposta.mp3";
import cta from "./narracao/cta.mp3";

export { Capa } from "./capa";

const linha = linhaDoTempo(
  tempos as Tempos,
  { hook, enriquecer, massa, efusao, eliminar, resposta, cta },
  { inicio: 0.1, pausaPadrao: 0.22, pausas: { resposta: 0.35, cta: 1.0 } },
);
const palavras = palavrasAbsolutas(linha);
const m = (bloco: string, trecho: string) => marcaTexto(linha, bloco, trecho);

const T = {
  virus: m("hook", "vírus"),
  destruiu: m("hook", "destruiu"),
  ira: m("hook", "Irã."),
  centrifugas: m("hook", "eram centrífugas"),
  enem: m("hook", "ENEM."),
  enriquecer: marca(linha, "enriquecer"),
  p07: m("enriquecer", "0,7%"),
  p3: m("enriquecer", "3%."),
  massa: marca(linha, "massa"),
  i235: m("massa", "235"),
  i238: m("massa", "238"),
  quimica: m("massa", "mesma química."),
  m349: m("massa", "349"),
  m352: m("massa", "352."),
  menos: m("massa", "Menos"),
  efusao: marca(linha, "efusao"),
  milhares: m("efusao", "milhares"),
  k25: m("efusao", "K-25,"),
  maior: m("efusao", "maior"),
  eliminar: marca(linha, "eliminar"),
  tamanho: m("eliminar", "Mesmo tamanho."),
  solvente: m("eliminar", "Mesma química."),
  ebulicao: m("eliminar", "Mesma ebulição."),
  ima: m("eliminar", "Não distingue"),
  resposta: marca(linha, "resposta"),
  girando: m("resposta", "girando"),
  parede: m("resposta", "parede."),
  letra: m("resposta", "Letra"),
  cta: marca(linha, "cta"),
  marinha: m("cta", "Marinha,"),
  resende: m("cta", "Resende."),
};

export const duracao = duracaoTotal(linha, 1.0);

const ALTS = [
  { letra: "A", texto: "Peneiração" },
  { letra: "B", texto: "Centrifugação" },
  { letra: "C", texto: "Extração por solvente" },
  { letra: "D", texto: "Destilação fracionada" },
  { letra: "E", texto: "Separação magnética" },
];

const Titulo: React.FC<{ children: React.ReactNode; top?: number; p?: number; cor?: string; tamanho?: number }> = ({
  children, top = 380, p = 1, cor = tema.cor.texto, tamanho = 64,
}) => (
  <div style={{ position: "absolute", top, left: 90, right: 90, textAlign: "center", fontSize: tamanho, fontWeight: 800,
    lineHeight: 1.08, color: cor, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>{children}</div>
);

export const Cena: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const e = (t0: number, a = 14) => entra(frame, fps, t0, a);

  // cena 1: centrífugas + vírus
  const c1 = 1 - rampa(t, T.enriquecer - 0.2, T.enriquecer + 0.2);
  const ataque = (i: number) => rampa(t, T.destruiu + i * 0.22, T.destruiu + i * 0.22 + 0.9);
  const contador = Math.round(rampa(t, T.destruiu, T.ira + 0.3, 0, 1000));

  // cena 2: grade de átomos
  const c2 = janela(t, T.enriquecer, T.massa + 0.1);
  const destaque = t < T.p3 ? (t >= T.p07 ? 7 : 0) : Math.round(rampa(t, T.p3, T.p3 + 0.8, 7, 30));

  // cena 3: balança de massas
  const c3 = janela(t, T.massa, T.efusao + 0.1);
  const inclina = rampa(t, T.m352, T.m352 + 0.8, 0, 2.2);

  // cena 4: efusão + K-25
  const c4 = janela(t, T.efusao, T.eliminar + 0.1);

  // cena 5: eliminar alternativas
  const c5 = janela(t, T.eliminar, T.resposta + 0.1);
  const r = (t0: number) => rampa(t, t0, t0 + 0.4);

  // cena 6: rotor
  const c6 = janela(t, T.resposta, T.cta + 0.1);

  // cena 7: Brasil
  const c7 = rampa(t, T.cta - 0.1, T.cta + 0.3);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 35%, #1B2230 0%, ${tema.cor.fundo} 70%)`,
      fontFamily: tema.fonte, color: tema.cor.texto }}>
      <Cabecalho prova="ENEM 2022 · Q97" materia="Química" cor={corDaBanca("ENEM")} entrada={e(T.enem - 0.1)} />

      {c1 > 0 && (
        <AbsoluteFill style={{ opacity: c1 }}>
          <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center",
            gap: 16 }}>
            <span style={{ opacity: e(T.virus), fontFamily: tema.fonteMono, fontSize: 40, fontWeight: 700, color: tema.cor.errado,
              border: `3px solid ${tema.cor.errado}`, padding: "4px 16px", borderRadius: 10,
              transform: `translateX(${Math.sin(t * 40) * 3 * (t < T.ira ? 1 : 0)}px)` }}>⚠ STUXNET</span>
            <span style={{ fontSize: 40, fontWeight: 600, color: tema.cor.textoSuave, padding: "6px 0", order: -1 }}>Irã · 2010</span>
          </div>
          <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontSize: 120,
            fontWeight: 800, color: t < T.destruiu ? tema.cor.texto : tema.cor.errado }}>
            {t < T.destruiu ? "?" : `≈ ${contador.toLocaleString("pt-BR")}`}
            <div style={{ fontSize: 44, color: tema.cor.texto, marginTop: -6, opacity: e(T.centrifugas) }}>
              centrífugas de urânio
            </div>
          </div>
          <div style={{ position: "absolute", top: 660, left: 90 }}>
            <Centrifugas t={t} infeccao={ataque} />
          </div>
        </AbsoluteFill>
      )}

      {c2 > 0 && (
        <AbsoluteFill style={{ opacity: c2 }}>
          <Titulo top={370} tamanho={52}>
            <span style={{ color: tema.cor.destaque }}>urânio-235</span> em 1.000 átomos
          </Titulo>
          <div style={{ position: "absolute", top: 470, left: 120 }}>
            <Grade destaque={destaque} entrada={rampa(t, T.enriquecer, T.enriquecer + 1)} />
          </div>
          <div style={{ position: "absolute", top: 740, left: 0, right: 0, display: "flex", justifyContent: "center",
            gap: 40, fontSize: 96, fontWeight: 800, textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>
            <span style={{ opacity: e(T.p07), color: t >= T.p3 ? tema.cor.textoSuave : tema.cor.destaque }}>0,7%</span>
            <span style={{ opacity: e(T.p3) }}>→</span>
            <span style={{ opacity: e(T.p3), color: tema.cor.destaque }}>3%</span>
          </div>
        </AbsoluteFill>
      )}

      {c3 > 0 && (
        <AbsoluteFill style={{ opacity: c3 }}>
          <Titulo top={370} p={e(T.quimica)}>mesma química. <span style={{ color: tema.cor.destaque }}>massa?</span></Titulo>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <g transform={`rotate(${inclina}, 540, 690)`}>
              <rect x={170} y={684} width={740} height={12} rx={6} fill="#9AA3AF" />
            </g>
            <polygon points="540,696 510,790 570,790" fill="#9AA3AF" />
          </svg>
          {[
            { iso: "235" as const, x: 170, t0: T.i235, massa: "349", tm: T.m349, dy: -inclina * 9 },
            { iso: "238" as const, x: 690, t0: T.i238, massa: "352", tm: T.m352, dy: inclina * 9 },
          ].map((mol) => (
            <div key={mol.iso} style={{ position: "absolute", left: mol.x, top: 466 + mol.dy, width: 220,
              textAlign: "center", opacity: e(mol.t0), transform: `scale(${0.6 + 0.4 * e(mol.t0)})` }}>
              <UF6 isotopo={mol.iso} />
              <div style={{ fontSize: 52, fontWeight: 800, color: tema.cor.destaque, opacity: e(mol.tm), marginTop: 110 }}>
                {mol.massa} u
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", opacity: e(T.menos) }}>
            <span style={{ fontSize: 64, fontWeight: 800, background: tema.cor.fundo2, padding: "8px 30px",
              borderRadius: 18, border: `3px solid ${tema.cor.destaque}` }}>diferença &lt; 1%</span>
          </div>
        </AbsoluteFill>
      )}

      {c4 > 0 && (
        <AbsoluteFill style={{ opacity: c4 }}>
          <Titulo top={370} tamanho={50}>efusão: <span style={{ color: tema.cor.textoSuave }}>barreira após barreira</span></Titulo>
          <div style={{ position: "absolute", top: 470, left: 90, opacity: 1 - rampa(t, T.k25 - 0.3, T.k25) }}>
            <Efusao t={t} entrada={e(T.efusao)} />
            <div style={{ textAlign: "center", fontSize: 54, fontWeight: 800, color: tema.cor.destaque,
              opacity: e(T.milhares), marginTop: 10 }}>× milhares de vezes</div>
          </div>
          <div style={{ position: "absolute", top: 520, left: 90, opacity: rampa(t, T.k25 - 0.2, T.k25 + 0.2) }}>
            <K25 p={rampa(t, T.k25 - 0.1, T.k25 + 1.2)} />
            <div style={{ textAlign: "center", fontSize: 46, fontWeight: 600, color: tema.cor.textoSuave, marginTop: -6 }}>
              K-25 · Oak Ridge (EUA) · 1945
            </div>
            <div style={{ textAlign: "center", fontSize: 60, fontWeight: 800, color: tema.cor.destaque, opacity: e(T.maior),
              marginTop: 10 }}>maior prédio do mundo</div>
          </div>
        </AbsoluteFill>
      )}

      {c5 > 0 && (
        <AbsoluteFill style={{ opacity: c5 }}>
          <Titulo top={370} tamanho={50}>só a <span style={{ color: tema.cor.destaque }}>massa</span> muda. o que separa?</Titulo>
          <div style={{ position: "absolute", top: 470, left: 140 }}>
            <Alternativas itens={ALTS} tamanho={44} largura={800}
              entrada={rampa(t, T.eliminar - 0.3, T.eliminar + 0.4)}
              estado={{
                A: { riscada: r(T.tamanho), nota: "mesmo tamanho" },
                C: { riscada: r(T.solvente), nota: "mesma química" },
                D: { riscada: r(T.ebulicao), nota: "mesma ebulição" },
                E: { riscada: r(T.ima), nota: "ímã não separa" },
              }} />
          </div>
        </AbsoluteFill>
      )}

      {c6 > 0 && (
        <AbsoluteFill style={{ opacity: c6 }}>
          <div style={{ position: "absolute", top: 360, left: 260 }}>
            <Rotor t={t} separacao={rampa(t, T.girando, T.parede + 0.3)} />
          </div>
          <div style={{ position: "absolute", top: 360, left: 90, fontSize: 36, fontWeight: 700, lineHeight: 1.5 }}>
            <div style={{ color: "#5B8CFF" }}>● 238</div>
            <div style={{ color: tema.cor.destaque }}>● 235</div>
          </div>
          <div style={{ position: "absolute", top: 770, left: 0, right: 0, display: "flex", justifyContent: "center",
            opacity: e(T.letra, 10), transform: `scale(${0.6 + 0.4 * e(T.letra, 10)})` }}>
            <span style={{ fontSize: 70, fontWeight: 800, color: tema.cor.fundo, background: tema.cor.certo,
              padding: "8px 36px", borderRadius: 22 }}>B · Centrifugação</span>
          </div>
        </AbsoluteFill>
      )}

      {c7 > 0 && (
        <AbsoluteFill style={{ opacity: c7 }}>
          <Titulo top={370} p={e(T.cta)} tamanho={84}>
            <span style={{ color: tema.cor.certo }}>BRASIL</span>
          </Titulo>
          <Titulo top={470} p={e(T.resende)} tamanho={46} cor={tema.cor.textoSuave}>INB · Resende (RJ)</Titulo>
          <div style={{ position: "absolute", top: 560, left: 90 }}>
            <Centrifugas t={t} cor="#7FE0B0" />
          </div>
          <Titulo top={920} p={e(T.marinha)} tamanho={44} cor={tema.cor.destaque}>centrífugas da Marinha</Titulo>
        </AbsoluteFill>
      )}

      <Legenda palavras={palavras} />
      <Narracao linha={linha} />
      {guia && <GuiaZona />}
    </AbsoluteFill>
  );
};
