// Atalhos de animação baseados em tempo (s), para ancorar tudo na narração.
import { interpolate, spring, Easing } from "remotion";

/** 0→1 com mola a partir de t0 (s). */
export const entra = (frame: number, fps: number, t0: number, amortecimento = 14) =>
  spring({ frame: frame - Math.round(t0 * fps), fps, config: { damping: amortecimento, stiffness: 180 } });

/** Interpolação linear com trava, em segundos, com suavização. */
export const rampa = (t: number, t0: number, t1: number, de = 0, ate = 1) =>
  interpolate(t, [t0, t1], [de, ate], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

/** Janela: entra em t0, sai em t1 (0→1→0), com `d` s de transição. */
export const janela = (t: number, t0: number, t1: number, d = 0.35) =>
  Math.min(rampa(t, t0, t0 + d), 1 - rampa(t, t1 - d, t1));
