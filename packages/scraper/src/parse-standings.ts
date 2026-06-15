/**
 * Parser puro de la tabla de Clasificación de Flashscore (Campeonato del Mundo).
 *
 * Convierte el texto plano extraído de la página (vía Playwright `innerText` o
 * el navegador) en filas de clasificación por grupo. Es una función pura y
 * testeable: no depende del navegador, lo que permite verificarla con un
 * volcado real de la página.
 */

export interface ParsedStandingRow {
  readonly rank: number;
  readonly teamName: string;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDiff: number;
  readonly points: number;
}

export interface ParsedGroup {
  readonly group: string; // 'A'..'L'
  readonly rows: ParsedStandingRow[];
}

const INT = /^-?\d+$/;
const GOALS = /^(\d+):(\d+)$/;
const RANK = /^(\d+)\.$/;
const GROUP_HEADER = /^GRUPO\s+([A-L])$/i;
const STOP = /^RANKING DE EQUIPOS/i;

/**
 * Parsea el texto de la pestaña Clasificación en una lista de grupos con sus
 * filas. Tolera grupos sin jugar (todo a cero) y nombres de varias palabras.
 */
export function parseStandings(text: string): ParsedGroup[] {
  const tokens = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const groups: ParsedGroup[] = [];
  let current: { group: string; rows: ParsedStandingRow[] } | null = null;
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i]!;

    if (STOP.test(tok)) break; // empieza el ranking de terceros, fin de grupos

    const gh = tok.match(GROUP_HEADER);
    if (gh) {
      if (current) groups.push(current);
      current = { group: gh[1]!.toUpperCase(), rows: [] };
      i += 1;
      continue;
    }

    const rankMatch = tok.match(RANK);
    if (current && rankMatch) {
      const row = parseRow(Number(rankMatch[1]), tokens, i + 1);
      if (row) {
        current.rows.push(row.row);
        i = row.next;
        continue;
      }
    }
    i += 1;
  }
  if (current) groups.push(current);
  return groups;
}

/** Parsea una fila a partir del índice posterior al rango "N.". */
function parseRow(
  rank: number,
  tokens: string[],
  start: number,
): { row: ParsedStandingRow; next: number } | null {
  // Nombre: tokens hasta el primer entero (PJ).
  let j = start;
  const nameParts: string[] = [];
  while (j < tokens.length && !INT.test(tokens[j]!)) {
    nameParts.push(tokens[j]!);
    j += 1;
  }
  if (nameParts.length === 0 || j + 6 >= tokens.length) return null;

  const played = Number(tokens[j]!);
  const wins = Number(tokens[j + 1]!);
  const draws = Number(tokens[j + 2]!);
  const losses = Number(tokens[j + 3]!);
  const goalsTok = tokens[j + 4]!;
  const dg = tokens[j + 5]!;
  const pts = tokens[j + 6]!;

  const gm = goalsTok.match(GOALS);
  if (!gm || !INT.test(dg) || !INT.test(pts)) return null;

  return {
    row: {
      rank,
      teamName: nameParts.join(' ').replace(/\s+/g, ' ').trim(),
      played,
      wins,
      draws,
      losses,
      goalsFor: Number(gm[1]),
      goalsAgainst: Number(gm[2]),
      goalDiff: Number(dg),
      points: Number(pts),
    },
    next: j + 7, // los tokens de FORMA ("?", letras) se ignoran y se reescanea
  };
}
