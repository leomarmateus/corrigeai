// Capa: banca + pergunta + rotor separando os dois urânios.
import React from "react";
import { Capa as CapaBase } from "../../../../motor/Capa";
import { Rotor } from "./pecas";

export const Capa: React.FC<{ guia?: boolean }> = ({ guia }) => (
  <CapaBase
    banca="ENEM"
    ano={2022}
    questao={97}
    materia="Química"
    pergunta="Como separar dois urânios *quase idênticos*?"
    apoio="Alternativa à efusão, só pela massa"
    visual={<Rotor t={0.4} separacao={0.85} tamanho={500} />}
    guia={guia}
  />
);
