import { evaluateTeam, predictMatch } from '@rtm/core';
import { ds, send, MODEL_VERSION } from '../_lib';

/** GET /api/analysis/compare?home=arg&away=bra */
export default async function handler(req: any, res: any): Promise<void> {
  const home = String(req.query.home);
  const away = String(req.query.away);
  const [h, a] = await Promise.all([ds.getTeam(home), ds.getTeam(away)]);
  if (!h) return send(res, { message: `Selección no encontrada: ${home}` }, 404);
  if (!a) return send(res, { message: `Selección no encontrada: ${away}` }, 404);
  const [h2hH, h2hA] = await Promise.all([
    ds.getHeadToHead(home, away),
    ds.getHeadToHead(away, home),
  ]);
  send(res, {
    home: h,
    away: a,
    homeRating: evaluateTeam(h, h2hH),
    awayRating: evaluateTeam(a, h2hA),
    prediction: predictMatch(h, a, h2hH, h2hA),
    modelVersion: MODEL_VERSION,
  });
}
