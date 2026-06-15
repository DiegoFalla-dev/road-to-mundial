# @rtm/scraper — Ingesta de datos del Mundial 2026

Convierte datos reales del torneo en un **`WorldCupSnapshot`** (tipo del dominio
`@rtm/core`) que la aplicación consume vía `SnapshotDataSource`. Dos fuentes:

1. **API-Football** (api-sports.io) — **primaria**. Tablas, fixtures y resultados
   en (casi) tiempo real. Refresca la tabla y el avance del torneo con un job.
2. **Flashscore** (Playwright) — **respaldo**. Scraping del navegador si el API
   no estuviera disponible.

Ambas producen el mismo snapshot, así que el motor, la API y la UI no cambian.

```
parse-standings.ts   parser puro de la clasificación (Flashscore)        [tested]
teams-meta.ts        48 selecciones: id, código, confederación, prior
aliases-en.ts        nombres EN (API-Football) → id
apifootball/         cliente + mapeadores standings/fixtures → snapshot   [tested]
build-snapshot.ts    parsed (Flashscore) → snapshot
refresh.ts           job: API-Football → escribe el snapshot JSON
flashscore-scraper.ts driver Playwright de respaldo
```

## Uso — API-Football (recomendado)

1. Crea una cuenta y obtén tu API key en https://www.api-football.com/ (plan free:
   100 req/día; cubre el Mundial 2026, `league=1&season=2026`).
2. Refresca el snapshot:

```bash
export API_FOOTBALL_KEY="tu_clave"
npm --workspace @rtm/scraper run refresh
# → escribe apps/api/data/worldcup-2026.snapshot.json
```

3. Arranca la API leyendo el snapshot:

```bash
DATA_SOURCE=snapshot npm run dev:api
```

La API servirá tablas, perfiles y predicciones a partir de los datos del snapshot.
Cada `refresh` actualiza la tabla y los resultados conforme avanza el torneo.

## Automatizar el refresco (mover la tabla con el tiempo)

Cualquier programador de tareas sirve. Ejemplo con **GitHub Actions** (cada 3 h
durante el torneo): ver `.github/workflows/refresh-snapshot.yml`. Alternativas:
Vercel Cron, un cron del sistema, o `node-cron` dentro de un worker.

## Uso — Flashscore (respaldo)

```bash
npx playwright install chromium
npm --workspace @rtm/scraper run scrape:flashscore
```

> Flashscore se renderiza con JavaScript y aplica anti-bot; úsalo solo si el API
> falla, y de forma respetuosa (baja frecuencia).

## Tests

```bash
npm --workspace @rtm/scraper run test
```

Cubre: el parser de clasificación con un volcado real de Flashscore, y los
mapeadores de API-Football (standings + fixtures → snapshot → dominio).
