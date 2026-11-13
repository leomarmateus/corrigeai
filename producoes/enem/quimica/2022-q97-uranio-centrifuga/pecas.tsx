// Peças visuais da Q97 (urânio): centrífugas, grade de átomos, molécula de UF₆, barreiras de efusão,
// planta da K-25 e rotor visto de cima.
import React from "react";
import { tema } from "../../../../motor/tema";

// ---------- centrífugas (fileira) ----------
export const Centrifugas: React.FC<{
  t: number;
  n?: number;
  largura?: number;
  /** por índice: 0 = normal, 1 = infectada (vermelha, parada, torta) */
  infeccao?: (i: number) => number;
  cor?: string;
}> = ({ t, n = 9, largura = 900, infeccao = () => 0, cor = "#C9D2DC" }) => {
  const passo = largura / n;
  const w = passo * 0.62;
  const h = 300;
  return (
    <svg width={largura} height={h + 40} viewBox={`0 0 ${largura} ${h + 40}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6E7884" />
          <stop offset="0.35" stopColor="#F4F7FA" />
          <stop offset="0.6" stopColor="#B7C0CA" />
          <stop offset="1" stopColor="#5D6670" />
        </linearGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const inf = infeccao(i);
        const x = i * passo + (passo - w) / 2;
        const giro = (t * (1 - inf) * 9 + i * 0.13) % 1; // listras andando = girando
        const tremor = inf > 0 && inf < 1 ? Math.sin(t * 60 + i) * 4 * inf : 0;
        const torto = inf >= 1 ? (i % 2 ? 7 : -5) : inf * (i % 2 ? 7 : -5);
        const corpo = inf > 0 ? `rgb(${201 + 54 * inf},${210 - 120 * inf},${220 - 130 * inf})` : cor;
        return (
          <g key={i} transform={`translate(${x + tremor}, 20) rotate(${torto}, ${w / 2}, ${h})`}>
            <rect width={w} height={h} rx={w / 2.4} fill="url(#metal)" />
            <rect width={w} height={h} rx={w / 2.4} fill={corpo} opacity={0.55} style={{ mixBlendMode: "multiply" }} />
            {[0, 1, 2, 3].map((k) => {
              const y = ((k / 4 + giro) % 1) * (h - 40) + 20;
              return <rect key={k} x={4} y={y} width={w - 8} height={6} rx={3} fill="#fff" opacity={0.35 * (1 - inf)} />;
            })}
            {inf > 0.6 && (
              <path d={`M ${w * 0.3} 60 l ${w * 0.25} 40 l -${w * 0.2} 30 l ${w * 0.3} 50`} stroke="#3A0B0B"
                strokeWidth={4} fill="none" opacity={(inf - 0.6) * 2.5} />
            )}
            <rect x={-6} y={h - 6} width={w + 12} height={18} rx={6} fill="#2A313B" />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- grade de 1.000 átomos: `destaque` deles são urânio-235 ----------
export const Grade: React.FC<{ destaque: number; entrada: number }> = ({ destaque, entrada }) => {
  const cols = 40;
  const rows = 25;
  const passo = 21;
  // posições "aleatórias" fixas para os 235 (não todos juntos)
  const ordem = React.useMemo(() => {
    const idx = Array.from({ length: cols * rows }, (_, i) => i);
    let s = 7;
    for (let i = idx.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return new Map(idx.slice(0, 60).map((v, k) => [v, k]));
  }, []);
  return (
    <svg width={cols * passo} height={rows * passo}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const k = ordem.get(i);
        const amarelo = k !== undefined && k < destaque;
        const aparece = Math.min(1, Math.max(0, entrada * 1.6 - (r / rows) * 0.6));
        return (
          <circle key={i} cx={c * passo + passo / 2} cy={r * passo + passo / 2} r={amarelo ? 8 : 5.5}
            fill={amarelo ? tema.cor.destaque : "#3B4A63"} opacity={aparece} />
        );
      })}
    </svg>
  );
};

// ---------- molécula de UF₆ (projeção do octaedro) ----------
export const UF6: React.FC<{ isotopo: "235" | "238"; tamanho?: number }> = ({ isotopo, tamanho = 220 }) => {
  const c = tamanho / 2;
  const R = tamanho * 0.36;
  const corU = isotopo === "235" ? tema.cor.destaque : "#5B8CFF";
  const fluor = [0, 60, 120, 180, 240, 300].map((a) => [c + R * Math.cos((a * Math.PI) / 180), c + R * 0.8 * Math.sin((a * Math.PI) / 180)]);
  return (
    <svg width={tamanho} height={tamanho}>
      {fluor.map(([x, y], i) => <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#7A8698" strokeWidth={6} />)}
      {fluor.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={tamanho * 0.085} fill="#9BE7A8" />
          <text x={x} y={y + 7} textAnchor="middle" fontSize={tamanho * 0.08} fontWeight={800} fill="#0E1116">F</text>
        </g>
      ))}
      <circle cx={c} cy={c} r={tamanho * 0.17} fill={corU} />
      <text x={c} y={c - 4} textAnchor="middle" fontSize={tamanho * 0.075} fontWeight={800} fill="#0E1116">{isotopo}</text>
      <text x={c} y={c + tamanho * 0.09} textAnchor="middle" fontSize={tamanho * 0.11} fontWeight={800} fill="#0E1116">U</text>
    </svg>
  );
};

// ---------- efusão: moléculas atravessando barreiras porosas em cascata ----------
export const Efusao: React.FC<{ t: number; entrada: number; largura?: number }> = ({ t, entrada, largura = 900 }) => {
  const barreiras = 6;
  const h = 260;
  return (
    <svg width={largura} height={h} style={{ opacity: entrada }}>
      {Array.from({ length: barreiras }, (_, b) => {
        const x = ((b + 1) * largura) / (barreiras + 1);
        return (
          <g key={b}>
            {Array.from({ length: 14 }, (_, k) => (
              <rect key={k} x={x - 4} y={k * (h / 14) + 3} width={8} height={h / 14 - 8} rx={2} fill="#6B7686" />
            ))}
          </g>
        );
      })}
      {Array.from({ length: 26 }, (_, i) => {
        const fase = (t * 0.22 + i * 0.0385) % 1;
        const y = 20 + ((i * 37) % (h - 40)) + Math.sin(t * 4 + i) * 8;
        const pesado = i % 5 !== 0;
        return <circle key={i} cx={fase * largura} cy={y} r={pesado ? 9 : 7}
          fill={pesado ? "#5B8CFF" : tema.cor.destaque} opacity={Math.sin(fase * Math.PI)} />;
      })}
    </svg>
  );
};

// ---------- planta da K-25 (vista de cima, em U) ----------
export const K25: React.FC<{ p: number }> = ({ p }) => {
  const d = "M 60 40 L 60 260 L 840 260 L 840 40 L 760 40 L 760 190 L 140 190 L 140 40 Z";
  return (
    <svg width={900} height={300} viewBox="0 0 900 300">
      <path d={d} fill={`rgba(255,210,63,${0.15 * p})`} stroke={tema.cor.destaque} strokeWidth={8}
        strokeDasharray={`${2600 * p} 4000`} strokeLinejoin="round" />
      {p > 0.9 &&
        Array.from({ length: 30 }, (_, i) => (
          <rect key={i} x={160 + i * 20} y={212} width={10} height={26} fill={tema.cor.destaque} opacity={0.35} />
        ))}
    </svg>
  );
};

// ---------- rotor da centrífuga visto de cima ----------
export const Rotor: React.FC<{ t: number; separacao: number; tamanho?: number }> = ({ t, separacao, tamanho = 560 }) => {
  const c = tamanho / 2;
  const R = c - 20;
  return (
    <svg width={tamanho} height={tamanho}>
      <circle cx={c} cy={c} r={R + 10} fill="#1B2230" stroke="#9AA3AF" strokeWidth={10} />
      {Array.from({ length: 70 }, (_, i) => {
        const pesado = i % 4 !== 0;
        const r0 = ((i * 53) % 97) / 97;
        const raio0 = 0.15 + 0.75 * r0;
        const alvo = pesado ? 0.78 + 0.14 * r0 : 0.12 + 0.3 * r0;
        const raio = (raio0 + (alvo - raio0) * separacao) * R;
        const ang = (i * 137.5 * Math.PI) / 180 + t * 2.4;
        return <circle key={i} cx={c + raio * Math.cos(ang)} cy={c + raio * Math.sin(ang)} r={pesado ? 12 : 10}
          fill={pesado ? "#5B8CFF" : tema.cor.destaque} />;
      })}
      <circle cx={c} cy={c} r={14} fill="#9AA3AF" />
    </svg>
  );
};
