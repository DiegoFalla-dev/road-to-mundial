/**
 * Predictor de partidos.
 *
 * Convierte los puntajes compuestos de dos equipos en goles esperados,
 * deriva las probabilidades de resultado vía Poisson, calcula el nivel de
 * confianza y redacta factores a favor/en contra y riesgos.
 */
import type {
  ConfidenceLevel,
  HeadToHead,
  MatchPrediction,
  OutcomeProbabilities,
  TeamProfile,
  TeamRating,
} from '../types';
import { evaluateTeam } from '../model/evaluator';
import { DEFAULT_WEIGHTS, type ModelWeights } from '../model/weights';
import { outcomeShares } from './poisson';

export interface PredictorOptions {
  /** Pesos del modelo de evaluación. */
  readonly weights?: ModelWeights;
  /**
   * Ventaja de localía en puntos de rating añadidos al local. En el Mundial las
   * sedes son neutrales salvo el anfitrión, por eso es configurable (default 3).
   */
  readonly homeAdvantage?: number;
  /** Goles esperados base por equipo en un partido equilibrado. */
  readonly baseGoals?: number;
  /** Puntos de rating equivalentes a 1 gol de supremacía. */
  readonly ratingPerGoal?: number;
}

const DISCLAIMER =
  'Estas probabilidades son estimaciones estadísticas basadas en datos recientes ' +
  'y criterios futbolísticos. No constituyen garantías ni predicciones absolutas.';

/**
 * Genera la predicción completa de un partido entre `home` y `away`.
 */
export function predictMatch(
  home: TeamProfile,
  away: TeamProfile,
  h2hHome: HeadToHead | undefined,
  h2hAway: HeadToHead | undefined,
  options: PredictorOptions = {},
): MatchPrediction {
  const weights = options.weights ?? DEFAULT_WEIGHTS;
  const homeAdvantage = options.homeAdvantage ?? 3;
  const baseGoals = options.baseGoals ?? 1.35;
  const ratingPerGoal = options.ratingPerGoal ?? 20;

  const homeRating = evaluateTeam(home, h2hHome, weights);
  const awayRating = evaluateTeam(away, h2hAway, weights);

  // Supremacía en goles a partir de la diferencia de rating (+ localía).
  const diff = homeRating.composite + homeAdvantage - awayRating.composite;
  const supremacy = diff / ratingPerGoal;

  const lambdaHome = Math.max(0.15, baseGoals + supremacy / 2);
  const lambdaAway = Math.max(0.15, baseGoals - supremacy / 2);

  const shares = outcomeShares(lambdaHome, lambdaAway);
  const probabilities = toPercentages(shares);
  const confidence = computeConfidence(probabilities, homeRating, awayRating);

  const { factorsFor, factorsAgainst, risks } = buildNarrative(
    home,
    away,
    homeRating,
    awayRating,
    probabilities,
  );

  return {
    homeTeamId: home.id,
    awayTeamId: away.id,
    probabilities,
    expectedGoals: {
      home: round(lambdaHome, 2),
      away: round(lambdaAway, 2),
    },
    confidence,
    homeRating,
    awayRating,
    factorsFor,
    factorsAgainst,
    risks,
    disclaimer: DISCLAIMER,
  };
}

/**
 * Convierte fracciones [0,1] en porcentajes enteros que suman EXACTAMENTE 100
 * usando el método de los restos mayores (largest remainder).
 */
export function toPercentages(shares: {
  homeWin: number;
  draw: number;
  awayWin: number;
}): OutcomeProbabilities {
  const raw = [
    { key: 'homeWin' as const, value: shares.homeWin * 100 },
    { key: 'draw' as const, value: shares.draw * 100 },
    { key: 'awayWin' as const, value: shares.awayWin * 100 },
  ];
  const floored = raw.map((r) => ({ ...r, floor: Math.floor(r.value), rem: r.value - Math.floor(r.value) }));
  let remainder = 100 - floored.reduce((acc, r) => acc + r.floor, 0);
  // Reparte las unidades restantes a los mayores residuos.
  const order = [...floored].sort((a, b) => b.rem - a.rem);
  const result: Record<string, number> = {};
  for (const r of floored) result[r.key] = r.floor;
  for (let i = 0; i < order.length && remainder > 0; i++) {
    const entry = order[i]!;
    result[entry.key] = (result[entry.key] ?? 0) + 1;
    remainder--;
  }
  return {
    homeWin: result.homeWin!,
    draw: result.draw!,
    awayWin: result.awayWin!,
  };
}

function computeConfidence(
  p: OutcomeProbabilities,
  home: TeamRating,
  away: TeamRating,
): ConfidenceLevel {
  const top = Math.max(p.homeWin, p.draw, p.awayWin);
  const ratingGap = Math.abs(home.composite - away.composite);
  // Confianza alta requiere un favorito claro y diferencia de nivel relevante.
  if (top >= 55 && ratingGap >= 12) return 'ALTA';
  if (top >= 45 || ratingGap >= 8) return 'MEDIA';
  return 'BAJA';
}

function buildNarrative(
  home: TeamProfile,
  away: TeamProfile,
  homeRating: TeamRating,
  awayRating: TeamRating,
  p: OutcomeProbabilities,
): { factorsFor: string[]; factorsAgainst: string[]; risks: string[] } {
  const favorite = homeRating.composite >= awayRating.composite ? home : away;
  const favRating = favorite === home ? homeRating : awayRating;
  const underdog = favorite === home ? away : home;
  const undRating = favorite === home ? awayRating : homeRating;

  const factorsFor: string[] = [];
  const factorsAgainst: string[] = [];
  const risks: string[] = [];

  // Factores a favor del favorito.
  if (favRating.breakdown.recentForm >= 65) {
    factorsFor.push(`${favorite.name} llega en buena forma reciente.`);
  }
  if (favRating.breakdown.offensive >= 65) {
    factorsFor.push(`Ataque productivo de ${favorite.name} (${home === favorite ? home.offensive.avgGoalsScored : away.offensive.avgGoalsScored} goles/partido).`);
  }
  if (favRating.breakdown.defensive >= 65) {
    factorsFor.push(`Solidez defensiva de ${favorite.name}.`);
  }
  if (favRating.breakdown.squad >= 80) {
    factorsFor.push(`${favorite.name} cuenta con su plantilla casi completa.`);
  }

  // Factores en contra / riesgos.
  if (undRating.breakdown.recentForm >= 60) {
    factorsAgainst.push(`${underdog.name} también llega en forma y puede competir.`);
  }
  if (Math.abs(homeRating.composite - awayRating.composite) < 6) {
    risks.push('Diferencia de nivel pequeña: partido muy parejo.');
  }
  if (p.draw >= 28) {
    risks.push('Alta probabilidad de empate: resultado abierto.');
  }
  const undSquad = underdog === home ? home.squad : away.squad;
  if (undSquad.injured + undSquad.suspended >= 3) {
    factorsFor.push(`${underdog.name} tiene bajas sensibles en su plantilla.`);
  }
  if (favRating.breakdown.headToHead < 45) {
    risks.push(`El historial directo no favorece a ${favorite.name}.`);
  }

  if (factorsFor.length === 0) factorsFor.push('Sin factores dominantes; encuentro equilibrado.');
  if (risks.length === 0) risks.push('Variabilidad inherente del fútbol: cualquier resultado es posible.');

  return { factorsFor, factorsAgainst, risks };
}

function round(value: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}
