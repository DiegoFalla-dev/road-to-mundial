import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_WEIGHTS, assertWeightsValid } from '../src/model/weights';
import { evaluateTeam } from '../src/model/evaluator';
import { clamp, scoreRecentForm } from '../src/model/scoring';
import { makeTeam } from './fixtures';

test('los pesos del modelo suman exactamente 1.0', () => {
  const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.equal(Math.round(sum * 1e6) / 1e6, 1);
  assert.doesNotThrow(() => assertWeightsValid(DEFAULT_WEIGHTS));
});

test('assertWeightsValid lanza si no suman 1', () => {
  assert.throws(() => assertWeightsValid({ ...DEFAULT_WEIGHTS, recentForm: 0.3 }));
});

test('el puntaje compuesto queda en [0,100]', () => {
  const team = makeTeam({ id: 't1', name: 'Alpha' });
  const rating = evaluateTeam(team, undefined);
  assert.ok(rating.composite >= 0 && rating.composite <= 100);
});

test('un equipo con todas victorias supera a uno con todas derrotas', () => {
  const winner = makeTeam({
    id: 'w',
    name: 'Winner',
    form: {
      5: { window: 5, played: 5, wins: 5, draws: 0, losses: 0, goalsFor: 15, goalsAgainst: 2, sequence: [] },
      10: { window: 10, played: 10, wins: 10, draws: 0, losses: 0, goalsFor: 30, goalsAgainst: 4, sequence: [] },
      15: { window: 15, played: 15, wins: 15, draws: 0, losses: 0, goalsFor: 45, goalsAgainst: 6, sequence: [] },
    },
  });
  const loser = makeTeam({
    id: 'l',
    name: 'Loser',
    form: {
      5: { window: 5, played: 5, wins: 0, draws: 0, losses: 5, goalsFor: 1, goalsAgainst: 12, sequence: [] },
      10: { window: 10, played: 10, wins: 0, draws: 0, losses: 10, goalsFor: 3, goalsAgainst: 24, sequence: [] },
      15: { window: 15, played: 15, wins: 0, draws: 0, losses: 15, goalsFor: 5, goalsAgainst: 36, sequence: [] },
    },
    historicalRating: 30,
    tacticalRating: 30,
    avgOpponentStrength: 40,
  });
  assert.ok(evaluateTeam(winner, undefined).composite > evaluateTeam(loser, undefined).composite);
});

test('scoreRecentForm: 3 ppg = 100, 0 ppg = 0', () => {
  const allWin = { window: 5, played: 5, wins: 5, draws: 0, losses: 0, goalsFor: 10, goalsAgainst: 0, sequence: [] } as const;
  const allLoss = { window: 5, played: 5, wins: 0, draws: 0, losses: 5, goalsFor: 0, goalsAgainst: 10, sequence: [] } as const;
  assert.equal(scoreRecentForm({ 5: allWin, 10: allWin, 15: allWin }), 100);
  assert.equal(scoreRecentForm({ 5: allLoss, 10: allLoss, 15: allLoss }), 0);
});

test('clamp acota correctamente', () => {
  assert.equal(clamp(150), 100);
  assert.equal(clamp(-20), 0);
  assert.equal(clamp(55), 55);
});
