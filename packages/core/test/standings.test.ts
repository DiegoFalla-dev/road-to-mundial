import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeStandings } from '../src/data/standings';

const groups = { A: ['mex', 'kor', 'cze', 'rsa'] };

// Resultados reales J1 Grupo A: México 2-0 Sudáfrica, Corea 2-1 Rep. Checa.
const matches = [
  { homeTeamId: 'mex', awayTeamId: 'rsa', status: 'FINISHED', homeScore: 2, awayScore: 0, group: 'A' },
  { homeTeamId: 'kor', awayTeamId: 'cze', status: 'FINISHED', homeScore: 2, awayScore: 1, group: 'A' },
  { homeTeamId: 'mex', awayTeamId: 'kor', status: 'SCHEDULED', group: 'A' },
];

test('computeStandings calcula puntos y diferencia correctamente', () => {
  const t = computeStandings(groups, matches);
  const a = t['A']!;
  assert.equal(a.length, 4);
  const mex = a.find((r) => r.teamId === 'mex')!;
  assert.equal(mex.points, 3);
  assert.equal(mex.goalDiff, 2);
  assert.equal(mex.played, 1);
  const rsa = a.find((r) => r.teamId === 'rsa')!;
  assert.equal(rsa.points, 0);
  assert.equal(rsa.goalDiff, -2);
});

test('ordena por puntos, luego diferencia de goles, luego goles a favor', () => {
  const a = computeStandings(groups, matches)['A']!;
  // México (3pts, +2) y Corea (3pts, +1) arriba; México 1º por mejor DG.
  assert.equal(a[0]!.teamId, 'mex');
  assert.equal(a[1]!.teamId, 'kor');
  assert.equal(a[0]!.rank, 1);
  assert.equal(a[3]!.rank, 4);
});

test('ignora partidos sin disputar y equipos fuera del grupo', () => {
  const t = computeStandings(groups, [
    { homeTeamId: 'mex', awayTeamId: 'xxx', status: 'FINISHED', homeScore: 3, awayScore: 0, group: 'A' },
    { homeTeamId: 'kor', awayTeamId: 'cze', status: 'SCHEDULED', group: 'A' },
  ]);
  // El partido con 'xxx' (fuera del grupo) no debe contar para México.
  assert.equal(t['A']!.find((r) => r.teamId === 'mex')!.played, 0);
});

test('acepta el campo groupName además de group', () => {
  const t = computeStandings(groups, [
    { homeTeamId: 'mex', awayTeamId: 'rsa', status: 'FINISHED', homeScore: 1, awayScore: 0, groupName: 'A' },
  ]);
  assert.equal(t['A']!.find((r) => r.teamId === 'mex')!.points, 3);
});
