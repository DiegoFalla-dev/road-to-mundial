# Arquitectura — Road to Mundial 2026

Documento de diseño técnico. Cubre visión, requisitos, modelo de datos, el motor analítico, los
contratos de API, decisiones y *trade-offs*, y el roadmap por fases.

---

## 1. Visión y alcance

Plataforma web que analiza selecciones del Mundial 2026, las compara y genera probabilidades
estimadas por partido mediante un modelo basado en datos. Calidad objetivo: producto SaaS
profesional. Las probabilidades se presentan siempre como estimaciones estadísticas, nunca como
garantías.

### Requisitos funcionales

- Listar y perfilar selecciones (forma, ataque, defensa, plantilla, evolución).
- Comparar dos selecciones (rendimiento, ataque, defensa, historial, forma) con gráficos.
- Generar probabilidades 1X2 por partido con nivel de confianza, factores y riesgos.
- Dashboard con próximos partidos, destacados y últimos análisis.

### Requisitos no funcionales

- **Escalabilidad**: capas desacopladas; el origen de datos es sustituible sin tocar el dominio.
- **Mantenibilidad**: SOLID, Clean Architecture, tipado estricto, dominio sin dependencias.
- **Rendimiento**: lazy loading, carga diferida, Lighthouse > 90 como objetivo.
- **Seguridad**: validación de entrada (class-validator), CORS controlado, sin secretos en cliente.
- **Correctitud**: invariantes del modelo verificadas con tests (pesos = 1, probabilidades = 100).

---

## 2. Vista de componentes

```
            ┌──────────────────────────┐
            │      @rtm/web (Angular)   │
            │  Dashboard · Comparador   │
            │  Partido · Selección      │
            └─────────────┬────────────┘
                          │ HTTP/JSON (tipos compartidos)
                          ▼
            ┌──────────────────────────┐
            │      @rtm/api (NestJS)    │
            │  teams · matches · analysis│
            └─────────────┬────────────┘
                          │ usa
                          ▼
        ┌───────────────────────────────────┐
        │            @rtm/core               │
        │  types · model(weights, scoring,   │
        │  evaluator) · probability(poisson, │
        │  predictor) · data(DataSource)     │
        └─────────────┬─────────────────────┘
                      │ implementa DataSource
          ┌───────────┴────────────┐
          ▼                        ▼
   SeedDataSource          PrismaDataSource (futuro)
   (dataset semilla)        PostgreSQL vía Prisma
```

El flujo de una predicción: `web` llama a `GET /api/analysis/compare` → `AnalysisService` carga los
perfiles desde `DataSource` → `@rtm/core` evalúa ambos equipos (`evaluateTeam`) y predice
(`predictMatch`) → respuesta tipada al cliente, que pinta barra 1X2, radar y factores.

---

## 3. Modelo de datos (PostgreSQL / Prisma)

Entidades principales (esquema completo en `apps/api/prisma/schema.prisma`):

- **Team**: selección, ratings intrínsecos (histórico, táctico, calidad de rivales), formación.
- **FormRecord**: agregado por ventana (5/10/15): jugados, V/E/D, goles a favor/contra, secuencia.
- **OffensiveStat / DefensiveStat / SquadStatus**: métricas 1:1 con Team.
- **HeadToHead**: enfrentamientos directos dirigidos (team → opponent).
- **Match**: partido del torneo (grupo, fase, estado, sede, marcador).
- **Analysis**: predicción persistida (probabilidades, confianza, payload, versión del modelo).

`HeadToHead` se modela dirigido para consultar el historial desde la perspectiva de cada equipo sin
ambigüedad. `Analysis` guarda el `MatchPrediction` completo en un campo `Json` para trazabilidad y
versionado del modelo.

---

## 4. Motor analítico (`@rtm/core`)

### 4.1 Puntaje compuesto

Cada componente se normaliza a 0–100 y se pondera:

| Componente             | Peso | Función                                  |
| ---------------------- | ---- | ---------------------------------------- |
| Forma reciente         | 0.25 | ppp ponderada por recencia (5>10>15)     |
| Ofensiva               | 0.15 | goles anotados (60 %) + conversión (40 %)|
| Defensiva              | 0.15 | goles recibidos inv. (60 %) + clean (40 %)|
| Calidad de rivales     | 0.10 | rating Elo-like normalizado              |
| Plantilla              | 0.10 | disponibilidad de clave − sanciones      |
| Histórico              | 0.10 | pedigrí del equipo                       |
| Táctico                | 0.10 | valoración táctica                       |
| Historial directo      | 0.05 | ppp vs ese rival (neutro = 50 si no hay) |

