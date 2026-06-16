import { allMatches, decorateMatch, send } from '../_lib';

/** GET /api/matches/upcoming?limit=10 */
export default async function handler(req: any, res: any): Promise<void> {
  const limit = Number(req.query.limit ?? 10);
  const list = (await allMatches())
    .filter((m) => m.status === 'SCHEDULED')
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff) || a.id.localeCompare(b.id))
    .slice(0, limit);
  send(res, await Promise.all(list.map(decorateMatch)));
}
