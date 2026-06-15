/**
 * Utilidades compartidas para las funciones serverless de Vercel.
 * Archivos con prefijo "_" no se exponen como ruta. Usan @rtm/core directamente
 * (sin NestJS): ligero, sin decoradores ni rxjs, ideal para serverless.
 */
import { SeedDataSource, type SeedMatch } from '@rtm/core';

export const ds = new SeedDataSource();
export const MODEL_VERSION = '1.0.0';

/** Envía JSON con caché de borde corta (la tabla se mueve con el torneo). */
export function send(res: any, data: unknown, status = 200): void {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(status).json(data);
}

/** Enriquece un partido con nombres y códigos de selección para la UI. */
export async function decorateMatch(m: SeedMatch) {
  const [home, away] = await Promise.all([ds.getTeam(m.homeTeamId), ds.getTeam(m.awayTeamId)]);
  return {
    ...m,
    homeTeamName: home?.name ?? m.homeTeamId,
    awayTeamName: away?.name ?? m.awayTeamId,
    homeTeamCode: home?.code ?? m.homeTeamId.toUpperCase(),
    awayTeamCode: away?.code ?? m.awayTeamId.toUpperCase(),
  };
}
