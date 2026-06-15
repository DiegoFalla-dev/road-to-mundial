/**
 * Dataset REAL del Mundial 2026 — obtenido de Flashscore.pe (Clasificación,
 * fase de grupos) el 2026-06-14. Contiene las 48 selecciones en sus 12 grupos
 * oficiales y la forma de la jornada 1 ya disputada (grupos A–F).
 *
 * Campos pendientes del sistema de extracción: tiros, tiros a puerta, historial
 * directo y estadísticas detalladas. 'historicalRating'/'tacticalRating' son
 * provisionales (estimación de fuerza alineada con el ranking FIFA) hasta que la
 * extracción aporte métricas reales. Regenerar con scripts/generate-seed-real.cjs.
 */
import type { TeamProfile, HeadToHead } from '../types';

export const SEED_PROVENANCE = {
  source: 'Flashscore.pe — Campeonato del Mundo 2026 (Clasificación / fase de grupos)',
  url: 'https://www.flashscore.pe/futbol/mundial/campeonato-del-mundo/clasificacion/',
  retrievedAt: '2026-06-14T00:00:00.000Z',
  note: 'Grupos y resultados J1 reales. Métricas detalladas y ratings se completan vía sistema de extracción.',
} as const;

export const SEED_GROUPS: Readonly<Record<string, readonly string[]>> = {
  "A": [
    "mex",
    "kor",
    "cze",
    "rsa"
  ],
  "B": [
    "sui",
    "can",
    "qat",
    "bih"
  ],
  "C": [
    "sco",
    "mar",
    "bra",
    "hai"
  ],
  "D": [
    "usa",
    "aus",
    "tur",
    "par"
  ],
  "E": [
    "ger",
    "civ",
    "ecu",
    "cuw"
  ],
  "F": [
    "swe",
    "jpn",
    "ned",
    "tun"
  ],
  "G": [
    "bel",
    "egy",
    "irn",
    "nzl"
  ],
  "H": [
    "esp",
    "uru",
    "cpv",
    "ksa"
  ],
  "I": [
    "fra",
    "nor",
    "sen",
    "irq"
  ],
  "J": [
    "aut",
    "arg",
    "alg",
    "jor"
  ],
  "K": [
    "por",
    "col",
    "cod",
    "uzb"
  ],
  "L": [
    "cro",
    "eng",
    "gha",
    "pan"
  ]
};

export const SEED_FORMATIONS: Readonly<Record<string, string>> = {};

