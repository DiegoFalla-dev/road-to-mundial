/**
 * Job de refresco: consulta API-Football y escribe el snapshot JSON que consume
 * la aplicación (SnapshotDataSource). Pensado para ejecutarse periódicamente
 * (cron, Vercel Cron, GitHub Actions) durante el torneo para mover la tabla y
 * reflejar el avance del Mundial.
 *
 * Uso:  API_FOOTBALL_KEY=xxx npx tsx src/refresh.ts [rutaSalida]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ApiFootballClient } from './apifootball/client';
import { buildSnapshotFromApiFootball } from './apifootball/map';

const DEFAULT_OUT = resolve(
  __dirname,
  '../../../apps/api/data/worldcup-2026.snapshot.json',
);

export async function refresh(outPath: string = DEFAULT_OUT): Promise<void> {
  const client = new ApiFootballClient();
  const [standings, fixtures] = await Promise.all([client.standings(2026), client.fixtures(2026)]);
  const snapshot = buildSnapshotFromApiFootball(standings, fixtures);
  writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
  const finished = snapshot.matches.filter((m) => m.status === 'FINISHED').length;
  console.log(
    `Snapshot actualizado: ${snapshot.teams.length} selecciones, ` +
      `${Object.keys(snapshot.groups).length} grupos, ${snapshot.matches.length} partidos ` +
      `(${finished} jugados). → ${outPath}`,
  );
}

if (require.main === module) {
  const out = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_OUT;
  refresh(out).catch((err) => {
    console.error('Fallo el refresco:', err.message);
    process.exitCode = 1;
  });
}
