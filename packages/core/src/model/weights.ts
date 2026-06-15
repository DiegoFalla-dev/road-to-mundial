/**
 * Pesos del modelo de evaluación compuesto.
 *
 * Definidos por el dominio del proyecto. Deben sumar exactamente 1.0.
 * Se valida en tiempo de carga (assertWeightsValid) para evitar desviaciones
 * silenciosas al ajustar el modelo.
 */
export interface ModelWeights {
  readonly recentForm: number;
  readonly offensive: number;
  readonly defensive: number;
  readonly opponentQuality: number;
  readonly squad: number;
  readonly historical: number;
  readonly tactical: number;
  readonly headToHead: number;
}

export const DEFAULT_WEIGHTS: ModelWeights = {
  recentForm: 0.25,
  offensive: 0.15,
  defensive: 0.15,
  opponentQuality: 0.1,
  squad: 0.1,
  historical: 0.1,
  tactical: 0.1,
  headToHead: 0.05,
};

const EPSILON = 1e-9;

/** Lanza si los pesos no suman 1.0 (tolerancia EPSILON). */
export function assertWeightsValid(weights: ModelWeights): void {
  const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (Math.abs(sum - 1) > EPSILON) {
    throw new Error(`Los pesos del modelo deben sumar 1.0; suman ${sum.toFixed(6)}`);
  }
  for (const [key, value] of Object.entries(weights)) {
    if (value < 0 || value > 1) {
      throw new Error(`Peso fuera de rango [0,1]: ${key}=${value}`);
    }
  }
}
