import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mapHeadToHead,
  mapTeamProfile,
  serializeSequence,
  type TeamRow,
} from '../src/data/mappers';
import { evaluateTeam } from '../src/model/evaluator';

const baseRow: TeamRow = {
  id: 'arg',
  name: 'Argentina',
  code: 'ARG',
  confederation: 'CONMEBOL',
  historicalRating: 92,
  tacticalRating: 88,
  avgOpponentStrength: 80,
  formRecords: [
    { window: 5, played: 5, wins: 4, draws: 1, losses: 0, goalsFor: 11, goalsAgainst: 3, sequence: 'W,W,D,W,W' },
    { window: 10, played: 10, wins: 7, draws: 2, losses: 1, goalsFor: 20, goalsAgainst: 8, sequence: 'W,W,D,W,W,L,W,D,W,W' },
  ],
  offensive: { avgGoalsScored: 2.1, avgShots: 14, avgShotsOnTarget: 6, conversionRate: 0.35 },
  defensive: { avgGoalsConceded: 0.7, cleanSheets: 6, avgShotsConceded: 7 },
  squad: { totalKeyPlayers: 11, keyPlayersAvailable: 10, injured: 1, suspended: 0 },
};

test('mapTeamProfile mapea relaciones y parsea la secuencia', () => {
  const profile = mapTeamProfile(baseRow);
  assert.equal(profile.id, 'arg');
  assert.equal(profile.form[5].wins, 4);
  assert.deepEqual(profile.form[5].sequence, ['W', 'W', 'D', 'W', 'W']);
  assert.equal(profile.offensive.avgGoalsScored, 2.1);
});

test('mapTeamProfile rellena ventanas faltantes con registro vacío', () => {
  const profile = mapTeamProfile(baseRow); // sin window 15
  assert.equal(profile.form[15].played, 0);
  assert.deepEqual(profile.form[15].sequence, []);
});

test('mapTeamProfile tolera relaciones nulas sin romper la evaluación', () => {
  const row: TeamRow = { ...baseRow, offensive: null, defensive: null, squad: null, formRecords: [] };
  const profile = mapTeamProfile(row);
  const rating = evaluateTeam(profile, undefined);
  assert.ok(rating.composite >= 0 && rating.composite <= 100);
});

test('mapHeadToHead mapea correctamente', () => {
  const h2h = mapHeadToHead({ teamId: 'arg', opponentId: 'bra', matches: 12, wins: 5, draws: 3, losses: 4, goalsFor: 14, goalsAgainst: 13 });
  assert.equal(h2h.matches, 12);
  assert.equal(h2h.wins, 5);
});

test('serializeSequence es inverso de parseSequence', () => {
  const csv = serializeSequence(['W', 'D', 'L', 'W']);
  assert.equal(csv, 'W,D,L,W');
  const round = mapTeamProfile({ ...baseRow, formRecords: [{ window: 5, played: 4, wins: 2, draws: 1, losses: 1, goalsFor: 5, goalsAgainst: 4, sequence: csv }] });
  assert.deepEqual(round.form[5].sequence, ['W', 'D', 'L', 'W']);
});
