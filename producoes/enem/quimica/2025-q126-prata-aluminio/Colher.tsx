// Colher de prata sobre papel-alumínio na água com sal.
// sujeira: 0 = prata limpa, 1 = coberta de Ag₂S | brilho: 0..1 faixa de luz varrendo
// bandeja: 0..1 papel-alumínio + água | eletrons: 0..1 fluxo do alumínio para a colher
// corrosao: 0..1 manchas no alumínio (ele se sacrifica)
import React from "react";

const CABO = "M 300 112 C 360 120, 400 124, 440 122 L 740 104 Q 792 102 792 130 Q 792 158 740 156 L 440 138 C 400 136, 360 140, 300 148 Z";

export const Colher: React.FC<{
  t: number;
  sujeira: number;
  brilho?: number;
  bandeja?: number;
  eletrons?: number;
  corrosao?: number;
  largura?: number;
  /** sujeira só à direita deste x (0–800): colher meio limpa, meio preta */
  sujeiraDesde?: number;
}> = ({ t, sujeira, brilho = -1, bandeja = 1, eletrons = 0, corrosao = 0, largura = 860, sujeiraDesde = 0 }) => {
  const faixaX = -200 + brilho * 1200;
  return (
    <svg viewBox="0 0 800 330" width={largura} height={(largura * 330) / 800} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="prata" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#D9DEE5" />
          <stop offset="0.65" stopColor="#9AA3AE" />
          <stop offset="1" stopColor="#E6EAF0" />
        </linearGradient>
        <radialGradient id="concha" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#C8CFD8" />
          <stop offset="1" stopColor="#8A939E" />
        </radialGradient>
        <linearGradient id="aluminio" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9ECEF" />
          <stop offset="0.3" stopColor="#B9C0C8" />
          <stop offset="0.55" stopColor="#F2F4F6" />
          <stop offset="0.8" stopColor="#A9B0B8" />
          <stop offset="1" stopColor="#D5DADF" />
        </linearGradient>
        <filter id="manchas" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 -1.6 1.25" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="formaColher">
          <ellipse cx="170" cy="130" rx="150" ry="95" />
          <path d={CABO} />
        </clipPath>
        <linearGradient id="faixa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* papel-alumínio amassado no fundo do recipiente */}
      <g opacity={bandeja}>
        <path d="M 10 230 L 120 214 L 260 236 L 400 210 L 540 232 L 680 212 L 790 228 L 790 318 L 10 318 Z"
          fill="url(#aluminio)" />
        {[60, 190, 330, 470, 610, 740].map((x, i) => (
          <path key={i} d={`M ${x} ${222 + (i % 2) * 10} l 24 40 l -18 30`} stroke="#8D959E" strokeWidth="2"
            fill="none" opacity="0.6" />
        ))}
        {/* corrosão do alumínio */}
        {[[120, 270, 26], [300, 255, 20], [450, 285, 30], [620, 262, 22], [720, 295, 16]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r * corrosao} ry={r * 0.6 * corrosao} fill="#6F767E" opacity="0.7" />
        ))}
      </g>

      {/* colher */}
      <g>
        <path d={CABO} fill="url(#prata)" stroke="#7D8691" strokeWidth="2" />
        <ellipse cx="170" cy="130" rx="150" ry="95" fill="url(#concha)" stroke="#7D8691" strokeWidth="2" />
        <ellipse cx="150" cy="105" rx="70" ry="30" fill="#fff" opacity={sujeiraDesde > 0 ? 0.55 : 0.55 * (1 - sujeira)} />
        <g clipPath="url(#formaColher)">
          <rect x={sujeiraDesde} y="0" width={800 - sujeiraDesde} height="260" fill="#3A2C1E" opacity={0.85 * sujeira} />
          <rect x={sujeiraDesde} y="0" width={800 - sujeiraDesde} height="260" fill="#000" filter="url(#manchas)"
            opacity={sujeira} />
          {brilho >= 0 && brilho <= 1 && (
            <rect x={faixaX} y="-40" width="160" height="340" fill="url(#faixa)" transform={`skewX(-20)`} />
          )}
        </g>
      </g>

      {/* água com sal por cima de tudo */}
      <g opacity={bandeja}>
        <rect x="0" y="60" width="800" height="270" rx="24" fill="#5B8CFF" opacity="0.16" />
        <path d={`M 0 ${62 + Math.sin(t * 2) * 3} Q 200 ${52 + Math.sin(t * 2.3) * 4} 400 62 T 800 ${60 + Math.cos(t * 2) * 3}`}
          stroke="#9DB8FF" strokeWidth="4" fill="none" opacity="0.6" />
        {Array.from({ length: 9 }, (_, i) => {
          const fase = (t * 0.45 + i * 0.37) % 1;
          return <circle key={i} cx={60 + i * 85 + Math.sin(t * 3 + i) * 6} cy={310 - fase * 240} r={4 + (i % 3) * 2}
            fill="none" stroke="#BFD1FF" strokeWidth="2" opacity={0.7 * (1 - fase)} />;
        })}
      </g>

      {/* elétrons do alumínio subindo para a colher */}
      {eletrons > 0 &&
        Array.from({ length: 10 }, (_, i) => {
          const fase = (t * 0.9 + i * 0.1) % 1;
          const x = 80 + i * 68;
          const y = 280 - fase * 150;
          return (
            <g key={i} opacity={eletrons * Math.sin(fase * Math.PI)}>
              <circle cx={x} cy={y} r="13" fill="#FFD23F" />
              <text x={x} y={y + 6} fontSize="16" fontWeight="800" textAnchor="middle" fill="#0E1116">e⁻</text>
            </g>
          );
        })}
    </svg>
  );
};
