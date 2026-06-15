import { Injectable } from '@nestjs/common';
import {
  mapHeadToHead,
  mapTeamProfile,
  type DataSource,
  type HeadToHead,
  type TeamProfile,
  type TeamRow,
} from '@rtm/core';
import { PrismaService } from './prisma.service';

/**
 * Implementación de DataSource sobre PostgreSQL (Prisma).
 * Consulta la base e invoca los mappers puros de @rtm/core. Es intercambiable
 * con SeedDataSource sin que el motor ni los servicios cambien.
 */
@Injectable()
export class PrismaDataSource implements DataSource {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    formRecords: true,
    offensive: true,
    defensive: true,
    squad: true,
  } as const;

  async listTeams(): Promise<TeamProfile[]> {
    const rows = await this.prisma.team.findMany({
      include: this.include,
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => mapTeamProfile(r as unknown as TeamRow));
  }

  async getTeam(id: string): Promise<TeamProfile | null> {
    const row = await this.prisma.team.findUnique({
      where: { id },
      include: this.include,
    });
    return row ? mapTeamProfile(row as unknown as TeamRow) : null;
  }

  async getHeadToHead(teamId: string, opponentId: string): Promise<HeadToHead | undefined> {
    const row = await this.prisma.headToHead.findUnique({
      where: { teamId_opponentId: { teamId, opponentId } },
    });
    return row ? mapHeadToHead(row) : undefined;
  }
}
