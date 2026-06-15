/**
 * Calendario del Mundial 2026 — cruces intragrupo reales (round-robin de los 12
 * grupos oficiales). Los partidos verificados de la jornada 1 (Flashscore,
 * 2026-06-14) van como FINISHED con su marcador real; el resto como SCHEDULED.
 * Fechas/sedes exactas y emparejamientos por jornada se completan vía extracción.
 */
export interface SeedMatch {
  readonly id: string;
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly groupName: string;
  readonly stage: 'GROUP' | 'ROUND_32' | 'ROUND_16' | 'QUARTER' | 'SEMI' | 'FINAL';
  readonly status: 'SCHEDULED' | 'FINISHED';
  readonly kickoff: string;
  readonly venue: string;
  readonly homeScore?: number;
  readonly awayScore?: number;
}

export const SEED_MATCHES: readonly SeedMatch[] = [
 {
  "id": "m01",
  "homeTeamId": "mex",
  "awayTeamId": "kor",
  "groupName": "A",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m02",
  "homeTeamId": "mex",
  "awayTeamId": "cze",
  "groupName": "A",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m03",
  "homeTeamId": "mex",
  "awayTeamId": "rsa",
  "groupName": "A",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 2,
  "awayScore": 0
 },
 {
  "id": "m04",
  "homeTeamId": "kor",
  "awayTeamId": "cze",
  "groupName": "A",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 2,
  "awayScore": 1
 },
 {
  "id": "m05",
  "homeTeamId": "kor",
  "awayTeamId": "rsa",
  "groupName": "A",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m06",
  "homeTeamId": "cze",
  "awayTeamId": "rsa",
  "groupName": "A",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m07",
  "homeTeamId": "sui",
  "awayTeamId": "can",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m08",
  "homeTeamId": "sui",
  "awayTeamId": "qat",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m09",
  "homeTeamId": "sui",
  "awayTeamId": "bih",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m10",
  "homeTeamId": "can",
  "awayTeamId": "qat",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m11",
  "homeTeamId": "can",
  "awayTeamId": "bih",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m12",
  "homeTeamId": "qat",
  "awayTeamId": "bih",
  "groupName": "B",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m13",
  "homeTeamId": "sco",
  "awayTeamId": "mar",
  "groupName": "C",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m14",
  "homeTeamId": "sco",
  "awayTeamId": "bra",
  "groupName": "C",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m15",
  "homeTeamId": "sco",
  "awayTeamId": "hai",
  "groupName": "C",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 1,
  "awayScore": 0
 },
 {
  "id": "m16",
  "homeTeamId": "mar",
  "awayTeamId": "bra",
  "groupName": "C",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 1,
  "awayScore": 1
 },
 {
  "id": "m17",
  "homeTeamId": "mar",
  "awayTeamId": "hai",
  "groupName": "C",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m18",
  "homeTeamId": "bra",
  "awayTeamId": "hai",
  "groupName": "C",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m19",
  "homeTeamId": "usa",
  "awayTeamId": "aus",
  "groupName": "D",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m20",
  "homeTeamId": "usa",
  "awayTeamId": "tur",
  "groupName": "D",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m21",
  "homeTeamId": "usa",
  "awayTeamId": "par",
  "groupName": "D",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 4,
  "awayScore": 1
 },
 {
  "id": "m22",
  "homeTeamId": "aus",
  "awayTeamId": "tur",
  "groupName": "D",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 2,
  "awayScore": 0
 },
 {
  "id": "m23",
  "homeTeamId": "aus",
  "awayTeamId": "par",
  "groupName": "D",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m24",
  "homeTeamId": "tur",
  "awayTeamId": "par",
  "groupName": "D",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m25",
  "homeTeamId": "ger",
  "awayTeamId": "civ",
  "groupName": "E",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m26",
  "homeTeamId": "ger",
  "awayTeamId": "ecu",
  "groupName": "E",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m27",
  "homeTeamId": "ger",
  "awayTeamId": "cuw",
  "groupName": "E",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 7,
  "awayScore": 1
 },
 {
  "id": "m28",
  "homeTeamId": "civ",
  "awayTeamId": "ecu",
  "groupName": "E",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 1,
  "awayScore": 0
 },
 {
  "id": "m29",
  "homeTeamId": "civ",
  "awayTeamId": "cuw",
  "groupName": "E",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m30",
  "homeTeamId": "ecu",
  "awayTeamId": "cuw",
  "groupName": "E",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m31",
  "homeTeamId": "swe",
  "awayTeamId": "jpn",
  "groupName": "F",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m32",
  "homeTeamId": "swe",
  "awayTeamId": "ned",
  "groupName": "F",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m33",
  "homeTeamId": "swe",
  "awayTeamId": "tun",
  "groupName": "F",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 5,
  "awayScore": 1
 },
 {
  "id": "m34",
  "homeTeamId": "ned",
  "awayTeamId": "jpn",
  "groupName": "F",
  "stage": "GROUP",
  "status": "FINISHED",
  "kickoff": "",
  "venue": "",
  "homeScore": 2,
  "awayScore": 2
 },
 {
  "id": "m35",
  "homeTeamId": "jpn",
  "awayTeamId": "tun",
  "groupName": "F",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m36",
  "homeTeamId": "ned",
  "awayTeamId": "tun",
  "groupName": "F",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m37",
  "homeTeamId": "bel",
  "awayTeamId": "egy",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m38",
  "homeTeamId": "bel",
  "awayTeamId": "irn",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m39",
  "homeTeamId": "bel",
  "awayTeamId": "nzl",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m40",
  "homeTeamId": "egy",
  "awayTeamId": "irn",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m41",
  "homeTeamId": "egy",
  "awayTeamId": "nzl",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m42",
  "homeTeamId": "irn",
  "awayTeamId": "nzl",
  "groupName": "G",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m43",
  "homeTeamId": "esp",
  "awayTeamId": "uru",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m44",
  "homeTeamId": "esp",
  "awayTeamId": "cpv",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m45",
  "homeTeamId": "esp",
  "awayTeamId": "ksa",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m46",
  "homeTeamId": "uru",
  "awayTeamId": "cpv",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m47",
  "homeTeamId": "uru",
  "awayTeamId": "ksa",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m48",
  "homeTeamId": "cpv",
  "awayTeamId": "ksa",
  "groupName": "H",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m49",
  "homeTeamId": "fra",
  "awayTeamId": "nor",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m50",
  "homeTeamId": "fra",
  "awayTeamId": "sen",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m51",
  "homeTeamId": "fra",
  "awayTeamId": "irq",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m52",
  "homeTeamId": "nor",
  "awayTeamId": "sen",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m53",
  "homeTeamId": "nor",
  "awayTeamId": "irq",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m54",
  "homeTeamId": "sen",
  "awayTeamId": "irq",
  "groupName": "I",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m55",
  "homeTeamId": "aut",
  "awayTeamId": "arg",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m56",
  "homeTeamId": "aut",
  "awayTeamId": "alg",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m57",
  "homeTeamId": "aut",
  "awayTeamId": "jor",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m58",
  "homeTeamId": "arg",
  "awayTeamId": "alg",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m59",
  "homeTeamId": "arg",
  "awayTeamId": "jor",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m60",
  "homeTeamId": "alg",
  "awayTeamId": "jor",
  "groupName": "J",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m61",
  "homeTeamId": "por",
  "awayTeamId": "col",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m62",
  "homeTeamId": "por",
  "awayTeamId": "cod",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m63",
  "homeTeamId": "por",
  "awayTeamId": "uzb",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m64",
  "homeTeamId": "col",
  "awayTeamId": "cod",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m65",
  "homeTeamId": "col",
  "awayTeamId": "uzb",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m66",
  "homeTeamId": "cod",
  "awayTeamId": "uzb",
  "groupName": "K",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m67",
  "homeTeamId": "cro",
  "awayTeamId": "eng",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m68",
  "homeTeamId": "cro",
  "awayTeamId": "gha",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m69",
  "homeTeamId": "cro",
  "awayTeamId": "pan",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m70",
  "homeTeamId": "eng",
  "awayTeamId": "gha",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m71",
  "homeTeamId": "eng",
  "awayTeamId": "pan",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 },
 {
  "id": "m72",
  "homeTeamId": "gha",
  "awayTeamId": "pan",
  "groupName": "L",
  "stage": "GROUP",
  "status": "SCHEDULED",
  "kickoff": "",
  "venue": ""
 }
];
