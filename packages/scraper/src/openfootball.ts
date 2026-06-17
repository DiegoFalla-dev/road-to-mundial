/**
 * Proveedor de datos GRATUITO basado en openfootball/worldcup.json (dominio
 * público, sin API key ni límites). Trae el calendario REAL del Mundial 2026
 * (fechas, sedes, grupos, eliminatorias) y los marcadores conforme se publican.
 *
 * - Resuelve los placeholders de repechaje a las selecciones reales del sorteo.
 * - Mientras openfootball no tenga marcadores, superpone los resultados reales
 *   ya conocidos de la jornada 1 (bootstrap). Cuando openfootball publique el
 *   marcador de un partido, ese tiene prioridad.
 */
import type {
  SnapshotMatch,
  SnapshotStanding,
  SnapshotTeam,
  WorldCupSnapshot,
} from '@rtm/core';

const SOURCE_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

// id -> [nombre display (ES), código FIFA, confederación, fuerza provisional]
const META: Record<string, [string, string, string, number]> = {
  mex: ['México', 'MEX', 'CONCACAF', 75], kor: ['Corea del Sur', 'KOR', 'AFC', 74],
  cze: ['República Checa', 'CZE', 'UEFA', 70], rsa: ['Sudáfrica', 'RSA', 'CAF', 66],
  sui: ['Suiza', 'SUI', 'UEFA', 79], can: ['Canadá', 'CAN', 'CONCACAF', 70],
  qat: ['Catar', 'QAT', 'AFC', 66], bih: ['Bosnia-Herzegovina', 'BIH', 'UEFA', 68],
  sco: ['Escocia', 'SCO', 'UEFA', 71], mar: ['Marruecos', 'MAR', 'CAF', 80],
  bra: ['Brasil', 'BRA', 'CONMEBOL', 90], hai: ['Haití', 'HAI', 'CONCACAF', 55],
  usa: ['Estados Unidos', 'USA', 'CONCACAF', 76], aus: ['Australia', 'AUS', 'AFC', 70],
  tur: ['Turquía', 'TUR', 'UEFA', 76], par: ['Paraguay', 'PAR', 'CONMEBOL', 68],
  ger: ['Alemania', 'GER', 'UEFA', 85], civ: ['Costa de Marfil', 'CIV', 'CAF', 73],
  ecu: ['Ecuador', 'ECU', 'CONMEBOL', 72], cuw: ['Curazao', 'CUW', 'CONCACAF', 52],
  swe: ['Suecia', 'SWE', 'UEFA', 74], jpn: ['Japón', 'JPN', 'AFC', 78],
  ned: ['Países Bajos', 'NED', 'UEFA', 86], tun: ['Túnez', 'TUN', 'CAF', 69],
  bel: ['Bélgica', 'BEL', 'UEFA', 84], egy: ['Egipto', 'EGY', 'CAF', 71],
  irn: ['Irán', 'IRN', 'AFC', 73], nzl: ['Nueva Zelanda', 'NZL', 'OFC', 60],
  esp: ['España', 'ESP', 'UEFA', 92], uru: ['Uruguay', 'URU', 'CONMEBOL', 82],
  cpv: ['Cabo Verde', 'CPV', 'CAF', 60], ksa: ['Arabia Saudí', 'KSA', 'AFC', 64],
  fra: ['Francia', 'FRA', 'UEFA', 92], nor: ['Noruega', 'NOR', 'UEFA', 78],
  sen: ['Senegal', 'SEN', 'CAF', 77], irq: ['Irak', 'IRQ', 'AFC', 63],
  aut: ['Austria', 'AUT', 'UEFA', 74], arg: ['Argentina', 'ARG', 'CONMEBOL', 93],
  alg: ['Argelia', 'ALG', 'CAF', 72], jor: ['Jordania', 'JOR', 'AFC', 62],
  por: ['Portugal', 'POR', 'UEFA', 88], col: ['Colombia', 'COL', 'CONMEBOL', 81],
  cod: ['RD Congo', 'COD', 'CAF', 66], uzb: ['Uzbekistán', 'UZB', 'AFC', 64],
  cro: ['Croacia', 'CRO', 'UEFA', 82], eng: ['Inglaterra', 'ENG', 'UEFA', 89],
  gha: ['Ghana', 'GHA', 'CAF', 68], pan: ['Panamá', 'PAN', 'CONCACAF', 64],
};

