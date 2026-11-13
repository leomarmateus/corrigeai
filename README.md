# Reels de questões (nome provisório: corrigeAi)

Um Reel por questão resolvida (ENEM, UFRGS, concursos), animado por código com
Remotion, narração em pt-BR (OpenAI TTS) e legenda queimada. Postagem manual.

## Estrutura

```
motor/                 componentes comuns (Remotion): legenda, fórmula, narração, zona segura, tema
  producoes.ts         REGISTRO: toda produção nova entra aqui
ferramentas/
  narrar.py            falas.json -> mp3 por bloco + tempos.json (tempo de cada palavra)
  folha.mjs            folha de contato (N quadros numa imagem) para revisar sem renderizar
  render.mjs           MP4 final 1080×1920, 30 fps, −14 LUFS + capa
  capa.mjs             só a capa: saida/capa.png e saida/capa-grade.png (recorte 3:4 do perfil)
modelos/producao/      esqueleto copiado para cada produção nova
marca/MARCA.md         identidade (nome, cores, fontes, tom); ler antes de cada produção
referencias/hooks.md   padrões de hook levantados (educação + virais)
producoes/<dominio>/<materia>/<ano>-q<nn>-<assunto>/   uma pasta por vídeo
```

Domínios: `enem`, `ufrgs`, `concursos/<a definir>`. Matérias: `matematica`,
`quimica`, `fisica`, `biologia`, `historia`, `geografia`… (sem acento, minúsculas).

## Fluxo de uma produção

1. **Questão** → `questao.md`: enunciado, alternativas, gabarito OFICIAL, fonte (PDF/página).
   Nunca usar gabarito que não seja o oficial.
2. **Roteiro** → `roteiro.md`: hook (escolher fórmula em `referencias/hooks.md`), blocos de fala,
   o que aparece na tela em cada bloco, momento da resposta, CTA, texto do post.
   **Aprovação humana do roteiro antes de seguir.**
3. **Narração** → `narracao/falas.json` (um bloco por trecho; `texto` = como aparece na legenda,
   `falado` = como o TTS deve ler, ex.: "CO₂" × "CO dois") e então
   `python3 ferramentas/narrar.py producoes/...`
4. **Cena** → `cena.tsx` (exporta `Cena`, `duracao` e `Capa`) + registrar em `motor/producoes.ts`.
   **Capa obrigatória** (`capa.tsx`, componente `motor/Capa.tsx`): banca + ano em destaque, questão e matéria,
   a pergunta (com *destaque*), uma linha do que a questão pede e um visual parado da cena. Tudo que importa
   dentro do recorte 3:4 da grade do perfil (y 240–1680); `npm run capa -- <pasta> --guia` mostra os recortes.
   Animações ancoradas na fala com `marcaTexto(linha, "bloco", "trecho")`.
5. **Revisão rápida** → `npm run folha -- producoes/... --guia` (quadros + zona segura).
6. **Render** → `npm run render -- producoes/...` → `saida/reel.mp4` + `saida/capa.png`.
   **Aprovação humana do vídeo e da capa.** Depois: `post.txt`.

`npm run studio` abre o Remotion Studio para ajustar ao vivo. `npm run tipos` checa o TypeScript.

## Regras fixas

- Zona segura do Reels (`motor/zona.ts`): texto, fórmula, legenda e logo dentro dela.
- Narração começa até 0,3 s; resposta só nos últimos 10–15 s (ver `referencias/hooks.md`).
- Fato histórico/científico citado no vídeo precisa de fonte anotada no `roteiro.md`.
- Chave da OpenAI só no `.env` (fora do git).
