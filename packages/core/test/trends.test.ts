import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTrends } from '../src/model/trends';
import { makeTeam } from './fixtures';

test('racha actual y rachas sin perder/ganar', () => {
  // makeTeam por defecto: form[15].sequence = [] -> usa otra ventana; forzamos.
  const team = makeTeam({
    id: 't',
    name: 'T',
    form: {
      5: { window: 5, played: 5, wins: 3, draws: 1, losses: 1, goalsFor: 8, goalsAgainst: 5, sequence: ['W', 'L', 'D', 'W', 'W'] },
      10: { window: 10, played: 10, wins: 5, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 11, sequence: [] },
      15: { window: 15, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, sequence: [] },
    },
  });
  const t = computeTrends(team);
  assert.deepEqual(t.currentStreak, { type: 'W', count: 2 }); // ...W,W al final
  assert.equal(t.unbeatenRun, 3); // W,W,D sin derrota desde el final hasta la 'L'
  assert.equal(t.winlessRun, 0); // el último es victoria
  assert.equal(t.pointsPerGame, 2); // (3*3+1)/5 = 2
  assert.equal(t.winRate, 60);
});

test('secuencia vacía devuelve racha nula', () => {
  const team = makeTeam({
    id: 'e',
    name: 'E',
    form: {
      5: { window: 5, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, sequence: [] },
      10: { window: 10, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, sequence: [] },
      15: { window: 15, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, sequence: [] },
    },
  });
  const t = computeTrends(team);
  assert.equal(t.currentStreak, null);
  assert.equal(t.pointsPerGame, 0);
});
