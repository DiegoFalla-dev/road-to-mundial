import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSnapshotFromOpenfootball, type OpenfootballJson } from '../src/openfootball';
import { buildTeamProfiles, computeStandings } from '@rtm/core';

// Sample real (formato openfootball): incluye placeholder de repechaje y J1.
const SAMPLE: OpenfootballJson = {
  name: 'World Cup 2026',
  matches: [
    { round: 'Matchday 1', date: '2026-06-11', team1: 'Mexico', team2: 'South Africa', group: 'Group A', ground: 'Mexico City' },
    { round: 'Matchday 1', date: '2026-06-11', team1: 'South Korea', team2: 'UEFA Path D winner', group: 'Group A', ground: 'Guadalajara' },
    { round: 'Matchday 8', date: '2026-06-18', team1: 'Mexico', team2: 'South Korea', group: 'Group A', ground: 'Guadalajara' },
    // Eliminatoria con slots sin resolver -> debe ignorarse.
    { round: 'Round of 32', num: 73, date: '2026-06-28', team1: '2A', team2: '2B', ground: 'LA' },
  ],
};

test('resuelve placeholder de repechaje (UEFA Path D winner -> Rep. Checa)', () => {
  const snap = buildSnapshotFromOpenfootball(SAMPLE, '2026-06-15T00:00:00.000Z');
  assert.ok(snap.groups['A']!.includes('cze'));
  assert.ok(snap.teams.some((t) => t.id === 'cze' && t.name === 'República Checa'));
});

test('ignora partidos de eliminatoria con slots sin resolver', () => {
  const snap = buildSnapshotFromOpenfootball(SAMPLE, '2026-06-15T00:00:00.000Z');
  // Solo los 3 de grupo (no el Round of 32).
  assert.equal(snap.matches.length, 3);
  assert.ok(snap.matches.every((m) => m.group === 'A'));
});

test('superpone resultados J1 conocidos y deriva standings', () => {
  const snap = buildSnapshotFromOpenfootball(SAMPLE, '2026-06-15T00:00:00.000Z');
  const mexRsa = snap.matches.find((m) => m.homeTeamId === 'mex' && m.awayTeamId === 'rsa')!;
  assert.equal(mexRsa.status, 'FINISHED');
  assert.equal(mexRsa.homeScore, 2);
  assert.equal(mexRsa.awayScore, 0);
  const korCze = snap.matches.find((m) => m.homeTeamId === 'kor' && m.awayTeamId === 'cze')!;
  assert.equal(korCze.homeScore, 2);
  assert.equal(korCze.awayScore, 1);
  // El México-Corea (MD8) sigue pendiente.
  const mexKor = snap.matches.find((m) => m.homeTeamId === 'mex' && m.awayTeamId === 'kor')!;
  assert.equal(mexKor.status, 'SCHEDULED');
  // Standings: México y Corea con 3 pts.
  const tables = computeStandings(snap.groups, snap.matches as any);
  const a = tables['A']!;
  assert.equal(a[0]!.points, 3);
});

test('el snapshot alimenta el dominio (buildTeamProfiles)', () => {
  const snap = buildSnapshotFromOpenfootball(SAMPLE, '2026-06-15T00:00:00.000Z');
  const profiles = buildTeamProfiles(snap);
  const mex = profiles.find((p) => p.id === 'mex')!;
  assert.equal(mex.form[5].wins, 1);
  assert.equal(mex.name, 'México');
});
