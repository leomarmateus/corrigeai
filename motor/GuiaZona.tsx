// Sobreposição da zona segura, só para revisão (prop `guia` da composição).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ZONA } from "./zona";

export const GuiaZona: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920}>
      <path
        d={`M${ZONA.x0},${ZONA.y0} H${ZONA.x1} V${ZONA.y1Coluna} H${ZONA.colunaX} V${ZONA.y1} H${ZONA.x0} Z`}
        fill="none"
        stroke="#ff2bd6"
        strokeWidth={4}
        strokeDasharray="18 10"
      />
      <rect x={ZONA.colunaX} y={ZONA.y1Coluna} width={1080 - ZONA.colunaX} height={1920 - ZONA.y1Coluna}
        fill="rgba(255,43,214,0.12)" />
      <rect x={0} y={ZONA.y1} width={1080} height={1920 - ZONA.y1} fill="rgba(255,43,214,0.12)" />
      <rect x={0} y={0} width={1080} height={ZONA.y0} fill="rgba(255,43,214,0.12)" />
    </svg>
  </AbsoluteFill>
);
