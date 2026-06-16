/**
 * Utilidades compartidas para las funciones serverless de Vercel.
 * Archivos con prefijo "_" no se exponen como ruta. Usan @rtm/core directamente.
 * Fuente: si existe un snapshot válido (lo refresca el job de API-Football y se
 * commitea al repo) se usa ese — así la tabla se mueve con el torneo; si no,
 * se usa el dataset semilla real embebido.
 */
import { SeedDataSource, SnapshotDataSource, type DataSource, type WorldCupSnapshot } from '@rtm/core';
// @ts-ignore — JSON resuelto por el bundler (esbuild) en build.
import snapshotJson from '../apps/api/data/worldcup-2026.snapshot.json';

export const MODEL_VERSION = '1.0.0';

function makeDataSource(): DataSource {
  try {
    const snap = snapshotJson as unknown as WorldCupSnapshot;
    if (snap && Array.isArray(snap.teams) && snap.teams.length > 0) {
      return new SnapshotDataSource(snap);
    }
  } catch {
    /* snapshot ausente o inválido */
  }
  return new SeedDataSource();
}

export const ds: DataSource = makeDataSource();

export interface NormalizedMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  groupName: string;
  status: string;
  kickoff: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
}

export async function allMatches(): Promise<NormalizedMatch[]> {
  const raw = ds.listMatches ? await ds.listMatches() : [];
  return (raw as any[]).map((m) => ({
    id: m.id,
    homeTeamId: m.homeTeamId,
    awayTeamId: m.awayTeamId,
    groupName: m.groupName ?? m.group ?? '',
    status: m.status,
    kickoff: m.kickoff ?? '',
    venue: m.venue ?? '',
    homeScore: m.homeScore ?? undefined,
    awayScore: m.awayScore ?? undefined,
  }));
}

export function send(res: any, data: unknown, status = 200): void {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(status).json(data);
}

export async function decorateMatch(m: NormalizedMatch) {
  const [home, away] = await Promise.all([ds.getTeam(m.homeTeamId), ds.getTeam(m.awayTeamId)]);
  return {
    ...m,
    homeTeamName: home?.name ?? m.homeTeamId,
    awayTeamName: away?.name ?? m.awayTeamId,
    homeTeamCode: home?.code ?? m.homeTeamId.toUpperCase(),
    awayTeamCode: away?.code ?? m.awayTeamId.toUpperCase(),
  };
}
