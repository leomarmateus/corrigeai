// Zona segura do Instagram Reels em 1080×1920 (topo 14%, base 35%, laterais 8%,
// coluna de botões à direita com 21% da largura, onde a base sobe para 40%).
// Texto, fórmula, legenda e logo ficam DENTRO dela; fundo pode sangrar.
export const ZONA = {
  x0: 86,
  x1: 994,
  y0: 269,
  y1: 1248, // fundo útil fora da coluna de botões
  colunaX: 853, // à direita disso o limite de baixo é y1Coluna
  y1Coluna: 1152,
} as const;

// Faixa central que nunca encosta na coluna de botões: centralizada em x=540.
export const MIOLO = { x0: 227, x1: 853, largura: 626 } as const;
