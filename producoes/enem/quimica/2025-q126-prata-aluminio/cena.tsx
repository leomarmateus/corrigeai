// ENEM 2025 · Q126 · prata + papel-alumínio (eletroquímica). Gabarito: B.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { tema } from "../../../../motor/tema";
import { ZONA } from "../../../../motor/zona";
import { Legenda } from "../../../../motor/Legenda";
import { Formula } from "../../../../motor/Formula";
import { Narracao } from "../../../../motor/Narracao";
import { GuiaZona } from "../../../../motor/GuiaZona";
import { Cabecalho } from "../../../../motor/Cabecalho";
import { Alternativas } from "../../../../motor/Alternativas";
import { entra, rampa, janela } from "../../../../motor/anim";
import { linhaDoTempo, palavrasAbsolutas, marca, marcaTexto, duracaoTotal, type Tempos } from "../../../../motor/narracao";
import { Colher } from "./Colher";
import { Regua } from "./Regua";
import tempos from "./narracao/tempos.json";
import hook from "./narracao/hook.mp3";
import contexto from "./narracao/contexto.mp3";
import pegadinha from "./narracao/pegadinha.mp3";
import escala from "./narracao/escala.mp3";
import escurecer from "./narracao/escurecer.mp3";
import clarear from "./narracao/clarear.mp3";
import resposta from "./narracao/resposta.mp3";
import cta from "./narracao/cta.mp3";

const linha = linhaDoTempo(
  tempos as Tempos,
  { hook, contexto, pegadinha, escala, escurecer, clarear, resposta, cta },
  { inicio: 0.1, pausaPadrao: 0.22, pausas: { resposta: 0.45, cta: 0.35 } },
);
const palavras = palavrasAbsolutas(linha);
const m = (bloco: string, trecho: string) => marcaTexto(linha, bloco, trecho);

const T = {
  brilho: m("hook", "volta"),
  enem: m("hook", "ENEM."),
  escurece: m("contexto", "escurece"),
  sulfeto: m("contexto", "sulfeto"),
  voltagem: m("contexto", "voltagem"),
  peg: marca(linha, "pegadinha"),
  dois: m("pegadinha", "dois,"),
  tres: m("pegadinha", "três."),
  nao: m("pegadinha", "não!"),
  tresAlt: m("pegadinha", "Três alternativas"),
  escala: marca(linha, "escala"),
  al: m("escala", "alumínio"),
  ag: m("escala", "Sulfeto"),
  o2: m("escala", "Oxigênio"),
  pOxida: m("escurecer", "oxida,"),
  o2Reduz: m("escurecer", "reduz."),
  distancia1: m("escurecer", "distância:"),
  v192: m("escurecer", "1,92"),
  clarearIni: marca(linha, "clarear"),
  alOxida: m("clarear", "oxida"),
  devolve: m("clarear", "devolve"),
  distancia2: m("clarear", "Distância:"),
  v099: m("clarear", "0,99"),
  resposta: marca(linha, "resposta"),
  letra: m("resposta", "Letra"),
  cta: marca(linha, "cta"),
  sacrifica: m("cta", "sacrifica"),
};

export const duracao = duracaoTotal(linha, 1.0);

const ALTS = [
  { letra: "A", texto: "+0,54 V e +2,37 V" },
  { letra: "B", texto: "+1,92 V e +0,99 V" },
  { letra: "C", texto: "−0,15 V e +5,43 V" },
  { letra: "D", texto: "+2,61 V e +1,29 V" },
  { letra: "E", texto: "+0,15 V e −1,29 V" },
];

