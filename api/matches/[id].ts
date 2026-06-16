import { predictMatch } from '@rtm/core';
import { allMatches, ds, decorateMatch, send } from '../_lib';

/** GET /api/matches/:id — vista de partido con predicción. */
export default async function handler(req: any, res: any): Promise<void> {
  const id = String(req.query.id);
  const m = (await allMatches()).find((x) => x.id === id);
  if (!m) return send(res, { message: `Partido no encontrado: ${id}` }, 404);
  const [home, away] = await Promise.all([ds.getTeam(m.homeTeamId), ds.getTeam(m.awayTeamId)]);
  const [h2hH, h2hA] = await Promise.all([
    ds.getHeadToHead(m.homeTeamId, m.awayTeamId),
    ds.getHeadToHead(m.awayTeamId, m.homeTeamId),
  ]);
  const prediction = predictMatch(home!, away!, h2hH, h2hA);
  send(res, { match: await decorateMatch(m), prediction });
}
