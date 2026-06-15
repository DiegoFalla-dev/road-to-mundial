/**
 * Funciones de puntuación por componente.
 *
 * Cada función normaliza una métrica del dominio a una escala 0–100, donde 100
 * representa rendimiento de élite y 0 rendimiento muy pobre. Las constantes de
 * referencia se documentan en cada caso y están calibradas para fútbol de
 * selecciones (~1.3 goles por equipo y partido de media histórica).
 */
import type {
  DefensiveStats,
  FormRecord,
  HeadToHead,
  OffensiveStats,
  SquadStatus,
  TeamProfile,
} from '../types';

/** Acota un valor al rango [min, max]. */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Mapea un valor de [lo, hi] linealmente a [0, 100], acotado. */
export function linearScale(value: number, lo: number, hi: number): number {
  if (hi === lo) return 50;
  return clamp(((value - lo) / (hi - lo)) * 100);
}

/**
 * Forma reciente: puntos por partido ponderados por recencia.
 * Las tres ventanas (5/10/15) se combinan dando más peso a la más reciente.
 * 3 ppp = 100 (todas victorias), 0 ppp = 0.
 */
export function scoreRecentForm(form: Readonly<Record<5 | 10 | 15, FormRecord>>): number {
  const windows: Array<{ w: 5 | 10 | 15; weight: number }> = [
    { w: 5, weight: 0.5 },
    { w: 10, weight: 0.3 },
    { w: 15, weight: 0.2 },
  ];
  let weightedPpg = 0;
  let totalWeight = 0;
  for (const { w, weight } of windows) {
    const rec = form[w];
    if (!rec || rec.played === 0) continue;
    const points = rec.wins * 3 + rec.draws;
    weightedPpg += (points / rec.played) * weight;
    totalWeight += weight;
  }
  if (totalWeight === 0) return 50;
  const ppg = weightedPpg / totalWeight; // 0..3
  return clamp((ppg / 3) * 100);
}

/**
 * Ofensiva: combina goles anotados (60%) y efectividad de disparo (40%).
 * Referencia: 2.5 goles/partido = excelente, 0 = nulo. Conversión 0.5 = élite.
 */
export function scoreOffensive(off: OffensiveStats): number {
  const goalsScore = linearScale(off.avgGoalsScored, 0, 2.5);
  const conversion = clamp(off.conversionRate, 0, 1);
  const conversionScore = linearScale(conversion, 0, 0.5);
  return clamp(goalsScore * 0.6 + conversionScore * 0.4);
}

/**
 * Defensiva: combina goles recibidos invertidos (60%) y tasa de porterías a
 * cero (40%). 0 goles recibidos = 100; 2.5 = 0. Clean sheets sobre ventana 10.
 */
export function scoreDefensive(def: DefensiveStats, sampleMatches = 10): number {
  const concededScore = 100 - linearScale(def.avgGoalsConceded, 0, 2.5);
  const cleanSheetRate = sampleMatches > 0 ? def.cleanSheets / sampleMatches : 0;
  const cleanSheetScore = linearScale(clamp(cleanSheetRate, 0, 1), 0, 0.6);
  return clamp(concededScore * 0.6 + cleanSheetScore * 0.4);
}

/** Calidad de rivales: ya viene en escala 0–100; se acota por seguridad. */
export function scoreOpponentQuality(profile: TeamProfile): number {
  return clamp(profile.avgOpponentStrength);
}

/**
 * Estado de plantilla: disponibilidad de jugadores clave penalizada por
 * sancionados. Sin jugadores clave disponibles = 0; plantel completo = 100.
 */
export function scoreSquad(squad: SquadStatus): number {
  if (squad.totalKeyPlayers <= 0) return 50;
  const availability = squad.keyPlayersAvailable / squad.totalKeyPlayers;
  const suspensionPenalty = Math.min(0.2, squad.suspended * 0.05);
  return clamp((availability - suspensionPenalty) * 100);
}

/** Histórico y táctico: ya en escala 0–100. */
export function scoreHistorical(profile: TeamProfile): number {
  return clamp(profile.historicalRating);
}
export function scoreTactical(profile: TeamProfile): number {
  return clamp(profile.tacticalRating);
}

/**
 * Historial directo: puntos por partido del equipo frente a ESTE rival.
 * Sin enfrentamientos previos devuelve 50 (neutro). 3 ppp = 100.
 */
export function scoreHeadToHead(h2h: HeadToHead | undefined): number {
  if (!h2h || h2h.matches === 0) return 50;
  const points = h2h.wins * 3 + h2h.draws;
  const ppg = points / h2h.matches; // 0..3
  return clamp((ppg / 3) * 100);
}
