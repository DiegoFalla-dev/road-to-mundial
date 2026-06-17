import { SEED_FORMATIONS, computeTrends, evaluateTeam } from '@rtm/core';
import { ds, send } from '../_lib';

/** GET /api/teams/:id — perfil enriquecido: rating, desglose y tendencias. */
export default async function handler(req: any, res: any): Promise<void> {
  const id = String(req.query.id);
  const team = await ds.getTeam(id);
  if (!team) return send(res, { message: `Selección no encontrada: ${id}` }, 404);
  const form10 = team.form[10];
  send(res, {
    ...team,
    formation: SEED_FORMATIONS[id] ?? null,
    goalDifference: form10 ? form10.goalsFor - form10.goalsAgainst : 0,
    rating: evaluateTeam(team, undefined),
    trends: computeTrends(team),
  });
}
