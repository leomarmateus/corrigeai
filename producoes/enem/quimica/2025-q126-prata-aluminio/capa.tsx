// Capa: banca + pergunta + colher meio preta, meio limpa.
import React from "react";
import { Capa as CapaBase } from "../../../../motor/Capa";
import { Colher } from "./Colher";

export const Capa: React.FC<{ guia?: boolean }> = ({ guia }) => (
  <CapaBase
    banca="ENEM"
    ano={2025}
    questao={126}
    materia="Química"
    pergunta="Por que *papel-alumínio* deixa a prata nova?"
    apoio="Qual a ddp de escurecer e de clarear?"
    visual={<Colher t={0.6} sujeira={1} sujeiraDesde={175} brilho={0.3} largura={900} />}
    guia={guia}
  />
);
