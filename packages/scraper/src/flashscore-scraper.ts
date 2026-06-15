/**
 * Driver de RESPALDO basado en Playwright para Flashscore.
 *
 * API-Football es el proveedor primario (ver refresh.ts). Este scraper queda
 * como alternativa si el API no estuviera disponible. Flashscore se renderiza
 * con JavaScript, por eso se usa un navegador real (Playwright) en lugar de un
 * simple fetch. Playwright es una dependencia OPCIONAL: este módulo la importa
 * de forma diferida para no obligar a instalarla si solo se usa el API.
 *
 * Uso:  npx playwright install chromium  &&  npx tsx src/flashscore-scraper.ts
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseStandings } from './parse-standings';
import { buildSnapshot } from './build-snapshot';

const STANDINGS_URL =
  'https://www.flashscore.pe/futbol/mundial/campeonato-del-mundo/clasificacion/';

export async function scrapeFlashscore(outPath: string): Promise<void> {
  // Importación diferida para no exigir playwright cuando no se usa.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { chromium } = (await import('playwright')) as typeof import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ locale: 'es-PE' });
    await page.goto(STANDINGS_URL, { waitUntil: 'networkidle' });
    // El contenedor de la tabla; se toma el texto plano y se parsea.
    const text = await page.locator('main').innerText();
    const parsed = parseStandings(text);
    if (parsed.length === 0) {
      throw new Error('No se pudo parsear la clasificación (¿bloqueo anti-bot o cambio de DOM?).');
    }
    const snapshot = buildSnapshot(parsed, { retrievedAt: new Date().toISOString() });
    writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
    console.log(`Snapshot (Flashscore) escrito: ${snapshot.teams.length} equipos → ${outPath}`);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  const out =
    process.argv[2]
      ? resolve(process.argv[2])
      : resolve(__dirname, '../../../apps/api/data/worldcup-2026.snapshot.json');
  scrapeFlashscore(out).catch((err) => {
    console.error('Fallo el scraping:', err.message);
    process.exitCode = 1;
  });
}
