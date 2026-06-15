/**
 * Mapeadores puros: respuesta de API-Football → WorldCupSnapshot del dominio.
 * Resuelven los nombres en inglés a nuestros ids vía teams-meta. Son testeables
 * sin red (se les pasa el JSON ya obtenido).
 */
import type {
  MatchResult,
  SnapshotMatch,
  SnapshotStanding,
  SnapshotTeam,
  WorldCupSnapshot,
} from '@rtm/core';
import { metaById, tryMetaByName } from '../teams-meta';
import type {
  ApiFootballFixturesResponse,
  ApiFootballStandingsResponse,
} from './client';

const FINISHED = new Set(['FT', 'AET', 'PEN']);

function groupLetter(raw: string): string {
  const m = raw.match(/group\s+([a-l])/i);
  return m ? m[1]!.toUpperCase() : raw.trim().toUpperCase();
}

function parseForm(form: string | null | undefined): MatchResult[] {
  if (!form) return [];
  return [...form.toUpperCase()].filter((c): c is MatchResult => c === 'W' || c === 'D' || c === 'L');
}

export interface MappedStandings {
  groups: Record<string, string[]>;
  teams: SnapshotTeam[];
  standings: SnapshotStanding[];
  /** Nombres de la fuente que no se pudieron resolver (para diagnóstico). */
  unresolved: string[];
}

/** Convierte la respuesta de standings en grupos + equipos + filas del dominio. */
export function mapStandings(res: ApiFootballStandingsResponse): MappedStandings {
  const groups: Record<string, string[]> = {};
  const teams = new Map<string, SnapshotTeam>();
  const standings: SnapshotStanding[] = [];
  const unresolved: string[] = [];

  const league = res.response[0]?.league;
  for (const groupRows of league?.standings ?? []) {
    for (const row of groupRows) {
      const meta = tryMetaByName(row.team.name);
      if (!meta) {
        unresolved.push(row.team.name);
        continue;
      }
      const g = groupLetter(row.group);
      (groups[g] ??= []).push(meta.id);
      teams.set(meta.id, {
        id: meta.id,
        name: meta.name,
        code: meta.code,
        confederation: meta.confederation,
        strengthRating: meta.strengthRating,
      });
      standings.push({
        teamId: meta.id,
        played: row.all.played,
        wins: row.all.win,
        draws: row.all.draw,
        losses: row.all.lose,
        goalsFor: row.all.goals.for,
        goalsAgainst: row.all.goals.against,
        sequence: parseForm(row.form),
      });
    }
  }
  return { groups, teams: [...teams.values()], standings, unresolved };
}

/** Convierte la respuesta de fixtures en partidos del dominio. */
export function mapFixtures(res: ApiFootballFixturesResponse): SnapshotMatch[] {
  const out: SnapshotMatch[] = [];
  let n = 0;
  for (const f of res.response) {
    const home = tryMetaByName(f.teams.home.name);
    const away = tryMetaByName(f.teams.away.name);
    if (!home || !away) continue;
    n += 1;
    const finished = FINISHED.has(f.fixture.status.short);
    out.push({
      id: `af${f.fixture.id ?? n}`,
      homeTeamId: home.id,
      awayTeamId: away.id,
      group: groupLetter(f.league.round),
      stage: 'GROUP',
      status: finished ? 'FINISHED' : 'SCHEDULED',
      kickoff: f.fixture.date,
      venue: f.fixture.venue?.name ?? '',
      ...(finished && f.goals.home != null && f.goals.away != null
        ? { homeScore: f.goals.home, awayScore: f.goals.away }
        : {}),
    });
  }
  return out;
}

/** Construye un WorldCupSnapshot completo a partir de standings + fixtures. */
export function buildSnapshotFromApiFootball(
  standingsRes: ApiFootballStandingsResponse,
  fixturesRes: ApiFootballFixturesResponse,
  retrievedAt = new Date().toISOString(),
): WorldCupSnapshot {
  const s = mapStandings(standingsRes);
  const matches = mapFixtures(fixturesRes);

  // Asegura que todo equipo con partidos pero sin fila de standings exista.
  const teamIds = new Set(s.teams.map((t) => t.id));
  for (const m of matches) {
    for (const id of [m.homeTeamId, m.awayTeamId]) {
      if (!teamIds.has(id)) {
        const meta = metaById(id);
        if (meta) {
          s.teams.push({
            id: meta.id,
            name: meta.name,
            code: meta.code,
            confederation: meta.confederation,
            strengthRating: meta.strengthRating,
          });
          teamIds.add(id);
        }
      }
    }
  }

  return {
    provenance: {
      source: 'API-Football (api-sports.io) — FIFA World Cup 2026 (league 1)',
      url: 'https://v3.football.api-sports.io',
      retrievedAt,
      note: 'Clasificación y partidos en tiempo (casi) real. Refrescable por job programado.',
    },
    groups: s.groups,
    teams: s.teams,
    standings: s.standings,
    matches,
  };
}
