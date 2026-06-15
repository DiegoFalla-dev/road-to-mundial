/**
 * Cliente mínimo de API-Football (api-sports.io v3).
 *
 * Solo expone lo necesario para el proyecto: clasificación (standings) y
 * partidos (fixtures) del Mundial 2026 (league=1, season=2026). La API key se
 * lee de la variable de entorno API_FOOTBALL_KEY (nunca se hardcodea).
 */
const BASE = 'https://v3.football.api-sports.io';
export const WORLD_CUP_LEAGUE_ID = 1;

export interface ApiFootballOptions {
  readonly apiKey?: string;
  readonly fetchImpl?: typeof fetch;
}

export class ApiFootballClient {
  private readonly apiKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: ApiFootballOptions = {}) {
    const key = opts.apiKey ?? process.env.API_FOOTBALL_KEY;
    if (!key) {
      throw new Error('Falta API_FOOTBALL_KEY (clave de API-Football). Configúrala en el entorno.');
    }
    this.apiKey = key;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async get<T>(path: string, params: Record<string, string | number>): Promise<T> {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    );
    const res = await this.fetchImpl(`${BASE}${path}?${qs}`, {
      headers: { 'x-apisports-key': this.apiKey },
    });
    if (!res.ok) {
      throw new Error(`API-Football ${path} respondió ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  }

  /** Clasificación por grupos del Mundial. */
  standings(season = 2026): Promise<ApiFootballStandingsResponse> {
    return this.get('/standings', { league: WORLD_CUP_LEAGUE_ID, season });
  }

  /** Todos los partidos del Mundial. */
  fixtures(season = 2026): Promise<ApiFootballFixturesResponse> {
    return this.get('/fixtures', { league: WORLD_CUP_LEAGUE_ID, season });
  }
}

// ===== Formas de respuesta relevantes (parcial) =====

export interface ApiFootballStandingsResponse {
  response: Array<{
    league: {
      standings: Array<
        Array<{
          rank: number;
          team: { id: number; name: string };
          points: number;
          goalsDiff: number;
          group: string; // ej. "Group A"
          all: {
            played: number;
            win: number;
            draw: number;
            lose: number;
            goals: { for: number; against: number };
          };
          form?: string | null; // ej. "WLD"
        }>
      >;
    };
  }>;
}

export interface ApiFootballFixturesResponse {
  response: Array<{
    fixture: { id: number; date: string; venue?: { name?: string | null }; status: { short: string } };
    league: { round: string };
    teams: { home: { id: number; name: string }; away: { id: number; name: string } };
    goals: { home: number | null; away: number | null };
  }>;
}
