/**
 * Interfaz abstracta de fuente de datos.
 *
 * Desacopla el motor analítico del origen de los datos. Hoy se implementa con
 * un dataset semilla (SeedDataSource) y con un snapshot real (SnapshotDataSource);
 * mañana puede implementarse con un proveedor externo o PostgreSQL (Prisma) sin
 * tocar el motor ni los consumidores. Principio de inversión de dependencias.
 */
import type { HeadToHead, TeamProfile } from '../types';
import type { StandingMatchInput } from './standings';

export interface DataSource {
  /** Todas las selecciones disponibles. */
  listTeams(): Promise<TeamProfile[]>;
  /** Perfil de una selección por id, o null si no existe. */
  getTeam(id: string): Promise<TeamProfile | null>;
  /** Historial directo de `teamId` frente a `opponentId`, si existe. */
  getHeadToHead(teamId: string, opponentId: string): Promise<HeadToHead | undefined>;

  /** Reparto de grupos (grupo → ids). Opcional según la fuente. */
  listGroups?(): Promise<Record<string, readonly string[]>>;
  /** Partidos para tablas/calendario. Opcional según la fuente. */
  listMatches?(): Promise<StandingMatchInput[]>;
}

/** Metadatos de procedencia para citar el origen de los datos en la UI. */
export interface DataProvenance {
  readonly source: string;
  readonly url?: string;
  readonly retrievedAt: string; // ISO-8601
  readonly note?: string;
}
