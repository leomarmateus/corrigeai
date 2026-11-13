import React from "react";
import { Composition } from "remotion";
import { FPS, LARGURA, ALTURA } from "./tema";
import { producoes } from "./producoes";

export const Raiz: React.FC = () => (
  <>
    {producoes.map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={p.Cena}
        durationInFrames={p.duracao}
        fps={FPS}
        width={LARGURA}
        height={ALTURA}
        defaultProps={{ guia: false }}
      />
    ))}
  </>
);
