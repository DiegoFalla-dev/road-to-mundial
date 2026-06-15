/**
 * Modelos del frontend. Reutiliza los tipos del motor analítico (@rtm/core)
 * como import de solo-tipo (coste cero en runtime) para garantizar contrato
 * tipado de extremo a extremo con el backend.
 */
import type {
  MatchPrediction,
  MatchResult,
  ScoreBreakdown,
  TeamProfile,
  TeamRating,
} from '@rtm/core';

export type { MatchPrediction, MatchResult, ScoreBreakdown, TeamProfile, TeamRating };

export interface TeamProfileView extends TeamProfile {
  formation: string | null;
  goalDifference: number;
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

export interface StandingRowView {
  teamId: string;
  name: string;
  code: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  rank: number;
}

export interface GroupStandings {
  group: string;
  rows: StandingRowView[];
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