`assertWeightsValid` lanza si los pesos no suman 1.0 (validación en cada evaluación).

### 4.2 De puntaje a probabilidades

1. `diff = ratingLocal + ventajaLocalía − ratingVisitante`.
2. `supremacy = diff / ratingPerGoal` (20 puntos ≈ 1 gol).
3. Goles esperados: `λ_local = base + supremacy/2`, `λ_visita = base − supremacy/2` (base ≈ 1.35,
   piso 0.15).
4. **Poisson**: se construye la matriz de marcadores (0..10) y se agregan P(local), P(empate),
   P(visita); se **normaliza** por la cola truncada → suman 1 por construcción.
5. `toPercentages` convierte a enteros que suman **exactamente 100** (método de restos mayores).

La ventaja de localía es configurable porque las sedes del Mundial son neutrales salvo el anfitrión.

### 4.3 Confianza, factores y riesgos

- **Confianza**: ALTA si el favorito ≥ 55 % y la brecha de rating ≥ 12; MEDIA con señales
  intermedias; BAJA en partidos parejos.
- **Factores / riesgos**: derivados del desglose (forma, ataque, defensa, plantilla, h2h) y de la
  probabilidad de empate. Texto explicativo, nunca determinista.

### 4.4 Tests

`packages/core/test` cubre: suma de pesos, rango del compuesto, monotonía (mejor equipo → mayor
puntaje), suma de Poisson, suma exacta a 100 %, favorito con mayor probabilidad y presencia del
disclaimer.

---

## 5. Contratos de API

Respuestas tipadas con los tipos de `@rtm/core` (sin duplicación). Ejemplos:

- `GET /api/analysis/compare?home=arg&away=bra` → `{ home, away, homeRating, awayRating, prediction, modelVersion }`.
- `GET /api/matches/:id` → `{ match, prediction }`.

Validación de query con `class-validator` y `ValidationPipe` global (whitelist + transform).

---

## 6. Frontend (`@rtm/web`)

- **Angular 18 standalone** + **signals** para estado reactivo sin boilerplate.
- **Lazy loading** por ruta (`loadComponent`), *component input binding* para parámetros de ruta.
- Servicios desacoplados: `ApiService` (HTTP tipado), `ThemeService` (dark/light persistido).
- Visualizaciones en **SVG/CSS puro** (radar y barras) sin dependencias de chart pesadas; pueden
  sustituirse por ApexCharts/ECharts manteniendo los mismos modelos (ver roadmap).
- Diseño *mobile-first* con tokens CSS, skeleton loaders y animaciones suaves.

---

## 7. Decisiones y trade-offs

| Decisión                              | Motivo                                              | Trade-off                                  |
| ------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Dominio en paquete propio `@rtm/core` | Reuso y tipado E2E entre api y web                  | Requiere `build:core` antes de api/web     |
| `DataSource` abstracto + seed         | Desarrollar sin scraping; legal y robusto           | Datos no reales hasta enchufar proveedor   |
| Poisson para probabilidades           | Estándar, interpretable, suma 100 garantizada       | Asume independencia de goles               |
| SVG/CSS para gráficos                 | Cero dependencias, *bundle* mínimo, build robusto   | Menos features que una librería dedicada   |
| Restos mayores para %                 | Suma exacta a 100 sin sesgo                         | Ligero redondeo respecto al valor continuo |

---

## 8. Roadmap

- **Fase 1 (hecha)**: monorepo, motor testeado, API REST, frontend con 4 vistas, esquema PG, docs.
- **Fase 2 (hecha)**: `PrismaDataSource` + mappers puros testeados + seed de PostgreSQL; selección
  de fuente por `DATA_SOURCE`. Pendiente: persistir `Analysis` y migraciones versionadas.
- **Fase 3 (hecha)**: ingesta en tiempo real. Paquete `@rtm/scraper` con proveedor
  primario **API-Football** (tablas + fixtures → `WorldCupSnapshot`) y respaldo
  **Flashscore** (Playwright). `SnapshotDataSource` consume el snapshot por la
  misma interfaz `DataSource`; job programado (GitHub Action) refresca la tabla.
  Mapeadores y parser testeados.
- **Fase 4**: ApexCharts/ECharts, caché HTTP, autenticación, panel admin, i18n.
- **Fase 5**: observabilidad (logging/monitoring), CI/CD, tests e2e, optimización Lighthouse.
