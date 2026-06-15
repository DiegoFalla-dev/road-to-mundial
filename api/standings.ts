import { computeStandings } from '@rtm/core';
import { ds, send } from './_lib';

/** GET /api/standings — tablas de los 12 grupos. */
export default async function handler(_req: any, res: any): Promise<void> {
  if (!ds.listGroups || !ds.listMatches) return send(res, []);
  const [groups, matches, teams] = await Promise.all([
    ds.listGroups(),
    ds.listMatches(),
    ds.listTeams(),
  ]);
  const meta = new Map(teams.map((t) => [t.id, t]));
  const tables = computeStandings(groups, matches);
  const out = Object.entries(tables)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, rows]) => ({
      group,
      rows: rows.map((r) => ({
        ...r,
        name: meta.get(r.teamId)?.name ?? r.teamId,
        code: meta.get(r.teamId)?.code ?? r.teamId.toUpperCase(),
      })),
    }));
  send(res, out);
}
