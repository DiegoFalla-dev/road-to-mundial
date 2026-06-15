/**
 * Seed de PostgreSQL. Vuelca el dataset de @rtm/core (selecciones, estadísticas,
 * historial directo y partidos) a la base mediante Prisma. Idempotente: usa
 * upsert por clave natural, así que puede ejecutarse varias veces.
 *
 * Ejecutar: npm --workspace @rtm/api run db:seed
 */
import { PrismaClient } from '@prisma/client';
import {
  SEED_FORMATIONS,
  SEED_HEAD_TO_HEAD,
  SEED_MATCHES,
  SEED_TEAMS,
  serializeSequence,
} from '@rtm/core';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log(`Sembrando ${SEED_TEAMS.length} selecciones…`);

  for (const t of SEED_TEAMS) {
    await prisma.team.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        slug: t.id,
        name: t.name,
        code: t.code,
        confederation: t.confederation,
        formation: SEED_FORMATIONS[t.id] ?? null,
        historicalRating: t.historicalRating,
        tacticalRating: t.tacticalRating,
        avgOpponentStrength: t.avgOpponentStrength,
        offensive: { create: { ...t.offensive } },
        defensive: { create: { ...t.defensive } },
        squad: { create: { ...t.squad } },
        formRecords: {
          create: ([5, 10, 15] as const).map((w) => ({
            window: w,
            played: t.form[w].played,
            wins: t.form[w].wins,
            draws: t.form[w].draws,
            losses: t.form[w].losses,
            goalsFor: t.form[w].goalsFor,
            goalsAgainst: t.form[w].goalsAgainst,
            sequence: serializeSequence(t.form[w].sequence),
          })),
        },
      },
    });
  }

  console.log(`Sembrando ${SEED_HEAD_TO_HEAD.length} registros de historial directo…`);
  for (const h of SEED_HEAD_TO_HEAD) {
    await prisma.headToHead.upsert({
      where: { teamId_opponentId: { teamId: h.teamId, opponentId: h.opponentId } },
      update: {},
      create: { ...h },
    });
  }

  console.log(`Sembrando ${SEED_MATCHES.length} partidos…`);
  for (const m of SEED_MATCHES) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
        groupName: m.groupName,
        stage: m.stage,
        status: m.status,
        kickoff: m.kickoff ? new Date(m.kickoff) : null,
        venue: m.venue || null,
        homeScore: m.homeScore ?? null,
        awayScore: m.awayScore ?? null,
      },
    });
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
