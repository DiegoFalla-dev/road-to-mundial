import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goalMarketShares } from '../src/probability/poisson';
import { predictMatch } from '../src/probability/predictor';
import { makeTeam } from './fixtures';

test('goalMarketShares: Over/Under monótono y top scorelines ordenados', () => {
  const m = goalMarketShares(1.6, 1.2);
  assert.ok(m.over15 >= m.over25 && m.over25 >= m.over35);
  assert.ok(m.bothTeamsScore > 0 && m.bothTeamsScore < 1);
  assert.equal(m.topScorelines.length, 5);
  for (let i = 1; i < m.topScorelines.length; i++) {
    assert.ok(m.topScorelines[i - 1]!.p >= m.topScorelines[i]!.p);
  }
  assert.deepEqual(m.mostLikely, m.topScorelines[0]);
});

test('predictMatch incluye mercados coherentes en %', () => {
  const home = makeTeam({ id: 'a', name: 'A', historicalRating: 88, tacticalRating: 85 });
  const away = makeTeam({ id: 'b', name: 'B', historicalRating: 60, tacticalRating: 58, avgOpponentStrength: 55 });
  const p = predictMatch(home, away, undefined, undefined);
  const mk = p.markets;
  for (const v of [mk.bothTeamsScore, mk.over15, mk.over25, mk.over35, mk.homeCleanSheet, mk.awayCleanSheet]) {
    assert.ok(v >= 0 && v <= 100);
  }
  assert.equal(mk.topScorelines.length, 5);
  assert.ok(mk.over15 >= mk.over25 && mk.over25 >= mk.over35);
  // El favorito tiene más probabilidad de portería a cero que el débil.
  assert.ok(mk.homeCleanSheet > mk.awayCleanSheet);
});

test('puntos esperados consistentes con las probabilidades', () => {
  const home = makeTeam({ id: 'a', name: 'A' });
  const away = makeTeam({ id: 'b', name: 'B' });
  const p = predictMatch(home, away, undefined, undefined);
  const expHome = (3 * p.probabilities.homeWin + p.probabilities.draw) / 100;
  assert.ok(Math.abs(p.markets.expectedPoints.home - expHome) < 0.011);
  // xPts entre 0 y 3.
  assert.ok(p.markets.expectedPoints.home >= 0 && p.markets.expectedPoints.home <= 3);
});
