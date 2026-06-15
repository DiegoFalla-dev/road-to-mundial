import { SEED_MATCHES } from '@rtm/core';
import { decorateMatch, send } from '../_lib';

/** GET /api/matches/finished?limit=10 */
export default async function handler(req: any, res: any): Promise<void> {
  const limit = Number(req.query.limit ?? 10);
  const list = SEED_MATCHES.filter((m) => m.status === 'FINISHED')
    .slice()
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
    .slice(0, limit);
  send(res, await Promise.all(list.map(decorateMatch)));
}
