import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTeamProfiles, type WorldCupSnapshot } from '../src/data/snapshot';
import { SnapshotDataSource, buildHeadToHead } from '../src/data/snapshot-datasource';
import { predictMatch } from '../src/probability/predictor';

// Snapshot real reducido: Grupo E del Mundial 2026 (Flashscore, 14-06-2026).
const SNAP: WorldCupSnapshot = {
  provenance: { source: 'test', retrievedAt: '2026-06-14T00:00:00.000Z' },
  groups: { E: ['ger', 'civ', 'ecu', 'cuw'] },
  teams: [
    { id: 'ger', name: 'Alemania', code: 'GER', confederation: 'UEFA', strengthRating: 85 },
    { id: 'civ', name: 'Costa de Marfil', code: 'CIV', confederation: 'CAF', strengthRating: 73 },
    { id: 'ecu', name: 'Ecuador', code: 'ECU', confederation: 'CONMEBOL', strengthRating: 72 },
    { id: 'cuw', name: 'Curazao', code: 'CUW', confederation: 'CONCACAF', strengthRating: 52 },
  ],
  standings: [
    { teamId: 'ger', played: 1, wins: 1, draws: 0, losses: 0, goalsFor: 7, goalsAgainst: 1 },
    { teamId: 'civ', played: 1, wins: 1, draws: 0, losses: 0, goalsFor: 1, goalsAgainst: 0 },
    { teamId: 'ecu', played: 1, wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 1 },
    { teamId: 'cuw', played: 1, wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 7 },
  ],
  matches: [
    { id: 'm1', homeTeamId: 'ger', awayTeamId: 'cuw', group: 'E', stage: 'GROUP', status: 'FINISHED', homeScore: 7, awayScore: 1 },
    { id: 'm2', homeTeamId: 'civ', awayTeamId: 'ecu', group: 'E', stage: 'GROUP', status: 'FINISHED', homeScore: 1, awayScore: 0 },
    { id: 'm3', homeTeamId: 'ger', awayTeamId: 'civ', group: 'E', stage: 'GROUP', status: 'SCHEDULED' },
  ],
};

test('buildTeamProfiles produce un perfil por equipo del snapshot', () => {
  const profiles = buildTeamProfiles(SNAP);
  assert.equal(profiles.length, 4);
  const ger = profiles.find((p) => p.id === 'ger')!;
  assert.equal(ger.form[5].played, 1);
  assert.equal(ger.form[5].wins, 1);
  assert.deepEqual(ger.form[5].sequence, ['W']);
});

test('la forma real disputada se mezcla con el prior (encogimiento)', () => {
  const ger = buildTeamProfiles(SNAP).find((p) => p.id === 'ger')!;
  // 7 goles reales mezclados con prior (~1.8) => entre ambos, no exactamente 7.
  assert.ok(ger.offensive.avgGoalsScored > 2 && ger.offensive.avgGoalsScored < 7);
  // Curazao recibió 7 => su defensiva es alta (mucho gol en contra).
  const cuw = buildTeamProfiles(SNAP).find((p) => p.id === 'cuw')!;
  assert.ok(cuw.defensive.avgGoalsConceded > ger.defensive.avgGoalsConceded);
});

test('buildHeadToHead refleja los partidos jugados', () => {
  const h2h = buildHeadToHead(SNAP);
  const gerVsCuw = h2h.find((h) => h.teamId === 'ger' && h.opponentId === 'cuw')!;
  assert.equal(gerVsCuw.matches, 1);
  assert.equal(gerVsCuw.wins, 1);
  assert.equal(gerVsCuw.goalsFor, 7);
});

test('SnapshotDataSource cumple el contrato DataSource', async () => {
  const ds = new SnapshotDataSource(SNAP);
  const teams = await ds.listTeams();
  assert.equal(teams.length, 4);
  assert.equal((await ds.getTeam('ger'))?.name, 'Alemania');
  assert.equal(await ds.getTeam('xxx'), null);
});

test('predicción real: Alemania amplio favorito ante Curazao, suma 100', async () => {
  const ds = new SnapshotDataSource(SNAP);
  const ger = (await ds.getTeam('ger'))!;
  const cuw = (await ds.getTeam('cuw'))!;
  const p = predictMatch(ger, cuw, undefined, undefined);
  assert.equal(p.probabilities.homeWin + p.probabilities.draw + p.probabilities.awayWin, 100);
  assert.ok(p.probabilities.homeWin > p.probabilities.awayWin);
});
