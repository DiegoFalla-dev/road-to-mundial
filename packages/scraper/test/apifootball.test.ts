import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSnapshotFromApiFootball,
  mapFixtures,
  mapStandings,
} from '../src/apifootball/map';
import { buildTeamProfiles } from '@rtm/core';
import type {
  ApiFootballFixturesResponse,
  ApiFootballStandingsResponse,
} from '../src/apifootball/client';

// Respuesta de standings de ejemplo (forma real de API-Football), Grupo E.
const STANDINGS: ApiFootballStandingsResponse = {
  response: [
    {
      league: {
        standings: [
          [
            { rank: 1, team: { id: 25, name: 'Germany' }, points: 3, goalsDiff: 6, group: 'Group E', all: { played: 1, win: 1, draw: 0, lose: 0, goals: { for: 7, against: 1 } }, form: 'W' },
            { rank: 2, team: { id: 1504, name: 'Ivory Coast' }, points: 3, goalsDiff: 1, group: 'Group E', all: { played: 1, win: 1, draw: 0, lose: 0, goals: { for: 1, against: 0 } }, form: 'W' },
            { rank: 3, team: { id: 2382, name: 'Ecuador' }, points: 0, goalsDiff: -1, group: 'Group E', all: { played: 1, win: 0, draw: 0, lose: 1, goals: { for: 0, against: 1 } }, form: 'L' },
            { rank: 4, team: { id: 2384, name: 'Curacao' }, points: 0, goalsDiff: -6, group: 'Group E', all: { played: 1, win: 0, draw: 0, lose: 1, goals: { for: 1, against: 7 } }, form: 'L' },
          ],
        ],
      },
    },
  ],
};

const FIXTURES: ApiFootballFixturesResponse = {
  response: [
    { fixture: { id: 9001, date: '2026-06-13T19:00:00+00:00', venue: { name: 'AT&T Stadium' }, status: { short: 'FT' } }, league: { round: 'Group Stage - 1' }, teams: { home: { id: 25, name: 'Germany' }, away: { id: 2384, name: 'Curacao' } }, goals: { home: 7, away: 1 } },
    { fixture: { id: 9002, date: '2026-06-18T22:00:00+00:00', venue: { name: 'SoFi Stadium' }, status: { short: 'NS' } }, league: { round: 'Group Stage - 2' }, teams: { home: { id: 25, name: 'Germany' }, away: { id: 1504, name: 'Ivory Coast' } }, goals: { home: null, away: null } },
  ],
};

test('mapStandings resuelve nombres en inglés y arma los grupos', () => {
  const m = mapStandings(STANDINGS);
  assert.equal(m.unresolved.length, 0, `no resueltos: ${m.unresolved}`);
  assert.deepEqual(m.groups['E'], ['ger', 'civ', 'ecu', 'cuw']);
  const ger = m.standings.find((s) => s.teamId === 'ger')!;
  assert.equal(ger.goalsFor, 7);
  assert.equal(ger.goalsAgainst, 1);
});

test('mapFixtures marca finalizados y conserva el marcador', () => {
  const matches = mapFixtures(FIXTURES);
  assert.equal(matches.length, 2);
  const fin = matches.find((x) => x.status === 'FINISHED')!;
  assert.equal(fin.homeTeamId, 'ger');
  assert.equal(fin.awayTeamId, 'cuw');
  assert.equal(fin.homeScore, 7);
  const sched = matches.find((x) => x.status === 'SCHEDULED')!;
  assert.equal(sched.homeScore, undefined);
});

test('buildSnapshotFromApiFootball produce un snapshot usable por el dominio', () => {
  const snap = buildSnapshotFromApiFootball(STANDINGS, FIXTURES, '2026-06-14T00:00:00.000Z');
  assert.equal(snap.teams.length, 4);
  const profiles = buildTeamProfiles(snap);
  const ger = profiles.find((p) => p.id === 'ger')!;
  assert.equal(ger.form[5].wins, 1);
  assert.ok(ger.offensive.avgGoalsScored > 2); // 7 reales mezclados con prior
});
