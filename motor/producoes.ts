// Registro das produções. Cada pasta de produção exporta:
//   Cena (vídeo), duracao (frames) e Capa (OBRIGATÓRIA: banca + pergunta).
// id da composição = caminho com "-" (Remotion só aceita a-z, 0-9 e "-"); a capa vira "<id>-capa".
import type React from "react";
import * as q126prata from "../producoes/enem/quimica/2025-q126-prata-aluminio/cena";
import * as q97uranio from "../producoes/enem/quimica/2022-q97-uranio-centrifuga/cena";

type ComGuia = React.FC<{ guia?: boolean }>;
export type Producao = { id: string; pasta: string; Cena: ComGuia; duracao: number; Capa: ComGuia };

export const producoes: Producao[] = [
  { id: "enem-quimica-2025-q126-prata-aluminio", pasta: "producoes/enem/quimica/2025-q126-prata-aluminio", ...q126prata },
  { id: "enem-quimica-2022-q97-uranio-centrifuga", pasta: "producoes/enem/quimica/2022-q97-uranio-centrifuga", ...q97uranio },
];
