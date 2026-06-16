import { allMatches, decorateMatch, send } from '../_lib';

/** GET /api/matches/finished?limit=10 */
export default async function handler(req: any, res: any): Promise<void> {
  const limit = Number(req.query.limit ?? 10);
  const list = (await allMatches())
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff) || b.id.localeCompare(a.id))
    .slice(0, limit);
  send(res, await Promise.all(list.map(decorateMatch)));
}
