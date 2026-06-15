import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outcomeShares, poissonPmf } from '../src/probability/poisson';
import { predictMatch, toPercentages } from '../src/probability/predictor';
import { makeTeam } from './fixtures';

test('poissonPmf suma ~1 sobre el soporte', () => {
  let total = 0;
  for (let k = 0; k <= 30; k++) total += poissonPmf(k, 1.4);
  assert.ok(Math.abs(total - 1) < 1e-6);
});

test('outcomeShares suma exactamente 1', () => {
  const s = outcomeShares(1.6, 1.1);
  assert.ok(Math.abs(s.homeWin + s.draw + s.awayWin - 1) < 1e-9);
});

test('toPercentages siempre suma 100 (método de restos mayores)', () => {
  const cases = [
    { homeWin: 0.333, draw: 0.333, awayWin: 0.334 },
    { homeWin: 0.5012, draw: 0.2511, awayWin: 0.2477 },
    { homeWin: 0.0, draw: 0.0, awayWin: 1.0 },
    { homeWin: 0.45, draw: 0.27, awayWin: 0.28 },
  ];
  for (const c of cases) {
    const p = toPercentages(c);
    assert.equal(p.homeWin + p.draw + p.awayWin, 100, JSON.stringify(p));
  }
});

test('predictMatch: las probabilidades suman exactamente 100', () => {
  const home = makeTeam({ id: 'arg', name: 'Argentina', historicalRating: 92, tacticalRating: 88 });
  const away = makeTeam({ id: 'pan', name: 'Panamá', historicalRating: 45, tacticalRating: 50, avgOpponentStrength: 45 });
  const pred = predictMatch(home, away, undefined, undefined);
  const { homeWin, draw, awayWin } = pred.probabilities;
  assert.equal(homeWin + draw + awayWin, 100);
});

test('el favorito tiene mayor probabilidad de victoria', () => {
  const strong = makeTeam({
    id: 's', name: 'Fuerte', historicalRating: 90, tacticalRating: 88,
    offensive: { avgGoalsScored: 2.4, avgShots: 16, avgShotsOnTarget: 8, conversionRate: 0.35 },
    defensive: { avgGoalsConceded: 0.5, cleanSheets: 8, avgShotsConceded: 6 },
  });
  const weak = makeTeam({
    id: 'wk', name: 'Débil', historicalRating: 40, tacticalRating: 45, avgOpponentStrength: 45,
    offensive: { avgGoalsScored: 0.7, avgShots: 8, avgShotsOnTarget: 2, conversionRate: 0.1 },
    defensive: { avgGoalsConceded: 2.1, cleanSheets: 1, avgShotsConceded: 15 },
    form: {
      5: { window: 5, played: 5, wins: 0, draws: 1, losses: 4, goalsFor: 2, goalsAgainst: 11, sequence: [] },
      10: { window: 10, played: 10, wins: 1, draws: 2, losses: 7, goalsFor: 6, goalsAgainst: 22, sequence: [] },
      15: { window: 15, played: 15, wins: 2, draws: 3, losses: 10, goalsFor: 9, goalsAgainst: 33, sequence: [] },
    },
  });
  const pred = predictMatch(strong, weak, undefined, undefined);
  assert.ok(pred.probabilities.homeWin > pred.probabilities.awayWin);
  assert.ok(pred.expectedGoals.home > pred.expectedGoals.away);
});

test('disclaimer obligatorio presente', () => {
  const t = makeTeam({ id: 'a', name: 'A' });
  const pred = predictMatch(t, makeTeam({ id: 'b', name: 'B' }), undefined, undefined);
  assert.ok(pred.disclaimer.toLowerCase().includes('estimaciones'));
});
