// Fórmulas com KaTeX (+ mhchem para química: \ce{CO2 + H2O <=> H2CO3}).
// Encolhe sozinha para caber em `larguraMax` (padrão: miolo da zona segura).
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { continueRender, delayRender } from "remotion";
import katex from "katex";
import "katex/contrib/mhchem";
import "katex/dist/katex.min.css";
import { tema } from "./tema";
import { MIOLO } from "./zona";

export const Formula: React.FC<{
  tex: string;
  tamanho?: number;
  cor?: string;
  larguraMax?: number;
  style?: React.CSSProperties;
}> = ({ tex, tamanho = 64, cor = tema.cor.texto, larguraMax = MIOLO.largura, style }) => {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: false, throwOnError: true, output: "html" }),
    [tex],
  );
  const ref = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const [handle] = useState(() => delayRender(`formula ${tex}`));
  useLayoutEffect(() => {
    const w = ref.current?.scrollWidth ?? 0;
    setEscala(w > larguraMax ? larguraMax / w : 1);
    continueRender(handle);
  }, [html, larguraMax, handle]);
  return (
    <div
      ref={ref}
      style={{
        fontSize: tamanho,
        color: cor,
        whiteSpace: "nowrap",
        display: "inline-block",
        transform: `scale(${escala})`,
        transformOrigin: "50% 50%",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
