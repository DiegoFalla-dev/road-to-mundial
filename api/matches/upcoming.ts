import { SEED_MATCHES } from '@rtm/core';
import { decorateMatch, send } from '../_lib';

/** GET /api/matches/upcoming?limit=10 */
export default async function handler(req: any, res: any): Promise<void> {
  const limit = Number(req.query.limit ?? 10);
  const list = SEED_MATCHES.filter((m) => m.status === 'SCHEDULED')
    .slice()
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .slice(0, limit);
  send(res, await Promise.all(list.map(decorateMatch)));
}
