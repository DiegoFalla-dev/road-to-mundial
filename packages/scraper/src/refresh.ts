/**
 * Job de refresco: descarga openfootball/worldcup.json (gratis, sin API key) y
 * escribe el snapshot que consume la app. Pensado para cron (GitHub Actions).
 * openfootball es dominio público y se actualiza con los marcadores del torneo.
 *
 * Uso:  npx tsx src/refresh.ts [rutaSalida]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSnapshotFromOpenfootball, fetchOpenfootball } from './openfootball';

const DEFAULT_OUT = resolve(__dirname, '../../../apps/api/data/worldcup-2026.snapshot.json');

export async function refresh(outPath: string = DEFAULT_OUT): Promise<void> {
  const data = await fetchOpenfootball();
  const snapshot = buildSnapshotFromOpenfootball(data);
  if (snapshot.teams.length === 0) {
    throw new Error('Snapshot vacío; no se sobrescribe el existente.');
  }
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
