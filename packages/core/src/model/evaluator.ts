/**
 * Evaluador compuesto: combina los puntajes por componente con los pesos del
 * modelo para producir el puntaje compuesto (0–100) de un equipo frente a un
 * rival concreto.
 */
import type { HeadToHead, ScoreBreakdown, TeamProfile, TeamRating } from '../types';
import { assertWeightsValid, DEFAULT_WEIGHTS, type ModelWeights } from './weights';
import {
  clamp,
  scoreDefensive,
  scoreHeadToHead,
  scoreHistorical,
  scoreOffensive,
  scoreOpponentQuality,
  scoreRecentForm,
  scoreSquad,
  scoreTactical,
} from './scoring';

/**
 * Evalúa un equipo contra un rival. El historial directo (h2h) es opcional;
 * si no existe, se trata como neutro (50).
 */
export function evaluateTeam(
  team: TeamProfile,
  h2h: HeadToHead | undefined,
  weights: ModelWeights = DEFAULT_WEIGHTS,
): TeamRating {
  assertWeightsValid(weights);

  const breakdown: ScoreBreakdown = {
    recentForm: scoreRecentForm(team.form),
    offensive: scoreOffensive(team.offensive),
    defensive: scoreDefensive(team.defensive),
    opponentQuality: scoreOpponentQuality(team),
    squad: scoreSquad(team.squad),
    historical: scoreHistorical(team),
    tactical: scoreTactical(team),
    headToHead: scoreHeadToHead(h2h),
  };

  const composite =
    breakdown.recentForm * weights.recentForm +
    breakdown.offensive * weights.offensive +
    breakdown.defensive * weights.defensive +
    breakdown.opponentQuality * weights.opponentQuality +
    breakdown.squad * weights.squad +
    breakdown.historical * weights.historical +
    breakdown.tactical * weights.tactical +
    breakdown.headToHead * weights.headToHead;

  return {
    teamId: team.id,
    composite: clamp(composite),
    breakdown,
  };
}
