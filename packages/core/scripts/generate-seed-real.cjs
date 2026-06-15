const fs=require('fs');
// === DATOS REALES (Flashscore, Clasificación Mundial 2026, 14-06-2026) ===
// grupo -> [ids en orden de clasificación actual]
// meta: id -> [nombre, código FIFA, confederación, rating provisional 0-100]
// md1: id -> [PJ,G,E,P,GF,GA]  (fila real de la tabla)
const T = {
 mex:['México','MEX','CONCACAF',75], kor:['Corea del Sur','KOR','AFC',74], cze:['República Checa','CZE','UEFA',70], rsa:['Sudáfrica','RSA','CAF',66],
 sui:['Suiza','SUI','UEFA',79], can:['Canadá','CAN','CONCACAF',70], qat:['Catar','QAT','AFC',66], bih:['Bosnia-Herzegovina','BIH','UEFA',68],
 sco:['Escocia','SCO','UEFA',71], mar:['Marruecos','MAR','CAF',80], bra:['Brasil','BRA','CONMEBOL',90], hai:['Haití','HAI','CONCACAF',55],
 usa:['Estados Unidos','USA','CONCACAF',76], aus:['Australia','AUS','AFC',70], tur:['Turquía','TUR','UEFA',76], par:['Paraguay','PAR','CONMEBOL',68],
 ger:['Alemania','GER','UEFA',85], civ:['Costa de Marfil','CIV','CAF',73], ecu:['Ecuador','ECU','CONMEBOL',72], cuw:['Curazao','CUW','CONCACAF',52],
 swe:['Suecia','SWE','UEFA',74], jpn:['Japón','JPN','AFC',78], ned:['Países Bajos','NED','UEFA',86], tun:['Túnez','TUN','CAF',69],
 bel:['Bélgica','BEL','UEFA',84], egy:['Egipto','EGY','CAF',71], irn:['Irán','IRN','AFC',73], nzl:['Nueva Zelanda','NZL','OFC',60],
 esp:['España','ESP','UEFA',92], uru:['Uruguay','URU','CONMEBOL',82], cpv:['Cabo Verde','CPV','CAF',60], ksa:['Arabia Saudí','KSA','AFC',64],
 fra:['Francia','FRA','UEFA',92], nor:['Noruega','NOR','UEFA',78], sen:['Senegal','SEN','CAF',77], irq:['Irak','IRQ','AFC',63],
 aut:['Austria','AUT','UEFA',74], arg:['Argentina','ARG','CONMEBOL',93], alg:['Argelia','ALG','CAF',72], jor:['Jordania','JOR','AFC',62],
 por:['Portugal','POR','UEFA',88], col:['Colombia','COL','CONMEBOL',81], cod:['RD Congo','COD','CAF',66], uzb:['Uzbekistán','UZB','AFC',64],
 cro:['Croacia','CRO','UEFA',82], eng:['Inglaterra','ENG','UEFA',89], gha:['Ghana','GHA','CAF',68], pan:['Panamá','PAN','CONCACAF',64],
};
const GROUPS={
 A:['mex','kor','cze','rsa'], B:['sui','can','qat','bih'], C:['sco','mar','bra','hai'],
 D:['usa','aus','tur','par'], E:['ger','civ','ecu','cuw'], F:['swe','jpn','ned','tun'],
 G:['bel','egy','irn','nzl'], H:['esp','uru','cpv','ksa'], I:['fra','nor','sen','irq'],
 J:['aut','arg','alg','jor'], K:['por','col','cod','uzb'], L:['cro','eng','gha','pan'],
};
// md1 real: [PJ,G,E,P,GF,GA]
const MD1={
 mex:[1,1,0,0,2,0], kor:[1,1,0,0,2,1], cze:[1,0,0,1,1,2], rsa:[1,0,0,1,0,2],
 sui:[1,0,1,0,1,1], can:[1,0,1,0,1,1], qat:[1,0,1,0,1,1], bih:[1,0,1,0,1,1],
 sco:[1,1,0,0,1,0], mar:[1,0,1,0,1,1], bra:[1,0,1,0,1,1], hai:[1,0,0,1,0,1],
 usa:[1,1,0,0,4,1], aus:[1,1,0,0,2,0], tur:[1,0,0,1,0,2], par:[1,0,0,1,1,4],
 ger:[1,1,0,0,7,1], civ:[1,1,0,0,1,0], ecu:[1,0,0,1,0,1], cuw:[1,0,0,1,1,7],
 swe:[1,1,0,0,5,1], jpn:[1,0,1,0,2,2], ned:[1,0,1,0,2,2], tun:[1,0,0,1,1,5],
 // G-L aún no juegan
};
// Resultados verificados (pairings inequívocos) -> FINISHED
const PLAYED=[
 ['mex','rsa',2,0],['kor','cze',2,1],
 ['sco','hai',1,0],['mar','bra',1,1],
 ['usa','par',4,1],['aus','tur',2,0],
 ['ger','cuw',7,1],['civ','ecu',1,0],
 ['swe','tun',5,1],['ned','jpn',2,2],
];
const r2=x=>Math.round(x*100)/100;
function seqFromMd1(m){if(!m)return [];return [m[1]?'W':m[2]?'D':'L'];}
function emptyForm(w){return {window:w,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,sequence:[]};}
function formFromMd1(w,m){if(!m||m[0]===0)return emptyForm(w);return {window:w,played:m[0],wins:m[1],draws:m[2],losses:m[3],goalsFor:m[4],goalsAgainst:m[5],sequence:seqFromMd1(m)};}

