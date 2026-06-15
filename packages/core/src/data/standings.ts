/**
 * Cálculo de tablas de clasificación por grupo a partir de los partidos.
 *
 * Función pura y testeable: dado el reparto de grupos y los partidos
 * disputados, calcula PJ/G/E/P, goles a favor/en contra, diferencia y puntos,
 * y ordena cada grupo por los criterios habituales (puntos, diferencia de
 * goles, goles a favor). Sirve tanto para el seed como para datos del snapshot.
 */

/** Forma mínima de partido aceptada (compatible con SeedMatch y SnapshotMatch). */
export interface StandingMatchInput {
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly status: 'SCHEDULED' | 'FINISHED' | string;
  readonly homeScore?: number | null;
  readonly awayScore?: number | null;
  readonly group?: string;
  readonly groupName?: string;
}

export interface StandingRow {
  readonly teamId: string;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDiff: number;
  readonly points: number;
  /** Posición (1-based) tras el ordenamiento. */
  readonly rank: number;
}

type MutableRow = {
  -readonly [K in keyof StandingRow]: StandingRow[K];
};

function emptyRow(teamId: string): MutableRow {
  return {
    teamId,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
    rank: 0,
  };
}

function matchGroup(m: StandingMatchInput): string | undefined {
  return m.group ?? m.groupName;
}

/**
 * Calcula las tablas de todos los grupos.
 * @param groups  Mapa grupo → ids de selección (define la composición y el orden base).
 * @param matches Partidos; solo los FINISHED con marcador cuentan.
 */
export function computeStandings(
  groups: Readonly<Record<string, readonly string[]>>,
  matches: readonly StandingMatchInput[],
): Record<string, StandingRow[]> {
  const tables: Record<string, Map<string, MutableRow>> = {};
  for (const [group, ids] of Object.entries(groups)) {
    tables[group] = new Map(ids.map((id) => [id, emptyRow(id)]));
  }

  for (const m of matches) {
    if (m.status !== 'FINISHED' || m.homeScore == null || m.awayScore == null) continue;
    const group = matchGroup(m);
    if (!group || !tables[group]) continue;
    const home = tables[group]!.get(m.homeTeamId);
    const away = tables[group]!.get(m.awayTeamId);
    if (!home || !away) continue;
    apply(home, m.homeScore, m.awayScore);
    apply(away, m.awayScore, m.homeScore);
  }

  const out: Record<string, StandingRow[]> = {};
  for (const [group, map] of Object.entries(tables)) {
    const rows = [...map.values()].sort(compareRows);
    rows.forEach((r, i) => (r.rank = i + 1));
    out[group] = rows;
  }
  return out;
}

function apply(row: MutableRow, gf: number, ga: number): void {
  row.played += 1;
  row.goalsFor += gf;
  row.goalsAgainst += ga;
  row.goalDiff = row.goalsFor - row.goalsAgainst;
  if (gf > ga) {
    row.wins += 1;
    row.points += 3;
  } else if (gf === ga) {
    row.draws += 1;
    row.points += 1;
  } else {
    row.losses += 1;
  }
}

/** Orden: puntos, diferencia de goles, goles a favor (desc); luego id estable. */
function compareRows(a: MutableRow, b: MutableRow): number {
  return (
    b.points - a.points ||
    b.goalDiff - a.goalDiff ||
    b.goalsFor - a.goalsFor ||
    a.teamId.localeCompare(b.teamId)
  );
}
