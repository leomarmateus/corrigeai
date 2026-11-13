import React from "react";
import { Composition, Still } from "remotion";
import { FPS, LARGURA, ALTURA } from "./tema";
import { producoes } from "./producoes";

export const Raiz: React.FC = () => (
  <>
    {producoes.map((p) => (
      <React.Fragment key={p.id}>
        <Composition id={p.id} component={p.Cena} durationInFrames={p.duracao} fps={FPS} width={LARGURA}
          height={ALTURA} defaultProps={{ guia: false }} />
        <Still id={`${p.id}-capa`} component={p.Capa} width={LARGURA} height={ALTURA} defaultProps={{ guia: false }} />
      </React.Fragment>
    ))}
  </>
);
