/**
 * Utilidades de Poisson para modelar marcadores.
 *
 * El número de goles de un equipo en un partido se modela como una variable
 * de Poisson con media lambda (goles esperados). A partir de las medias de
 * ambos equipos se construye la matriz de probabilidades de cada marcador y se
 * agregan los tres resultados (local / empate / visitante).
 */

/** P(X = k) para X ~ Poisson(lambda). */
export function poissonPmf(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0;
  if (lambda <= 0) return k === 0 ? 1 : 0;
  // exp(k*ln(lambda) - lambda - ln(k!)) evita overflow del factorial.
  return Math.exp(k * Math.log(lambda) - lambda - logFactorial(k));
}

function logFactorial(n: number): number {
  let acc = 0;
  for (let i = 2; i <= n; i++) acc += Math.log(i);
  return acc;
}

export interface OutcomeShares {
  readonly homeWin: number;
  readonly draw: number;
  readonly awayWin: number;
}

/**
 * Calcula las probabilidades de resultado a partir de los goles esperados.
 * Suma la matriz de marcadores hasta `maxGoals` por equipo y normaliza para
 * compensar la cola truncada, garantizando que homeWin+draw+awayWin = 1.
 */
export function outcomeShares(
  lambdaHome: number,
  lambdaAway: number,
  maxGoals = 10,
): OutcomeShares {
  let home = 0;
  let draw = 0;
  let away = 0;
  let total = 0;

  for (let h = 0; h <= maxGoals; h++) {
    const ph = poissonPmf(h, lambdaHome);
    for (let a = 0; a <= maxGoals; a++) {
      const p = ph * poissonPmf(a, lambdaAway);
      total += p;
      if (h > a) home += p;
      else if (h === a) draw += p;
      else away += p;
    }
  }

  // Normalización por la masa truncada (total < 1 por el corte en maxGoals).
  return { homeWin: home / total, draw: draw / total, awayWin: away / total };
}
