#!/usr/bin/env python3
"""Narração de uma produção: texto -> áudio (OpenAI TTS) -> tempo de cada palavra.

Uso:
  python3 ferramentas/narrar.py <pasta-da-producao> [--voz marin] [--so-alinhar]

Lê  <pasta>/narracao/falas.json   (lista de blocos {"id", "texto"})
Gera <pasta>/narracao/<id>.mp3 e <pasta>/narracao/tempos.json

As palavras da legenda vêm do TEXTO DO ROTEIRO (grafia certa de fórmulas e
números); a transcrição (whisper-1) só fornece os tempos, e um alinhamento
por sequência casa uma coisa com a outra.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.request
import uuid
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MODELO_TTS = "gpt-4o-mini-tts-2025-12-15"
MODELO_STT = "whisper-1"  # único com timestamps por palavra
INSTRUCOES_PADRAO = (
    "Fale em português do Brasil, sotaque brasileiro neutro. "
    "Tom de professor jovem e animado explicando para um amigo, ritmo RÁPIDO de Reels, "
    "frases com energia e sem pausas longas entre elas; só uma pausa curta antes da resposta final. "
    "Números com vírgula lidos como no Brasil (um vírgula vinte e três)."
)


def chave() -> str:
    k = os.environ.get("OPENAI_API_KEY")
    if not k:
        for linha in (RAIZ / ".env").read_text().splitlines():
            if linha.startswith("OPENAI_API_KEY="):
                k = linha.split("=", 1)[1].strip().strip("'\"")
    if not k:
        sys.exit("OPENAI_API_KEY ausente (.env na raiz do projeto)")
    return k


BASE = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
UA = "reels-questoes/0.1"


def tts(texto: str, voz: str, instrucoes: str, destino: Path) -> None:
    corpo = json.dumps({
        "model": MODELO_TTS, "voice": voz, "input": texto,
        "instructions": instrucoes, "response_format": "mp3",
    }).encode()
    req = urllib.request.Request(f"{BASE}/audio/speech", data=corpo, headers={
        "Authorization": f"Bearer {chave()}", "Content-Type": "application/json", "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=180) as r:
        destino.write_bytes(r.read())


def transcrever(audio: Path) -> list[dict]:
    fronteira = uuid.uuid4().hex
    partes = []
    for nome, valor in (("model", MODELO_STT), ("language", "pt"), ("response_format", "verbose_json"),
                        ("timestamp_granularities[]", "word")):
        partes.append(f'--{fronteira}\r\nContent-Disposition: form-data; name="{nome}"\r\n\r\n{valor}\r\n'.encode())
    partes.append((f'--{fronteira}\r\nContent-Disposition: form-data; name="file"; filename="{audio.name}"\r\n'
                   'Content-Type: audio/mpeg\r\n\r\n').encode() + audio.read_bytes() + b"\r\n")
    partes.append(f"--{fronteira}--\r\n".encode())
    req = urllib.request.Request(f"{BASE}/audio/transcriptions", data=b"".join(partes), headers={
        "Authorization": f"Bearer {chave()}", "User-Agent": UA,
        "Content-Type": f"multipart/form-data; boundary={fronteira}"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.load(r)["words"]


def silencios(audio: Path, limiar_db: float, minimo: float) -> list[tuple[float, float]]:
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(audio), "-af",
                          f"silencedetect=n={limiar_db}dB:d={minimo}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    return list(zip(ini, fim))


def ajustar_ritmo(audio: Path, pausa_max: float, velocidade: float) -> None:
    """Acelera a fala (atempo, sem mudar o tom) e encurta cada silêncio para no máximo `pausa_max` s.
    Silêncio do começo é cortado inteiro; o do fim fica com 0,1 s."""
    tmp = audio.with_suffix(".tmp.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(audio), "-af", f"atempo={velocidade}",
                    str(tmp)], check=True)
    cortes = []
    total = duracao(tmp)
    for s, e in silencios(tmp, -40, 0.12):
        if s <= 0.02:
            cortes.append((0.0, max(0.0, e - 0.03)))
        elif e >= total - 0.02:
            cortes.append((s + 0.1, total + 1))
        elif e - s > pausa_max:
            cortes.append((s + pausa_max / 2, e - pausa_max / 2))
    filtro = "anull"
    if cortes:
        expr = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in cortes)
        filtro = f"aselect='not({expr})',asetpts=N/SR/TB"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp), "-af", filtro, "-c:a", "libmp3lame",
                    "-q:a", "2", str(audio)], check=True)
    tmp.unlink()


def duracao(audio: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                          str(audio)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def norm(p: str) -> str:
    p = unicodedata.normalize("NFD", p.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", p)


def alinhar(texto: str, falados: list[dict], fim: float) -> list[dict]:
    """Dá a cada palavra do roteiro um início/fim tirado das palavras transcritas."""
    roteiro = texto.split()
    a = [norm(p) for p in roteiro]
    b = [norm(w["word"]) for w in falados]
    tempos: list[tuple[float, float] | None] = [None] * len(roteiro)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                w = falados[j1 + k]
                tempos[i1 + k] = (w["start"], w["end"])
        elif tag == "replace" and j2 > j1:
            # trecho divergente (ex.: "H2O" x "agá dois ó"): reparte o intervalo falado
            ini, fin = falados[j1]["start"], falados[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                tempos[i1 + k] = (ini + (fin - ini) * k / n, ini + (fin - ini) * (k + 1) / n)
    # buracos (palavras sem par): interpola entre vizinhos
    for i, t in enumerate(tempos):
        if t is None:
            ant = next((tempos[j][1] for j in range(i - 1, -1, -1) if tempos[j]), 0.0)
            prox = next((tempos[j][0] for j in range(i + 1, len(tempos)) if tempos[j]), fim)
            tempos[i] = (ant, max(ant, prox))
    return [{"palavra": p, "inicio": round(t[0], 3), "fim": round(t[1], 3)} for p, t in zip(roteiro, tempos)]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta", type=Path)
    ap.add_argument("--voz", default=None)
    ap.add_argument("--so-alinhar", action="store_true", help="não regera áudio, só tempos")
    args = ap.parse_args()
    pasta = args.pasta.resolve()
    cfg = json.loads((pasta / "narracao" / "falas.json").read_text())
    voz = args.voz or cfg.get("voz", "cedar")
    instrucoes = cfg.get("instrucoes", INSTRUCOES_PADRAO)
    saida = {"voz": voz, "modelo": MODELO_TTS, "blocos": []}
    for bloco in cfg["blocos"]:
        mp3 = pasta / "narracao" / f"{bloco['id']}.mp3"
        if not args.so_alinhar or not mp3.exists():
            print(f"[tts] {bloco['id']} ({voz})", flush=True)
            tts(bloco.get("falado", bloco["texto"]), voz, instrucoes, mp3)
            ajustar_ritmo(mp3, cfg.get("pausa_max", 0.3), cfg.get("velocidade", 1.0))
        dur = duracao(mp3)
        palavras = alinhar(bloco["texto"], transcrever(mp3), dur)
        saida["blocos"].append({"id": bloco["id"], "audio": mp3.name, "duracao": round(dur, 3),
                                "palavras": palavras})
        print(f"[ok] {bloco['id']}: {dur:.1f}s, {len(palavras)} palavras", flush=True)
    (pasta / "narracao" / "tempos.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
