# Road to Mundial 2026 ⚽

Plataforma de análisis futbolístico del Mundial 2026: compara selecciones, evalúa su forma reciente
y genera **probabilidades estimadas** de cada partido mediante un modelo ponderado basado en datos.

> ⚠️ Las probabilidades son **estimaciones estadísticas**, no garantías ni predicciones absolutas.

---

## Características

- **Dashboard** con próximos partidos, selecciones destacadas y últimos resultados.
- **Comparador de equipos** con radar de perfil, barras de estadísticas y predicción 1X2.
- **Vista de partido** con probabilidades, factores clave, riesgos y conclusión automática.
- **Perfil de selección** con forma reciente, estadísticas y evolución del rendimiento.
- **Dark / Light mode**, diseño responsive *mobile-first*, skeleton loaders y animaciones suaves.
- **Motor analítico** desacoplado y testeado (probabilidades que suman 100 %, pesos validados).

---

## Arquitectura (monorepo)

```
road-to-mundial/
├─ packages/
│  └─ core/            # @rtm/core — motor analítico (tipos, modelo, probabilidades, datos)
├─ apps/
│  ├─ api/             # @rtm/api — backend NestJS (REST) sobre @rtm/core
│  └─ web/             # @rtm/web — frontend Angular 18 (standalone + signals)
├─ ARCHITECTURE.md     # diseño técnico, modelo de datos y decisiones
└─ DEPLOYMENT_VERCEL.md
```

El paquete `@rtm/core` es la fuente de verdad del dominio: define los tipos compartidos, el modelo
de evaluación ponderado y el generador de probabilidades. Tanto el backend como el frontend lo
consumen, garantizando **tipado de extremo a extremo**. Los datos se sirven detrás de la interfaz
abstracta `DataSource` (hoy `SeedDataSource`; mañana una `PrismaDataSource` sobre PostgreSQL) sin
tocar el motor ni los consumidores. Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Stack

| Capa          | Tecnología                                             |
| ------------- | ------------------------------------------------------ |
| Frontend      | Angular 18 (standalone, signals), SCSS, SVG/CSS charts |
| Backend       | NestJS 10 (Express), class-validator                   |
| Núcleo        | TypeScript estricto, sin dependencias de runtime       |
| Persistencia  | PostgreSQL + Prisma (esquema incluido)                 |
| Despliegue    | Vercel (frontend) + serverless/host para la API        |

---

## Puesta en marcha

Requisitos: **Node ≥ 20** y npm ≥ 10.

```bash
# 1) Instalar dependencias (workspaces)
npm install

# 2) Compilar el motor analítico (necesario para api y web)
npm run build:core

# 3) Levantar la API (http://localhost:3000/api)
npm run dev:api

# 4) En otra terminal, levantar el frontend (http://localhost:4200)
npm run dev:web
```

### Persistencia con PostgreSQL (opcional, Fase 2)

Por defecto la API usa el dataset semilla en memoria. Para usar PostgreSQL:

```bash
# 1) Configura la conexión
cp apps/api/.env.example apps/api/.env      # edita DATABASE_URL

# 2) Genera el cliente y aplica el esquema
npm --workspace @rtm/api run prisma:generate
npm --workspace @rtm/api run prisma:migrate

# 3) Carga los datos semilla en la base
npm --workspace @rtm/api run db:seed

# 4) Arranca la API contra PostgreSQL
DATA_SOURCE=prisma npm run dev:api
```

`SeedDataSource` y `PrismaDataSource` implementan el mismo contrato `DataSource`: cambiar de uno a
otro es solo la variable `DATA_SOURCE`, sin tocar el motor ni los servicios.

### Datos en tiempo real (API-Football)

Para mover la tabla y reflejar el avance del torneo de forma automática:

```bash
export API_FOOTBALL_KEY="tu_clave"     # https://www.api-football.com (free 100/día)
npm run refresh:data                    # → apps/api/data/worldcup-2026.snapshot.json
DATA_SOURCE=snapshot npm run dev:api     # la API sirve los datos del snapshot
```

El job de refresco (`@rtm/scraper`) consulta API-Football (tablas + fixtures),
los mapea al `WorldCupSnapshot` del dominio y lo escribe en disco. Programarlo
(GitHub Action incluida en `.github/workflows/refresh-snapshot.yml`, Vercel Cron
o cron del sistema) mantiene la tabla actualizada durante el Mundial. Flashscore
queda como respaldo vía Playwright. Detalle en `packages/scraper/README.md`.

### Probar el motor analítico

```bash
npm run test:core      # 22 tests del motor + transformador de snapshot
npm run test:scraper   # parser de clasificación + mapeadores API-Football
```

Verifica las invariantes críticas: los pesos del modelo suman 1.0, las probabilidades suman
exactamente 100 %, el favorito obtiene mayor probabilidad y la advertencia obligatoria está presente.

---

## Endpoints principales

| Método | Ruta                                        | Descripción                         |
| ------ | ------------------------------------------- | ----------------------------------- |
| GET    | `/api/health`                               | Estado y versión del modelo         |
| GET    | `/api/teams`                                | Listado de selecciones              |
| GET    | `/api/teams/:id`                            | Perfil de selección                 |
| GET    | `/api/standings`                            | Tablas de los 12 grupos             |
| GET    | `/api/matches/upcoming`                     | Próximos partidos                   |
| GET    | `/api/matches/finished`                     | Resultados disputados               |
| GET    | `/api/matches/:id`                          | Vista de partido + predicción       |
| GET    | `/api/analysis/compare?home=arg&away=bra`   | Comparación detallada + predicción  |
| GET    | `/api/analysis/predict?home=arg&away=bra`   | Predicción 1X2                      |

---

## Modelo de evaluación

Puntaje compuesto (0–100) por selección, ponderado:

| Componente              | Peso |
| ----------------------- | ---- |
| Forma reciente          | 25 % |
| Estadísticas ofensivas  | 15 % |
| Estadísticas defensivas | 15 % |
| Calidad de rivales      | 10 % |
| Estado de plantilla     | 10 % |
| Rendimiento histórico   | 10 % |
| Aspecto táctico         | 10 % |
| Historial directo       | 5 %  |

La diferencia de puntaje (más ventaja de localía) se traduce en **goles esperados**, y un modelo de
**Poisson** deriva las probabilidades de local / empate / visitante, normalizadas a 100 % con el
método de los restos mayores. Detalle completo en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Fuentes de datos

El dataset parte de **datos reales del Mundial 2026** obtenidos de
[Flashscore.pe](https://www.flashscore.pe/futbol/mundial/campeonato-del-mundo/clasificacion/)
(14-06-2026): las **48 selecciones en sus 12 grupos oficiales** y los **resultados de la jornada 1**
ya disputada (grupos A–F). Las métricas detalladas aún no medidas (tiros, historial directo) y los
ratings de fuerza son **provisionales** (prior por ranking mezclado con la forma real J1) hasta que
el **sistema de extracción** complete las estadísticas. Todo entra por la interfaz `DataSource`.

---

## Estado del proyecto

Fases 1 y 2 completadas: motor analítico testeado (17 tests), API REST, frontend con las cuatro
vistas, y **persistencia PostgreSQL** vía `PrismaDataSource` con seed (intercambiable con el dataset
semilla por entorno). Próximas fases en [`ARCHITECTURE.md`](./ARCHITECTURE.md#8-roadmap).

## Licencia

MIT.
