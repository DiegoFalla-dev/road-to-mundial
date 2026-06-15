/**
 * Tipos compartidos del dominio analítico.
 *
 * Estos tipos son la frontera pública del paquete @rtm/core y son consumidos
 * tanto por el backend (NestJS) como por el frontend (Angular) para garantizar
 * un contrato tipado de extremo a extremo (end-to-end type safety).
 */

/** Resultado de un partido desde la perspectiva del equipo analizado. */
export type MatchResult = 'W' | 'D' | 'L';

/** Ventana de análisis de forma reciente. */
export type FormWindow = 5 | 10 | 15;

/**
 * Registro agregado de una ventana de partidos (ej. últimos 5).
 * Todos los campos son contables; los promedios se derivan en el motor.
 */
export interface FormRecord {
  readonly window: FormWindow;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  /** Secuencia cronológica (más reciente al final) para detectar rachas. */
  readonly sequence: readonly MatchResult[];
}

/** Métricas ofensivas promediadas sobre la ventana base de análisis. */
export interface OffensiveStats {
  readonly avgGoalsScored: number;
  readonly avgShots: number;
  readonly avgShotsOnTarget: number;
  /** Goles / tiros a puerta. Acotado por el motor a [0,1]. */
  readonly conversionRate: number;
}

/** Métricas defensivas promediadas sobre la ventana base de análisis. */
export interface DefensiveStats {
  readonly avgGoalsConceded: number;
  readonly cleanSheets: number;
  readonly avgShotsConceded: number;
}

/** Estado de la plantilla en el momento del análisis. */
export interface SquadStatus {
  readonly totalKeyPlayers: number;
  readonly keyPlayersAvailable: number;
  readonly injured: number;
  readonly suspended: number;
}

/**
 * Perfil completo de una selección, intrínseco al equipo (no depende del rival).
 * El componente "historial directo" se calcula aparte por enfrentamiento.
 */
export interface TeamProfile {
  readonly id: string;
  readonly name: string;
  readonly code: string; // ISO-3 (ej. ARG, BRA, FRA)
  readonly confederation: string;
  /** Mapa de ventanas de forma; debe incluir al menos la ventana 5. */
  readonly form: Readonly<Record<FormWindow, FormRecord>>;
  readonly offensive: OffensiveStats;
  readonly defensive: DefensiveStats;
  readonly squad: SquadStatus;
  /** Calidad media de rivales recientes en escala 0–100 (Elo-like normalizado). */
  readonly avgOpponentStrength: number;
  /** Pedigrí / rendimiento histórico en escala 0–100. */
  readonly historicalRating: number;
  /** Valoración táctica cualitativa-cuantificada en escala 0–100. */
  readonly tacticalRating: number;
}

/** Registro de enfrentamientos directos entre dos selecciones. */
export interface HeadToHead {
  readonly teamId: string;
  readonly opponentId: string;
  readonly matches: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
}

/** Desglose del puntaje compuesto (cada componente en escala 0–100). */
export interface ScoreBreakdown {
  readonly recentForm: number;
  readonly offensive: number;
  readonly defensive: number;
  readonly opponentQuality: number;
  readonly squad: number;
  readonly historical: number;
  readonly tactical: number;
  readonly headToHead: number;
}

/** Resultado de la evaluación de un equipo en un enfrentamiento concreto. */
export interface TeamRating {
  readonly teamId: string;
  /** Puntaje compuesto ponderado 0–100. */
  readonly composite: number;
  readonly breakdown: ScoreBreakdown;
}

/** Probabilidades de los tres resultados; suman exactamente 100. */
export interface OutcomeProbabilities {
  readonly homeWin: number;
  readonly draw: number;
  readonly awayWin: number;
}

export type ConfidenceLevel = 'BAJA' | 'MEDIA' | 'ALTA';

/** Predicción completa de un partido. */
export interface MatchPrediction {
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly probabilities: OutcomeProbabilities;
  readonly expectedGoals: { readonly home: number; readonly away: number };
  readonly confidence: ConfidenceLevel;
  readonly homeRating: TeamRating;
  readonly awayRating: TeamRating;
  readonly factorsFor: readonly string[];
  readonly factorsAgainst: readonly string[];
  readonly risks: readonly string[];
  /** Advertencia obligatoria: estimación estadística, no garantía. */
  readonly disclaimer: string;
}
