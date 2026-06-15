/**
 * Ensambla un WorldCupSnapshot (tipo del dominio @rtm/core) a partir de la
 * clasificación parseada de Flashscore y los metadatos de selecciones.
 *
 * Genera los cruces intragrupo (round-robin). Los resultados ya disputados se
 * marcan FINISHED con su marcador; el resto SCHEDULED. Las estadísticas de tiros
 * por partido se adjuntan si la extracción de la vista de partido las provee.
 */
import type {
  SnapshotMatch,
  SnapshotStanding,
  SnapshotTeam,
  WorldCupSnapshot,
} from '@rtm/core';
import type { ParsedGroup } from './parse-standings';
import { metaByName } from './teams-meta';

/** Resultado de un partido ya disputado (extraído de la vista de resultados). */
export interface KnownResult {
  readonly homeId: string;
  readonly awayId: string;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly homeStats?: { shots?: number; shotsOnTarget?: number; shotsConceded?: number };
  readonly awayStats?: { shots?: number; shotsOnTarget?: number; shotsConceded?: number };
}

export interface BuildOptions {
  readonly retrievedAt?: string;
  readonly results?: readonly KnownResult[];
}

export function buildSnapshot(parsed: ParsedGroup[], opts: BuildOptions = {}): WorldCupSnapshot {
  const groups: Record<string, string[]> = {};
  const teams: SnapshotTeam[] = [];
  const standings: SnapshotStanding[] = [];

  for (const g of parsed) {
    groups[g.group] = [];
    for (const row of g.rows) {
      const meta = metaByName(row.teamName);
      groups[g.group]!.push(meta.id);
      teams.push({
        id: meta.id,
        name: meta.name,
        code: meta.code,
        confederation: meta.confederation,
        strengthRating: meta.strengthRating,
      });
      standings.push({
        teamId: meta.id,
        played: row.played,
        wins: row.wins,
        draws: row.draws,
        losses: row.losses,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
      });
    }
  }

  const resultByPair = new Map<string, KnownResult>();
  for (const r of opts.results ?? []) {
    resultByPair.set(pairKey(r.homeId, r.awayId), r);
  }

  // Cruces round-robin por grupo.
  const matches: SnapshotMatch[] = [];
  let n = 0;
  for (const [group, ids] of Object.entries(groups)) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        n += 1;
        const a = ids[i]!;
        const b = ids[j]!;
        const r = resultByPair.get(pairKey(a, b));
        const id = `m${String(n).padStart(2, '0')}`;
        if (r) {
          matches.push({
            id,
            homeTeamId: r.homeId,
            awayTeamId: r.awayId,
            group,
            stage: 'GROUP',
            status: 'FINISHED',
            homeScore: r.homeScore,
            awayScore: r.awayScore,
            ...(r.homeStats ? { homeStats: r.homeStats } : {}),
            ...(r.awayStats ? { awayStats: r.awayStats } : {}),
          });
        } else {
          matches.push({ id, homeTeamId: a, awayTeamId: b, group, stage: 'GROUP', status: 'SCHEDULED' });
        }
      }
    }
  }

  return {
    provenance: {
      source: 'Flashscore.pe — Campeonato del Mundo 2026 (Clasificación)',
      url: 'https://www.flashscore.pe/futbol/mundial/campeonato-del-mundo/clasificacion/',
      retrievedAt: opts.retrievedAt ?? new Date().toISOString(),
      note: 'Grupos y clasificación reales. Stats de tiros por partido según disponibilidad de la fuente.',
    },
    groups,
    teams,
    standings,
    matches,
  };
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}
