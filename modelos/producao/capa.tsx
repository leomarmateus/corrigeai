// Capa (obrigatória). Exportada também pelo cena.tsx: `export { Capa } from "./capa";`
import React from "react";
import { Capa as CapaBase } from "../../../../motor/Capa";

export const Capa: React.FC<{ guia?: boolean }> = ({ guia }) => (
  <CapaBase
    banca="ENEM" // ENEM, UFRGS, FUVEST… (cor do selo em motor/tema.ts)
    ano={2025}
    questao={0}
    materia="Química"
    pergunta="Pergunta curta com *destaque* entre asteriscos?"
    apoio="O que a questão pede, em uma linha"
    visual={null /* elemento visual da própria cena, parado */}
    guia={guia}
  />
);