const Ficha: React.FC<{ titulo: string; valor: string; cor: string; p: number }> = ({ titulo, valor, cor, p }) => (
  <div style={{ flex: 1, padding: "18px 24px", borderRadius: 24, background: tema.cor.fundo2,
    border: `4px solid ${cor}`, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
    <div style={{ fontSize: 38, fontWeight: 800, color: cor, letterSpacing: 2 }}>{titulo}</div>
    <div style={{ fontSize: 64, fontWeight: 800 }}>{valor}</div>
  </div>
);

export const Cena: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const e = (t0: number, a = 14) => entra(frame, fps, t0, a);

  // ---------- cena 1: colher na bandeja (hook + contexto) ----------
  const c1 = 1 - rampa(t, T.voltagem - 0.2, T.voltagem + 0.25);
  const sujeira = t < T.escurece ? 1 - rampa(t, T.brilho, T.brilho + 1.4) : rampa(t, T.escurece, T.escurece + 1.2);
  const brilho = rampa(t, T.brilho, T.brilho + 1.4, 0, 1);
  const relogio = Math.floor(rampa(t, T.brilho - 0.6, T.brilho + 1.4, 0, 180));
  const descida = rampa(t, 0, 0.9, -120, 0);

  // ---------- cena final: colher limpa de novo ----------
  const cF = rampa(t, T.cta - 0.15, T.cta + 0.3);

  // ---------- cena 2: pergunta + alternativas ----------
  const c2 = janela(t, T.voltagem, T.peg + 0.15);

  // ---------- cena 3: pegadinha ----------
  const c3 = janela(t, T.peg, T.tresAlt + 0.1);
  const mult = t < T.tres ? "2" : "3";
  const pMult = e(T.dois - 0.1);
  const voo = rampa(t, T.nao - 0.7, T.nao - 0.1);
  const pX = e(T.nao - 0.1, 9);

  // ---------- cena 4: alternativas riscadas ----------
  const c4 = janela(t, T.tresAlt, T.escala + 0.1);
  const risca = (i: number) => rampa(t, T.tresAlt + 0.35 + i * 0.35, T.tresAlt + 0.65 + i * 0.35);

  // ---------- cena 5: régua ----------
  const c5 = janela(t, T.escala, T.resposta + 0.1);

  // ---------- cena 6: resposta ----------
  const c6 = janela(t, T.resposta, T.cta + 0.1);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 35%, #1B2230 0%, ${tema.cor.fundo} 70%)`,
      fontFamily: tema.fonte, color: tema.cor.texto }}>
      <Cabecalho prova="ENEM 2025 · Q126" materia="Química" entrada={e(T.enem - 0.1)} />

      {/* cena 1 */}
      {c1 > 0 && (
        <AbsoluteFill style={{ opacity: c1 }}>
          <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontSize: 92,
            fontWeight: 800, lineHeight: 1.05, opacity: 1 - rampa(t, T.escurece - 0.3, T.escurece) }}>
            <span style={{ color: tema.cor.textoSuave }}>alumínio</span> + <span style={{ color: "#9DB8FF" }}>sal</span>
            <div style={{ fontSize: 64, color: tema.cor.destaque, marginTop: 8 }}>
              ⏱ {Math.floor(relogio / 60)}:{String(relogio % 60).padStart(2, "0")}
            </div>
          </div>
          <div style={{ position: "absolute", top: 610 + descida, left: 140 }}>
            <Colher largura={800} t={t} sujeira={sujeira} brilho={t > T.brilho && t < T.brilho + 1.4 ? brilho : -1}
              eletrons={janela(t, T.brilho - 0.2, T.brilho + 1.8)} />
          </div>
          <div style={{ position: "absolute", top: 520, left: 150, opacity: e(T.sulfeto), fontSize: 50, fontWeight: 800,
            padding: "8px 22px", background: "#3A2C1E", borderRadius: 16, border: "3px solid #8A6B45" }}>
            <Formula tex={String.raw`\ce{Ag2S}`} tamanho={56} style={{ display: "inline-block" }} />
            <span style={{ fontSize: 36, marginLeft: 14 }}>sulfeto de prata</span>
          </div>
        </AbsoluteFill>
      )}

      {/* cena 2 */}
      {c2 > 0 && (
        <AbsoluteFill style={{ opacity: c2 }}>
          <div style={{ position: "absolute", top: 380, left: 140, right: 140, display: "flex", gap: 28 }}>
            <Ficha titulo="ESCURECER" valor="? V" cor="#B08D57" p={e(T.voltagem + 0.2)} />
            <Ficha titulo="CLAREAR" valor="? V" cor={tema.cor.destaque} p={e(T.voltagem + 0.6)} />
          </div>
          <div style={{ position: "absolute", top: 560, left: 160 }}>
            <Alternativas itens={ALTS} entrada={rampa(t, T.voltagem + 0.5, T.voltagem + 1.3)} tamanho={38} />
          </div>
        </AbsoluteFill>
      )}

      {/* cena 3 */}
      {c3 > 0 && (
        <AbsoluteFill style={{ opacity: c3 }}>
          <div style={{ position: "absolute", top: 390, left: 0, right: 0, textAlign: "center", fontSize: 70,
            fontWeight: 800, color: tema.cor.errado }}>A PEGADINHA</div>
          <div style={{ position: "absolute", top: 540, left: 120, right: 120, padding: "30px 20px", borderRadius: 28,
            background: tema.cor.fundo2, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <span style={{ fontSize: 96, fontWeight: 800, color: tema.cor.destaque, opacity: pMult,
              transform: `scale(${pMult})` }}>{mult}×</span>
            <Formula tex={String.raw`(\ce{Ag2S + 2e- -> 2Ag + S^2-})`} tamanho={46} larguraMax={620} />
          </div>
          <div style={{ position: "absolute", top: 740, left: 0, right: 0, display: "flex", justifyContent: "center",
            alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 66, fontWeight: 800 }}>E° = −0,69 V</span>
          </div>
          {/* o "×3" tenta pular para o E° */}
          <div style={{ position: "absolute", left: 150 + voo * 40, top: 610 + voo * 140, fontSize: 60, fontWeight: 800,
            color: tema.cor.destaque, opacity: voo > 0 && voo < 1 ? 0.8 : voo >= 1 ? 1 - pX : 0 }}>{mult}×</div>
          <div style={{ position: "absolute", top: 860, left: 0, right: 0, textAlign: "center", opacity: pX,
            transform: `scale(${1.4 - 0.4 * pX}) rotate(-4deg)` }}>
            <span style={{ fontSize: 58, fontWeight: 800, color: tema.cor.fundo, background: tema.cor.errado,
              padding: "10px 30px", borderRadius: 14 }}>✕ E° NÃO MULTIPLICA</span>
          </div>
        </AbsoluteFill>
      )}

      {/* cena 4 */}
      {c4 > 0 && (
        <AbsoluteFill style={{ opacity: c4 }}>
          <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontSize: 54,
            fontWeight: 800 }}>multiplicou o E°? caiu em…</div>
          <div style={{ position: "absolute", top: 520, left: 160 }}>
            <Alternativas itens={ALTS} tamanho={38}
              estado={{ C: { riscada: risca(0), nota: "×coef." }, D: { riscada: risca(1), nota: "×coef." },
                E: { riscada: risca(2), nota: "×coef." } }} />
          </div>
        </AbsoluteFill>
      )}

      {/* cena 5 */}
      {c5 > 0 && (
        <AbsoluteFill style={{ opacity: c5 }}>
          <Regua
            t={t}
            entrada={e(T.escala)}
            degraus={[
              { tex: String.raw`\ce{O2 -> H2O}`, v: 1.23, rotulo: "+1,23", aparece: e(T.o2),
                tag: { texto: "reduz", cor: tema.cor.certo, p: e(T.o2Reduz) } },
              { tex: String.raw`\ce{Ag2S -> Ag}`, v: -0.69, rotulo: "−0,69", aparece: e(T.ag),
                tag: t < T.clarearIni
                  ? { texto: "oxida", cor: tema.cor.errado, p: e(T.pOxida) }
                  : { texto: "reduz", cor: tema.cor.certo, p: e(T.devolve) } },
              { tex: String.raw`\ce{Al^3+ -> Al}`, v: -1.68, rotulo: "−1,68", aparece: e(T.al),
                tag: { texto: "oxida", cor: tema.cor.errado, p: e(T.alOxida) } },
            ]}
            escurecer={{ p: rampa(t, T.distancia1, T.v192), pRotulo: e(T.v192) }}
            clarear={{ p: rampa(t, T.distancia2, T.v099), pRotulo: e(T.v099) }}
            eletrons={janela(t, T.devolve, T.resposta)}
          />
          <div style={{ position: "absolute", top: 372, left: 520, fontSize: 32, color: tema.cor.textoSuave, whiteSpace: "nowrap",
            opacity: rampa(t, T.distancia1, T.distancia1 + 0.4) }}>ΔE° = de cima − de baixo</div>
        </AbsoluteFill>
      )}

      {/* cena 6 */}
      {c6 > 0 && (
        <AbsoluteFill style={{ opacity: c6 }}>
          <div style={{ position: "absolute", top: 380, left: 140, right: 140, display: "flex", gap: 28 }}>
            <Ficha titulo="ESCURECER" valor="+1,92 V" cor="#B08D57" p={1} />
            <Ficha titulo="CLAREAR" valor="+0,99 V" cor={tema.cor.destaque} p={1} />
          </div>
          <div style={{ position: "absolute", top: 560, left: 160 }}>
            <Alternativas itens={ALTS} tamanho={38}
              estado={{
                A: { riscada: rampa(t, T.letra - 0.4, T.letra), nota: "somou" },
                B: { certa: e(T.letra, 10) },
                C: { riscada: 1 }, D: { riscada: 1 }, E: { riscada: 1 },
              }} />
          </div>
        </AbsoluteFill>
      )}

      {/* cena final */}
      {cF > 0 && (
        <AbsoluteFill style={{ opacity: cF }}>
          <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontSize: 84,
            fontWeight: 800, lineHeight: 1.05 }}>
            o alumínio<br /><span style={{ color: tema.cor.destaque }}>se sacrifica</span>
          </div>
          <div style={{ position: "absolute", top: 600, left: 160 }}>
            <Colher largura={760} t={t} sujeira={0} brilho={rampa(t, T.cta + 0.2, T.cta + 1.4)} corrosao={rampa(t, T.sacrifica, T.sacrifica + 1)}
              eletrons={janela(t, T.sacrifica, duracao / fps)} />
          </div>
        </AbsoluteFill>
      )}

      <Legenda palavras={palavras} />
      <Narracao linha={linha} />
      {guia && <GuiaZona />}
    </AbsoluteFill>
  );
};
