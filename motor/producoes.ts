// Registro das produções. Cada pasta de produção exporta `Cena` e `duracao` (frames).
// id da composição = caminho com "-" (Remotion só aceita a-z, 0-9 e "-").
import type React from "react";
import * as teste from "../producoes/_exemplo/teste-motor/cena";

export type Producao = { id: string; pasta: string; Cena: React.FC<{ guia?: boolean }>; duracao: number };

export const producoes: Producao[] = [
  { id: "exemplo-teste-motor", pasta: "producoes/_exemplo/teste-motor", ...teste },
];