// Nombres de openfootball (EN) y placeholders de repechaje -> id.
const NAME_TO_ID: Record<string, string> = {
  'mexico': 'mex', 'south korea': 'kor', 'south africa': 'rsa', 'czech republic': 'cze',
  'canada': 'can', 'qatar': 'qat', 'switzerland': 'sui', 'bosnia and herzegovina': 'bih',
  'scotland': 'sco', 'morocco': 'mar', 'brazil': 'bra', 'haiti': 'hai',
  'usa': 'usa', 'united states': 'usa', 'australia': 'aus', 'turkey': 'tur',
  'paraguay': 'par', 'germany': 'ger', 'ivory coast': 'civ', 'ecuador': 'ecu',
  'curacao': 'cuw', 'sweden': 'swe', 'japan': 'jpn', 'netherlands': 'ned',
  'tunisia': 'tun', 'belgium': 'bel', 'egypt': 'egy', 'iran': 'irn',
  'new zealand': 'nzl', 'spain': 'esp', 'cape verde': 'cpv', 'saudi arabia': 'ksa',
  'uruguay': 'uru', 'france': 'fra', 'norway': 'nor', 'senegal': 'sen',
  'iraq': 'irq', 'austria': 'aut', 'argentina': 'arg', 'algeria': 'alg',
  'jordan': 'jor', 'portugal': 'por', 'colombia': 'col', 'dr congo': 'cod',
  'uzbekistan': 'uzb', 'england': 'eng', 'croatia': 'cro', 'ghana': 'gha', 'panama': 'pan',
  // Placeholders de repechaje resueltos según el sorteo real (Flashscore).
  'uefa path a winner': 'bih', 'uefa path b winner': 'swe', 'uefa path c winner': 'tur',
  'uefa path d winner': 'cze', 'ic path 1 winner': 'cod', 'ic path 2 winner': 'irq',
};

// Resultados reales J1 (bootstrap) en orientación local-visitante.
const KNOWN_RESULTS: Array<[string, string, number, number]> = [
  ['mex', 'rsa', 2, 0], ['kor', 'cze', 2, 1], ['sco', 'hai', 1, 0], ['mar', 'bra', 1, 1],
  ['usa', 'par', 4, 1], ['aus', 'tur', 2, 0], ['ger', 'cuw', 7, 1], ['civ', 'ecu', 1, 0],
  ['swe', 'tun', 5, 1], ['ned', 'jpn', 2, 2],
];

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.\s]+/g, ' ').trim();
const idByName = (name: string): string | undefined => NAME_TO_ID[norm(name)];
const groupLetter = (g: string | undefined): string | undefined => {
  const m = (g ?? '').match(/group\s+([a-l])/i);
  return m ? m[1]!.toUpperCase() : undefined;
};

interface OFMatch {
  round?: string; date?: string; time?: string; team1: string; team2: string;
  group?: string; ground?: string; score1?: number; score2?: number;
}
export interface OpenfootballJson { name: string; matches: OFMatch[]; }

/** Busca el resultado conocido para un par (en cualquier orden). */
function knownFor(homeId: string, awayId: string): [number, number] | undefined {
  for (const [a, b, ga, gb] of KNOWN_RESULTS) {
    if (a === homeId && b === awayId) return [ga, gb];
    if (a === awayId && b === homeId) return [gb, ga];
  }
  return undefined;
}

