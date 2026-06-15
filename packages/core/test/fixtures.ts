import type { TeamProfile } from '../src/types';

/** Constructor de perfiles de prueba con valores por defecto razonables. */
export function makeTeam(overrides: Partial<TeamProfile> & { id: string; name: string }): TeamProfile {
  return {
    code: overrides.code ?? overrides.id.slice(0, 3).toUpperCase(),
    confederation: 'TEST',
    form: {
      5: { window: 5, played: 5, wins: 3, draws: 1, losses: 1, goalsFor: 9, goalsAgainst: 5, sequence: ['W', 'W', 'D', 'L', 'W'] },
      10: { window: 10, played: 10, wins: 6, draws: 2, losses: 2, goalsFor: 18, goalsAgainst: 10, sequence: ['W', 'W', 'D', 'L', 'W', 'W', 'D', 'L', 'W', 'W'] },
      15: { window: 15, played: 15, wins: 9, draws: 3, losses: 3, goalsFor: 27, goalsAgainst: 15, sequence: [] },
    },
    offensive: { avgGoalsScored: 1.8, avgShots: 14, avgShotsOnTarget: 6, conversionRate: 0.3 },
    defensive: { avgGoalsConceded: 1.0, cleanSheets: 4, avgShotsConceded: 9 },
    squad: { totalKeyPlayers: 11, keyPlayersAvailable: 11, injured: 0, suspended: 0 },
    avgOpponentStrength: 60,
    historicalRating: 70,
    tacticalRating: 70,
    ...overrides,
  };
}