const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const teams=Object.keys(T).map(id=>{
 const [name,code,conf,rating]=T[id]; const m=MD1[id];
 const pj=m?m[0]:0, gf=m?m[4]:0, ga=m?m[5]:0;
 const priorAtk=clamp(0.8+(rating-50)/35,0.4,2.6);
 const priorDef=clamp(1.6-(rating-50)/45,0.4,2.4);
 const avgGoalsScored = pj? r2((gf/pj + priorAtk)/2) : r2(priorAtk);
 const avgGoalsConceded = pj? r2((ga/pj + priorDef)/2) : r2(priorDef);
 const avgShotsOnTarget = r2(clamp(2.5+(rating-50)/12,1.5,7));
 const avgShots = r2(avgShotsOnTarget*2.6);
 const conversionRate = r2(clamp(avgGoalsScored/Math.max(0.1,avgShotsOnTarget),0.05,0.5));
 return {
  id,name,code,confederation:conf,
  form:{5:formFromMd1(5,m),10:formFromMd1(10,m),15:formFromMd1(15,m)},
  offensive:{avgGoalsScored, avgShots, avgShotsOnTarget, conversionRate},
  defensive:{avgGoalsConceded, cleanSheets:(pj&&ga===0)?1:0, avgShotsConceded:r2(clamp(13-(rating-50)/10,6,16))},
  squad:{totalKeyPlayers:11,keyPlayersAvailable:11,injured:0,suspended:0},
  avgOpponentStrength:Math.max(40,rating-6),
  historicalRating:rating, tacticalRating:Math.max(40,rating-3),
 };
});

// Fixtures: todos los cruces intragrupo (round-robin). Verificados -> FINISHED.
const playedKey=new Set(PLAYED.map(p=>[p[0],p[1]].sort().join('-')));
const scoreMap={}; PLAYED.forEach(p=>scoreMap[[p[0],p[1]].sort().join('-')]=p);
const matches=[]; let n=0;
for(const [g,ids] of Object.entries(GROUPS)){
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=ids[i],b=ids[j]; const key=[a,b].sort().join('-'); n++;
  const pr=scoreMap[key];
  if(pr){
   matches.push({id:'m'+String(n).padStart(2,'0'),homeTeamId:pr[0],awayTeamId:pr[1],groupName:g,stage:'GROUP',status:'FINISHED',kickoff:'',venue:'',homeScore:pr[2],awayScore:pr[3]});
  } else {
   matches.push({id:'m'+String(n).padStart(2,'0'),homeTeamId:a,awayTeamId:b,groupName:g,stage:'GROUP',status:'SCHEDULED',kickoff:'',venue:''});
  }
 }
}

const OUT="/sessions/focused-funny-davinci/mnt/Road to Mundial/packages/core/src/data";
// seed-data.ts
const header=`/**
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

export const SEED_GROUPS: Readonly<Record<string, readonly string[]>> = ${JSON.stringify(GROUPS,null,2)};

export const SEED_FORMATIONS: Readonly<Record<string, string>> = {};

`;
const body=`export const SEED_TEAMS: readonly TeamProfile[] = ${JSON.stringify(teams,null,1)} as const;

export const SEED_HEAD_TO_HEAD: readonly HeadToHead[] = [] as const;
`;
fs.writeFileSync(OUT+"/seed-data.ts",header+body);

// fixtures.ts
const fx=`/**
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

export const SEED_MATCHES: readonly SeedMatch[] = ${JSON.stringify(matches,null,1)};
`;
fs.writeFileSync(OUT+"/fixtures.ts",fx);

console.log('teams:',teams.length,'| grupos:',Object.keys(GROUPS).length,'| fixtures:',matches.length,'| finished:',matches.filter(m=>m.status==='FINISHED').length);