/** Construye un WorldCupSnapshot a partir del JSON de openfootball. */
export function buildSnapshotFromOpenfootball(
  data: OpenfootballJson,
  retrievedAt = new Date().toISOString(),
): WorldCupSnapshot {
  const groups: Record<string, string[]> = {};
  const teamIds = new Set<string>();
  const matches: SnapshotMatch[] = [];
  let n = 0;

  for (const m of data.matches) {
    const g = groupLetter(m.group);
    if (!g) continue; // solo fase de grupos (eliminatorias tienen slots sin resolver)
    const homeId = idByName(m.team1);
    const awayId = idByName(m.team2);
    if (!homeId || !awayId) continue;
    (groups[g] ??= []).push(homeId, awayId);
    teamIds.add(homeId);
    teamIds.add(awayId);

    let homeScore = m.score1;
    let awayScore = m.score2;
    if (homeScore == null || awayScore == null) {
      const known = knownFor(homeId, awayId);
      if (known) [homeScore, awayScore] = known;
    }
    const finished = homeScore != null && awayScore != null;
    n += 1;
    matches.push({
      id: `m${String(n).padStart(2, '0')}`,
      homeTeamId: homeId,
      awayTeamId: awayId,
      group: g,
      stage: 'GROUP',
      status: finished ? 'FINISHED' : 'SCHEDULED',
      kickoff: m.date ?? '',
      venue: m.ground ?? '',
      ...(finished ? { homeScore, awayScore } : {}),
    });
  }

  // Dedup ids por grupo conservando orden.
  for (const g of Object.keys(groups)) groups[g] = [...new Set(groups[g])];

  const teams: SnapshotTeam[] = [...teamIds].map((id) => {
    const meta = META[id] ?? [id, id.toUpperCase(), 'N/A', 60];
    return { id, name: meta[0], code: meta[1], confederation: meta[2], strengthRating: meta[3] };
  });

  // Standings agregados desde los partidos finalizados.
  const acc = new Map<string, SnapshotStanding & { _seq: string[] }>();
  const ensure = (id: string) => {
    let r = acc.get(id);
    if (!r) { r = { teamId: id, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, _seq: [] }; acc.set(id, r); }
    return r;
  };
  for (const id of teamIds) ensure(id);
  for (const mt of matches) {
    if (mt.status !== 'FINISHED' || mt.homeScore == null || mt.awayScore == null) continue;
    const h = ensure(mt.homeTeamId) as any; const a = ensure(mt.awayTeamId) as any;
    h.played++; a.played++; h.goalsFor += mt.homeScore; h.goalsAgainst += mt.awayScore;
    a.goalsFor += mt.awayScore; a.goalsAgainst += mt.homeScore;
    if (mt.homeScore > mt.awayScore) { h.wins++; h._seq.push('W'); a.losses++; a._seq.push('L'); }
    else if (mt.homeScore < mt.awayScore) { a.wins++; a._seq.push('W'); h.losses++; h._seq.push('L'); }
    else { h.draws++; a.draws++; h._seq.push('D'); a._seq.push('D'); }
  }
  const standings: SnapshotStanding[] = [...acc.values()].map((r) => ({
    teamId: r.teamId, played: r.played, wins: r.wins, draws: r.draws, losses: r.losses,
    goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst, sequence: r._seq as any,
  }));

  return {
    provenance: {
      source: 'openfootball/worldcup.json (dominio público) — FIFA World Cup 2026',
      url: SOURCE_URL,
      retrievedAt,
      note: 'Calendario real + marcadores de openfootball (con bootstrap de resultados J1).',
    },
    groups,
    teams,
    standings,
    matches,
  };
}

/** Descarga el JSON de openfootball. */
export async function fetchOpenfootball(url = SOURCE_URL): Promise<OpenfootballJson> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`openfootball respondió ${res.status}`);
  return (await res.json()) as OpenfootballJson;
}
