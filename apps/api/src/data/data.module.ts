import { existsSync, readFileSync } from 'node:fs';
import { Global, Logger, Module, type Provider } from '@nestjs/common';
import {
  SeedDataSource,
  SnapshotDataSource,
  type DataSource,
  type WorldCupSnapshot,
} from '@rtm/core';
import { DATA_SOURCE } from '../common/tokens';
import { PrismaDataSource } from './prisma-datasource';
import { PrismaService } from './prisma.service';

/**
 * Módulo de datos. Selecciona la implementación de DataSource según el entorno:
 *   DATA_SOURCE=snapshot → snapshot JSON (producido por @rtm/scraper desde
 *                          API-Football); refrescable por job programado.
 *   DATA_SOURCE=prisma   → PostgreSQL (PrismaDataSource).
 *   por defecto          → dataset semilla real embebido (SeedDataSource).
 *
 * Las tres cumplen el mismo contrato DataSource: cambiar de fuente no toca el
 * motor ni los servicios.
 */
const mode = process.env.DATA_SOURCE ?? 'seed';

const DEFAULT_SNAPSHOT_PATH = process.env.SNAPSHOT_PATH ?? 'data/worldcup-2026.snapshot.json';

/** Carga el snapshot desde disco; si falta, cae al dataset semilla. */
function snapshotFactory(): DataSource {
  if (existsSync(DEFAULT_SNAPSHOT_PATH)) {
    const json = JSON.parse(readFileSync(DEFAULT_SNAPSHOT_PATH, 'utf8')) as WorldCupSnapshot;
    Logger.log(`Snapshot cargado desde ${DEFAULT_SNAPSHOT_PATH}`, 'DataModule');
    return new SnapshotDataSource(json);
  }
  Logger.warn(
    `No se encontró ${DEFAULT_SNAPSHOT_PATH}; usando dataset semilla. ` +
      'Ejecuta el refresco de @rtm/scraper para generarlo.',
    'DataModule',
  );
  return new SeedDataSource();
}

let providers: Provider[];
switch (mode) {
  case 'prisma':
    providers = [
      PrismaService,
      PrismaDataSource,
      { provide: DATA_SOURCE, useExisting: PrismaDataSource },
    ];
    break;
  case 'snapshot':
    providers = [{ provide: DATA_SOURCE, useFactory: snapshotFactory }];
    break;
  default:
    providers = [{ provide: DATA_SOURCE, useFactory: () => new SeedDataSource() }];
}

@Global()
@Module({
  providers,
  exports: [DATA_SOURCE],
})
export class DataModule {}
