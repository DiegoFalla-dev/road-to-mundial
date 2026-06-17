/**
 * Modelos del frontend. Reutiliza los tipos del motor analítico (@rtm/core)
 * como import de solo-tipo (coste cero en runtime) para garantizar contrato
 * tipado de extremo a extremo con el backend.
 */
import type {
  FormTrends,
  GoalMarkets,
  MatchPrediction,
  MatchResult,
  Scoreline,
  ScoreBreakdown,
  TeamProfile,
  TeamRating,
} from '@rtm/core';

export type {
  FormTrends,
  GoalMarkets,
  MatchPrediction,
  MatchResult,
  Scoreline,
  ScoreBreakdown,
  TeamProfile,
  TeamRating,
};

export interface TeamProfileView extends TeamProfile {
  formation: string | null;
  goalDifference: number;
  rating: TeamRating;
  trends: FormTrends;
}

export interface MatchView {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamCode: string;
  awayTeamCode: string;
  groupName: string;
  stage: string;
  status: 'SCHEDULED' | 'FINISHED';
  kickoff: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchDetail {
  match: MatchView;
  prediction: MatchPrediction;
}

export interface ComparisonResult {
  home: TeamProfile;
  away: TeamProfile;
  homeRating: TeamRating;
  awayRating: TeamRating;
  prediction: MatchPrediction;
  modelVersion: string;
}

/** Etiquetas legibles de cada componente del modelo de evaluación. */
export const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  recentForm: 'Forma reciente',
  offensive: 'Ataque',
  defensive: 'Defensa',
  opponentQuality: 'Calidad de rivales',
  squad: 'Plantilla',
  historical: 'Histórico',
  tactical: 'Táctico',
  headToHead: 'Historial directo',
};
