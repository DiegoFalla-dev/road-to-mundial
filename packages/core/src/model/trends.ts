/**
 * Tendencias de forma derivadas de la secuencia de resultados.
 * Rachas (actual, sin perder, sin ganar) y métricas agregadas (ppp, % victorias).
 */
import type { FormRecord, FormTrends, MatchResult, TeamProfile } from '../types';

/** Elige la ventana de forma más informativa con secuencia disponible. */
function pickWindow(team: TeamProfile): FormRecord {
  const candidates = [team.form[15], team.form[10], team.form[5]];
  for (const rec of candidates) {
    if (rec && rec.sequence.length > 0) return rec;
  }
  return team.form[10] ?? team.form[5];
}

/** Calcula tendencias a partir del perfil. La secuencia va de antigua a reciente. */
export function computeTrends(team: TeamProfile): FormTrends {
  const rec = pickWindow(team);
  const seq = rec.sequence;
  const played = rec.played;

  const pointsPerGame = played > 0 ? round((rec.wins * 3 + rec.draws) / played, 2) : 0;
  const winRate = played > 0 ? Math.round((rec.wins / played) * 100) : 0;

  if (seq.length === 0) {
    return { currentStreak: null, unbeatenRun: 0, winlessRun: 0, pointsPerGame, winRate };
  }

  const last = seq[seq.length - 1]!;
  let streak = 0;
  for (let i = seq.length - 1; i >= 0 && seq[i] === last; i--) streak += 1;

  const runWhile = (pred: (r: MatchResult) => boolean): number => {
    let n = 0;
    for (let i = seq.length - 1; i >= 0 && pred(seq[i]!); i--) n += 1;
    return n;
  };

  return {
    currentStreak: { type: last, count: streak },
    unbeatenRun: runWhile((r) => r !== 'L'),
    winlessRun: runWhile((r) => r !== 'W'),
    pointsPerGame,
    winRate,
  };
}

function round(value: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}
