import { ds, send } from '../_lib';

/** GET /api/teams */
export default async function handler(_req: any, res: any): Promise<void> {
  send(res, await ds.listTeams());
}
