/**
 * Datos de referencia de las 48 selecciones: id estable, código FIFA,
 * confederación y prior de fuerza (0–100, alineado con ranking FIFA). El scraper
 * obtiene el NOMBRE y las estadísticas de Flashscore/API-Football; estos
 * metadatos se cruzan por nombre para producir el snapshot tipado.
 *
 * `strengthRating` es provisional; se usa como prior hasta acumular partidos.
 */
import { EN_TO_ID } from './aliases-en';

export interface TeamMeta {
  readonly id: string;
  readonly name: string; // nombre canónico (como aparece en Flashscore.pe)
  readonly code: string;
  readonly confederation: string;
  readonly strengthRating: number;
  /** Alias adicionales que puede mostrar la fuente. */
  readonly aliases?: readonly string[];
}

export const TEAMS_META: readonly TeamMeta[] = [
  { id: 'mex', name: 'México', code: 'MEX', confederation: 'CONCACAF', strengthRating: 75 },
  { id: 'kor', name: 'Corea del Sur', code: 'KOR', confederation: 'AFC', strengthRating: 74 },
  { id: 'cze', name: 'República Checa', code: 'CZE', confederation: 'UEFA', strengthRating: 70 },
  { id: 'rsa', name: 'Sudáfrica', code: 'RSA', confederation: 'CAF', strengthRating: 66 },
  { id: 'sui', name: 'Suiza', code: 'SUI', confederation: 'UEFA', strengthRating: 79 },
  { id: 'can', name: 'Canadá', code: 'CAN', confederation: 'CONCACAF', strengthRating: 70 },
  { id: 'qat', name: 'Catar', code: 'QAT', confederation: 'AFC', strengthRating: 66 },
  { id: 'bih', name: 'Bosnia-Herzegovina', code: 'BIH', confederation: 'UEFA', strengthRating: 68 },
  { id: 'sco', name: 'Escocia', code: 'SCO', confederation: 'UEFA', strengthRating: 71 },
  { id: 'mar', name: 'Marruecos', code: 'MAR', confederation: 'CAF', strengthRating: 80 },
  { id: 'bra', name: 'Brasil', code: 'BRA', confederation: 'CONMEBOL', strengthRating: 90 },
  { id: 'hai', name: 'Haití', code: 'HAI', confederation: 'CONCACAF', strengthRating: 55 },
  { id: 'usa', name: 'EE. UU.', code: 'USA', confederation: 'CONCACAF', strengthRating: 76, aliases: ['Estados Unidos', 'EE.UU.', 'USA'] },
  { id: 'aus', name: 'Australia', code: 'AUS', confederation: 'AFC', strengthRating: 70 },
  { id: 'tur', name: 'Turquía', code: 'TUR', confederation: 'UEFA', strengthRating: 76 },
  { id: 'par', name: 'Paraguay', code: 'PAR', confederation: 'CONMEBOL', strengthRating: 68 },
  { id: 'ger', name: 'Alemania', code: 'GER', confederation: 'UEFA', strengthRating: 85 },
  { id: 'civ', name: 'Costa de Marfil', code: 'CIV', confederation: 'CAF', strengthRating: 73 },
  { id: 'ecu', name: 'Ecuador', code: 'ECU', confederation: 'CONMEBOL', strengthRating: 72 },
  { id: 'cuw', name: 'Curazao', code: 'CUW', confederation: 'CONCACAF', strengthRating: 52 },
  { id: 'swe', name: 'Suecia', code: 'SWE', confederation: 'UEFA', strengthRating: 74 },
  { id: 'jpn', name: 'Japón', code: 'JPN', confederation: 'AFC', strengthRating: 78 },
  { id: 'ned', name: 'Países Bajos', code: 'NED', confederation: 'UEFA', strengthRating: 86 },
  { id: 'tun', name: 'Túnez', code: 'TUN', confederation: 'CAF', strengthRating: 69 },
  { id: 'bel', name: 'Bélgica', code: 'BEL', confederation: 'UEFA', strengthRating: 84 },
  { id: 'egy', name: 'Egipto', code: 'EGY', confederation: 'CAF', strengthRating: 71 },
  { id: 'irn', name: 'Irán', code: 'IRN', confederation: 'AFC', strengthRating: 73 },
  { id: 'nzl', name: 'Nueva Zelanda', code: 'NZL', confederation: 'OFC', strengthRating: 60 },
  { id: 'esp', name: 'España', code: 'ESP', confederation: 'UEFA', strengthRating: 92 },
  { id: 'uru', name: 'Uruguay', code: 'URU', confederation: 'CONMEBOL', strengthRating: 82 },
  { id: 'cpv', name: 'Cabo Verde', code: 'CPV', confederation: 'CAF', strengthRating: 60 },
  { id: 'ksa', name: 'Arabia Saudí', code: 'KSA', confederation: 'AFC', strengthRating: 64 },
  { id: 'fra', name: 'Francia', code: 'FRA', confederation: 'UEFA', strengthRating: 92 },
  { id: 'nor', name: 'Noruega', code: 'NOR', confederation: 'UEFA', strengthRating: 78 },
  { id: 'sen', name: 'Senegal', code: 'SEN', confederation: 'CAF', strengthRating: 77 },
  { id: 'irq', name: 'Irak', code: 'IRQ', confederation: 'AFC', strengthRating: 63 },
  { id: 'aut', name: 'Austria', code: 'AUT', confederation: 'UEFA', strengthRating: 74 },
  { id: 'arg', name: 'Argentina', code: 'ARG', confederation: 'CONMEBOL', strengthRating: 93 },
  { id: 'alg', name: 'Argelia', code: 'ALG', confederation: 'CAF', strengthRating: 72 },
  { id: 'jor', name: 'Jordania', code: 'JOR', confederation: 'AFC', strengthRating: 62 },
  { id: 'por', name: 'Portugal', code: 'POR', confederation: 'UEFA', strengthRating: 88 },
  { id: 'col', name: 'Colombia', code: 'COL', confederation: 'CONMEBOL', strengthRating: 81 },
  { id: 'cod', name: 'RD Congo', code: 'COD', confederation: 'CAF', strengthRating: 66 },
  { id: 'uzb', name: 'Uzbekistán', code: 'UZB', confederation: 'AFC', strengthRating: 64 },
  { id: 'cro', name: 'Croacia', code: 'CRO', confederation: 'UEFA', strengthRating: 82 },
  { id: 'eng', name: 'Inglaterra', code: 'ENG', confederation: 'UEFA', strengthRating: 89 },
  { id: 'gha', name: 'Ghana', code: 'GHA', confederation: 'CAF', strengthRating: 68 },
  { id: 'pan', name: 'Panamá', code: 'PAN', confederation: 'CONCACAF', strengthRating: 64 },
];

const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]+/g, ' ')
    .trim();

const BY_ID = new Map<string, TeamMeta>(TEAMS_META.map((t) => [t.id, t]));
const INDEX = new Map<string, TeamMeta>();
for (const t of TEAMS_META) {
  INDEX.set(norm(t.name), t);
  for (const a of t.aliases ?? []) INDEX.set(norm(a), t);
}
for (const [enName, id] of Object.entries(EN_TO_ID)) {
  const meta = BY_ID.get(id);
  if (meta) INDEX.set(norm(enName), meta);
}

/** Metadato por id estable, o undefined. */
export function metaById(id: string): TeamMeta | undefined {
  return BY_ID.get(id);
}

/** Resuelve un nombre (ES o EN) a su metadato, o undefined si no se reconoce. */
export function tryMetaByName(name: string): TeamMeta | undefined {
  return INDEX.get(norm(name));
}

/** Resuelve un nombre a su metadato. Lanza si no se reconoce. */
export function metaByName(name: string): TeamMeta {
  const m = tryMetaByName(name);
  if (!m) throw new Error(`Selección no reconocida en metadatos: "${name}"`);
  return m;
}
