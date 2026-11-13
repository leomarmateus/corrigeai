import React from "react";
import { Audio, Sequence } from "remotion";
import type { BlocoNaLinha } from "./narracao";

export const Narracao: React.FC<{ linha: BlocoNaLinha[]; volume?: number }> = ({ linha, volume = 1 }) => (
  <>
    {linha.map((b) => (
      <Sequence key={b.id} from={b.deFrame} durationInFrames={b.frames + 2} name={`voz:${b.id}`}>
        <Audio src={b.src} volume={volume} />
      </Sequence>
    ))}
  </>
);