export const SEED_TEAMS: readonly TeamProfile[] = [
 {
  "id": "mex",
  "name": "México",
  "code": "MEX",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.76,
   "avgShots": 11.91,
   "avgShotsOnTarget": 4.58,
   "conversionRate": 0.38
  },
  "defensive": {
   "avgGoalsConceded": 0.52,
   "cleanSheets": 1,
   "avgShotsConceded": 10.5
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 69,
  "historicalRating": 75,
  "tacticalRating": 72
 },
 {
  "id": "kor",
  "name": "Corea del Sur",
  "code": "KOR",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.74,
   "avgShots": 11.7,
   "avgShotsOnTarget": 4.5,
   "conversionRate": 0.39
  },
  "defensive": {
   "avgGoalsConceded": 1.03,
   "cleanSheets": 0,
   "avgShotsConceded": 10.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 68,
  "historicalRating": 74,
  "tacticalRating": 71
 },
 {
  "id": "cze",
  "name": "República Checa",
  "code": "CZE",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.19,
   "avgShots": 10.84,
   "avgShotsOnTarget": 4.17,
   "conversionRate": 0.29
  },
  "defensive": {
   "avgGoalsConceded": 1.58,
   "cleanSheets": 0,
   "avgShotsConceded": 11
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 64,
  "historicalRating": 70,
  "tacticalRating": 67
 },
 {
  "id": "rsa",
  "name": "Sudáfrica",
  "code": "RSA",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 0.63,
   "avgShots": 9.96,
   "avgShotsOnTarget": 3.83,
   "conversionRate": 0.16
  },
  "defensive": {
   "avgGoalsConceded": 1.62,
   "cleanSheets": 0,
   "avgShotsConceded": 11.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 60,
  "historicalRating": 66,
  "tacticalRating": 63
 },
 {
  "id": "sui",
  "name": "Suiza",
  "code": "SUI",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.31,
   "avgShots": 12.79,
   "avgShotsOnTarget": 4.92,
   "conversionRate": 0.27
  },
  "defensive": {
   "avgGoalsConceded": 0.98,
   "cleanSheets": 0,
   "avgShotsConceded": 10.1
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 73,
  "historicalRating": 79,
  "tacticalRating": 76
 },
 {
  "id": "can",
  "name": "Canadá",
  "code": "CAN",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.19,
   "avgShots": 10.84,
   "avgShotsOnTarget": 4.17,
   "conversionRate": 0.29
  },
  "defensive": {
   "avgGoalsConceded": 1.08,
   "cleanSheets": 0,
   "avgShotsConceded": 11
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 64,
  "historicalRating": 70,
  "tacticalRating": 67
 },
 {
  "id": "qat",
  "name": "Catar",
  "code": "QAT",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.13,
   "avgShots": 9.96,
   "avgShotsOnTarget": 3.83,
   "conversionRate": 0.3
  },
  "defensive": {
   "avgGoalsConceded": 1.12,
   "cleanSheets": 0,
   "avgShotsConceded": 11.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 60,
  "historicalRating": 66,
  "tacticalRating": 63
 },
 {
  "id": "bih",
  "name": "Bosnia-Herzegovina",
  "code": "BIH",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.16,
   "avgShots": 10.4,
   "avgShotsOnTarget": 4,
   "conversionRate": 0.29
  },
  "defensive": {
   "avgGoalsConceded": 1.1,
   "cleanSheets": 0,
   "avgShotsConceded": 11.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 62,
  "historicalRating": 68,
  "tacticalRating": 65
 },
 {
  "id": "sco",
  "name": "Escocia",
  "code": "SCO",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.2,
   "avgShots": 11.05,
   "avgShotsOnTarget": 4.25,
   "conversionRate": 0.28
  },
  "defensive": {
   "avgGoalsConceded": 0.57,
   "cleanSheets": 1,
   "avgShotsConceded": 10.9
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 65,
  "historicalRating": 71,
  "tacticalRating": 68
 },
 {
  "id": "mar",
  "name": "Marruecos",
  "code": "MAR",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.33,
   "avgShots": 13,
   "avgShotsOnTarget": 5,
   "conversionRate": 0.27
  },
  "defensive": {
   "avgGoalsConceded": 0.97,
   "cleanSheets": 0,
   "avgShotsConceded": 10
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 74,
  "historicalRating": 80,
  "tacticalRating": 77
 },
 {
  "id": "bra",
  "name": "Brasil",
  "code": "BRA",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.47,
   "avgShots": 15.16,
   "avgShotsOnTarget": 5.83,
   "conversionRate": 0.25
  },
  "defensive": {
   "avgGoalsConceded": 0.86,
   "cleanSheets": 0,
   "avgShotsConceded": 9
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 84,
  "historicalRating": 90,
  "tacticalRating": 87
 },
 {
  "id": "hai",
  "name": "Haití",
  "code": "HAI",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 0.47,
   "avgShots": 7.59,
   "avgShotsOnTarget": 2.92,
   "conversionRate": 0.16
  },
  "defensive": {
   "avgGoalsConceded": 1.24,
   "cleanSheets": 0,
   "avgShotsConceded": 12.5
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 49,
  "historicalRating": 55,
  "tacticalRating": 52
 },
 {
  "id": "usa",
  "name": "Estados Unidos",
  "code": "USA",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 4,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 4,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 4,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 2.77,
   "avgShots": 12.14,
   "avgShotsOnTarget": 4.67,
   "conversionRate": 0.5
  },
  "defensive": {
   "avgGoalsConceded": 1.01,
   "cleanSheets": 0,
   "avgShotsConceded": 10.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 70,
  "historicalRating": 76,
  "tacticalRating": 73
 },
 {
  "id": "aus",
  "name": "Australia",
  "code": "AUS",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.69,
   "avgShots": 10.84,
   "avgShotsOnTarget": 4.17,
   "conversionRate": 0.41
  },
  "defensive": {
   "avgGoalsConceded": 0.58,
   "cleanSheets": 1,
   "avgShotsConceded": 11
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 64,
  "historicalRating": 70,
  "tacticalRating": 67
 },
 {
  "id": "tur",
  "name": "Turquía",
  "code": "TUR",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 2,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 0.77,
   "avgShots": 12.14,
   "avgShotsOnTarget": 4.67,
   "conversionRate": 0.16
  },
  "defensive": {
   "avgGoalsConceded": 1.51,
   "cleanSheets": 0,
   "avgShotsConceded": 10.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 70,
  "historicalRating": 76,
  "tacticalRating": 73
 },
 {
  "id": "par",
  "name": "Paraguay",
  "code": "PAR",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 4,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 4,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 4,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.16,
   "avgShots": 10.4,
   "avgShotsOnTarget": 4,
   "conversionRate": 0.29
  },
  "defensive": {
   "avgGoalsConceded": 2.6,
   "cleanSheets": 0,
   "avgShotsConceded": 11.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 62,
  "historicalRating": 68,
  "tacticalRating": 65
 },
 {
  "id": "ger",
  "name": "Alemania",
  "code": "GER",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 7,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 7,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 7,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 4.4,
   "avgShots": 14.09,
   "avgShotsOnTarget": 5.42,
   "conversionRate": 0.5
  },
  "defensive": {
   "avgGoalsConceded": 0.91,
   "cleanSheets": 0,
   "avgShotsConceded": 9.5
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 79,
  "historicalRating": 85,
  "tacticalRating": 82
 },
 {
  "id": "civ",
  "name": "Costa de Marfil",
  "code": "CIV",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.23,
   "avgShots": 11.49,
   "avgShotsOnTarget": 4.42,
   "conversionRate": 0.28
  },
  "defensive": {
   "avgGoalsConceded": 0.54,
   "cleanSheets": 1,
   "avgShotsConceded": 10.7
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 67,
  "historicalRating": 73,
  "tacticalRating": 70
 },
 {
  "id": "ecu",
  "name": "Ecuador",
  "code": "ECU",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 0.71,
   "avgShots": 11.26,
   "avgShotsOnTarget": 4.33,
   "conversionRate": 0.16
  },
  "defensive": {
   "avgGoalsConceded": 1.06,
   "cleanSheets": 0,
   "avgShotsConceded": 10.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 66,
  "historicalRating": 72,
  "tacticalRating": 69
 },
 {
  "id": "cuw",
  "name": "Curazao",
  "code": "CUW",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 7,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 7,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 7,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 0.93,
   "avgShots": 6.94,
   "avgShotsOnTarget": 2.67,
   "conversionRate": 0.35
  },
  "defensive": {
   "avgGoalsConceded": 4.28,
   "cleanSheets": 0,
   "avgShotsConceded": 12.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 46,
  "historicalRating": 52,
  "tacticalRating": 49
 },
 {
  "id": "swe",
  "name": "Suecia",
  "code": "SWE",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 5,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 5,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 1,
    "draws": 0,
    "losses": 0,
    "goalsFor": 5,
    "goalsAgainst": 1,
    "sequence": [
     "W"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 3.24,
   "avgShots": 11.7,
   "avgShotsOnTarget": 4.5,
   "conversionRate": 0.5
  },
  "defensive": {
   "avgGoalsConceded": 1.03,
   "cleanSheets": 0,
   "avgShotsConceded": 10.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 68,
  "historicalRating": 74,
  "tacticalRating": 71
 },
 {
  "id": "jpn",
  "name": "Japón",
  "code": "JPN",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.8,
   "avgShots": 12.56,
   "avgShotsOnTarget": 4.83,
   "conversionRate": 0.37
  },
  "defensive": {
   "avgGoalsConceded": 1.49,
   "cleanSheets": 0,
   "avgShotsConceded": 10.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 72,
  "historicalRating": 78,
  "tacticalRating": 75
 },
 {
  "id": "ned",
  "name": "Países Bajos",
  "code": "NED",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 1,
    "losses": 0,
    "goalsFor": 2,
    "goalsAgainst": 2,
    "sequence": [
     "D"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.91,
   "avgShots": 14.3,
   "avgShotsOnTarget": 5.5,
   "conversionRate": 0.35
  },
  "defensive": {
   "avgGoalsConceded": 1.4,
   "cleanSheets": 0,
   "avgShotsConceded": 9.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 80,
  "historicalRating": 86,
  "tacticalRating": 83
 },
 {
  "id": "tun",
  "name": "Túnez",
  "code": "TUN",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 5,
    "sequence": [
     "L"
    ]
   },
   "10": {
    "window": 10,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 5,
    "sequence": [
     "L"
    ]
   },
   "15": {
    "window": 15,
    "played": 1,
    "wins": 0,
    "draws": 0,
    "losses": 1,
    "goalsFor": 1,
    "goalsAgainst": 5,
    "sequence": [
     "L"
    ]
   }
  },
  "offensive": {
   "avgGoalsScored": 1.17,
   "avgShots": 10.61,
   "avgShotsOnTarget": 4.08,
   "conversionRate": 0.29
  },
  "defensive": {
   "avgGoalsConceded": 3.09,
   "cleanSheets": 0,
   "avgShotsConceded": 11.1
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 63,
  "historicalRating": 69,
  "tacticalRating": 66
 },
 {
  "id": "bel",
  "name": "Bélgica",
  "code": "BEL",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.77,
   "avgShots": 13.86,
   "avgShotsOnTarget": 5.33,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.84,
   "cleanSheets": 0,
   "avgShotsConceded": 9.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 78,
  "historicalRating": 84,
  "tacticalRating": 81
 },
 {
  "id": "egy",
  "name": "Egipto",
  "code": "EGY",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.4,
   "avgShots": 11.05,
   "avgShotsOnTarget": 4.25,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.13,
   "cleanSheets": 0,
   "avgShotsConceded": 10.9
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 65,
  "historicalRating": 71,
  "tacticalRating": 68
 },
 {
  "id": "irn",
  "name": "Irán",
  "code": "IRN",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.46,
   "avgShots": 11.49,
   "avgShotsOnTarget": 4.42,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.09,
   "cleanSheets": 0,
   "avgShotsConceded": 10.7
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 67,
  "historicalRating": 73,
  "tacticalRating": 70
 },
 {
  "id": "nzl",
  "name": "Nueva Zelanda",
  "code": "NZL",
  "confederation": "OFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.09,
   "avgShots": 8.66,
   "avgShotsOnTarget": 3.33,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.38,
   "cleanSheets": 0,
   "avgShotsConceded": 12
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 54,
  "historicalRating": 60,
  "tacticalRating": 57
 },
 {
  "id": "esp",
  "name": "España",
  "code": "ESP",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 2,
   "avgShots": 15.6,
   "avgShotsOnTarget": 6,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.67,
   "cleanSheets": 0,
   "avgShotsConceded": 8.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 86,
  "historicalRating": 92,
  "tacticalRating": 89
 },
 {
  "id": "uru",
  "name": "Uruguay",
  "code": "URU",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.71,
   "avgShots": 13.44,
   "avgShotsOnTarget": 5.17,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.89,
   "cleanSheets": 0,
   "avgShotsConceded": 9.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 76,
  "historicalRating": 82,
  "tacticalRating": 79
 },
 {
  "id": "cpv",
  "name": "Cabo Verde",
  "code": "CPV",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.09,
   "avgShots": 8.66,
   "avgShotsOnTarget": 3.33,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.38,
   "cleanSheets": 0,
   "avgShotsConceded": 12
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 54,
  "historicalRating": 60,
  "tacticalRating": 57
 },
 {
  "id": "ksa",
  "name": "Arabia Saudí",
  "code": "KSA",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.2,
   "avgShots": 9.54,
   "avgShotsOnTarget": 3.67,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.29,
   "cleanSheets": 0,
   "avgShotsConceded": 11.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 58,
  "historicalRating": 64,
  "tacticalRating": 61
 },
 {
  "id": "fra",
  "name": "Francia",
  "code": "FRA",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 2,
   "avgShots": 15.6,
   "avgShotsOnTarget": 6,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.67,
   "cleanSheets": 0,
   "avgShotsConceded": 8.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 86,
  "historicalRating": 92,
  "tacticalRating": 89
 },
 {
  "id": "nor",
  "name": "Noruega",
  "code": "NOR",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.6,
   "avgShots": 12.56,
   "avgShotsOnTarget": 4.83,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.98,
   "cleanSheets": 0,
   "avgShotsConceded": 10.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 72,
  "historicalRating": 78,
  "tacticalRating": 75
 },
 {
  "id": "sen",
  "name": "Senegal",
  "code": "SEN",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.57,
   "avgShots": 12.35,
   "avgShotsOnTarget": 4.75,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1,
   "cleanSheets": 0,
   "avgShotsConceded": 10.3
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 71,
  "historicalRating": 77,
  "tacticalRating": 74
 },
 {
  "id": "irq",
  "name": "Irak",
  "code": "IRQ",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.17,
   "avgShots": 9.31,
   "avgShotsOnTarget": 3.58,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.31,
   "cleanSheets": 0,
   "avgShotsConceded": 11.7
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 57,
  "historicalRating": 63,
  "tacticalRating": 60
 },
 {
  "id": "aut",
  "name": "Austria",
  "code": "AUT",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.49,
   "avgShots": 11.7,
   "avgShotsOnTarget": 4.5,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.07,
   "cleanSheets": 0,
   "avgShotsConceded": 10.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 68,
  "historicalRating": 74,
  "tacticalRating": 71
 },
 {
  "id": "arg",
  "name": "Argentina",
  "code": "ARG",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 2.03,
   "avgShots": 15.81,
   "avgShotsOnTarget": 6.08,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.64,
   "cleanSheets": 0,
   "avgShotsConceded": 8.7
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 87,
  "historicalRating": 93,
  "tacticalRating": 90
 },
 {
  "id": "alg",
  "name": "Argelia",
  "code": "ALG",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.43,
   "avgShots": 11.26,
   "avgShotsOnTarget": 4.33,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.11,
   "cleanSheets": 0,
   "avgShotsConceded": 10.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 66,
  "historicalRating": 72,
  "tacticalRating": 69
 },
 {
  "id": "jor",
  "name": "Jordania",
  "code": "JOR",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.14,
   "avgShots": 9.1,
   "avgShotsOnTarget": 3.5,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.33,
   "cleanSheets": 0,
   "avgShotsConceded": 11.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 56,
  "historicalRating": 62,
  "tacticalRating": 59
 },
 {
  "id": "por",
  "name": "Portugal",
  "code": "POR",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.89,
   "avgShots": 14.74,
   "avgShotsOnTarget": 5.67,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.76,
   "cleanSheets": 0,
   "avgShotsConceded": 9.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 82,
  "historicalRating": 88,
  "tacticalRating": 85
 },
 {
  "id": "col",
  "name": "Colombia",
  "code": "COL",
  "confederation": "CONMEBOL",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.69,
   "avgShots": 13.21,
   "avgShotsOnTarget": 5.08,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.91,
   "cleanSheets": 0,
   "avgShotsConceded": 9.9
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 75,
  "historicalRating": 81,
  "tacticalRating": 78
 },
 {
  "id": "cod",
  "name": "RD Congo",
  "code": "COD",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.26,
   "avgShots": 9.96,
   "avgShotsOnTarget": 3.83,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.24,
   "cleanSheets": 0,
   "avgShotsConceded": 11.4
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 60,
  "historicalRating": 66,
  "tacticalRating": 63
 },
 {
  "id": "uzb",
  "name": "Uzbekistán",
  "code": "UZB",
  "confederation": "AFC",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.2,
   "avgShots": 9.54,
   "avgShotsOnTarget": 3.67,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.29,
   "cleanSheets": 0,
   "avgShotsConceded": 11.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 58,
  "historicalRating": 64,
  "tacticalRating": 61
 },
 {
  "id": "cro",
  "name": "Croacia",
  "code": "CRO",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.71,
   "avgShots": 13.44,
   "avgShotsOnTarget": 5.17,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.89,
   "cleanSheets": 0,
   "avgShotsConceded": 9.8
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 76,
  "historicalRating": 82,
  "tacticalRating": 79
 },
 {
  "id": "eng",
  "name": "Inglaterra",
  "code": "ENG",
  "confederation": "UEFA",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.91,
   "avgShots": 14.95,
   "avgShotsOnTarget": 5.75,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 0.73,
   "cleanSheets": 0,
   "avgShotsConceded": 9.1
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 83,
  "historicalRating": 89,
  "tacticalRating": 86
 },
 {
  "id": "gha",
  "name": "Ghana",
  "code": "GHA",
  "confederation": "CAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.31,
   "avgShots": 10.4,
   "avgShotsOnTarget": 4,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.2,
   "cleanSheets": 0,
   "avgShotsConceded": 11.2
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 62,
  "historicalRating": 68,
  "tacticalRating": 65
 },
 {
  "id": "pan",
  "name": "Panamá",
  "code": "PAN",
  "confederation": "CONCACAF",
  "form": {
   "5": {
    "window": 5,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "10": {
    "window": 10,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   },
   "15": {
    "window": 15,
    "played": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "sequence": []
   }
  },
  "offensive": {
   "avgGoalsScored": 1.2,
   "avgShots": 9.54,
   "avgShotsOnTarget": 3.67,
   "conversionRate": 0.33
  },
  "defensive": {
   "avgGoalsConceded": 1.29,
   "cleanSheets": 0,
   "avgShotsConceded": 11.6
  },
  "squad": {
   "totalKeyPlayers": 11,
   "keyPlayersAvailable": 11,
   "injured": 0,
   "suspended": 0
  },
  "avgOpponentStrength": 58,
  "historicalRating": 64,
  "tacticalRating": 61
 }
] as const;

export const SEED_HEAD_TO_HEAD: readonly HeadToHead[] = [] as const;
