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

export interface ScorelineShare {
  readonly home: number;
  readonly away: number;
  readonly p: number; // fracción [0,1]
}

export interface GoalMarketShares {
  readonly bothTeamsScore: number;
  readonly over15: number;
  readonly over25: number;
  readonly over35: number;
  readonly homeCleanSheet: number;
  readonly awayCleanSheet: number;
  readonly mostLikely: ScorelineShare;
  readonly topScorelines: readonly ScorelineShare[];
}

/**
 * Deriva los mercados de goles de la matriz de marcadores Poisson:
 * ambos anotan, líneas Over/Under, porterías a cero y marcadores más probables.
 * Todas las fracciones se normalizan por la masa truncada.
 */
export function goalMarketShares(
  lambdaHome: number,
  lambdaAway: number,
  maxGoals = 10,
  topN = 5,
): GoalMarketShares {
  let total = 0;
  let btts = 0;
  let over15 = 0;
  let over25 = 0;
  let over35 = 0;
  let homeCS = 0;
  let awayCS = 0;
  const cells: ScorelineShare[] = [];

  for (let h = 0; h <= maxGoals; h++) {
    const ph = poissonPmf(h, lambdaHome);
    for (let a = 0; a <= maxGoals; a++) {
      const p = ph * poissonPmf(a, lambdaAway);
      total += p;
      cells.push({ home: h, away: a, p });
      if (h >= 1 && a >= 1) btts += p;
      const totalGoals = h + a;
      if (totalGoals > 1) over15 += p;
      if (totalGoals > 2) over25 += p;
      if (totalGoals > 3) over35 += p;
      if (a === 0) homeCS += p; // local deja portería a cero
      if (h === 0) awayCS += p; // visitante deja portería a cero
    }
  }

  const norm = (x: number) => x / total;
  const sorted = cells
    .map((c) => ({ home: c.home, away: c.away, p: norm(c.p) }))
    .sort((a, b) => b.p - a.p);

  return {
    bothTeamsScore: norm(btts),
    over15: norm(over15),
    over25: norm(over25),
    over35: norm(over35),
    homeCleanSheet: norm(homeCS),
    awayCleanSheet: norm(awayCS),
    mostLikely: sorted[0]!,
    topScorelines: sorted.slice(0, topN),
  };
}
