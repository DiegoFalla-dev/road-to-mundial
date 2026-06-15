# Guía de despliegue — Road to Mundial 2026

El proyecto se despliega en **Vercel** (frontend Angular). Para la API hay dos
caminos; elige uno. Ambos dejan el frontend llamando a `/api/...` (mismo origen),
sin problemas de CORS.

> Requisito previo: sube el repositorio a GitHub/GitLab/Bitbucket.

---

## Camino A — Todo en Vercel (frontend + API serverless)

El `vercel.json` de la raíz ya está configurado: compila `@rtm/core`, la API
(`nest build`) y el frontend, sirve el estático y expone la API como **función
serverless** en `api/index.ts` (NestJS sobre Express, instancia cacheada).

### Pasos

1. En Vercel: **Add New → Project** e importa el repo. **Root Directory = raíz**.
2. Vercel detecta `vercel.json`. No cambies nada. (La API usa por defecto
   `DATA_SOURCE=seed`, con los datos reales del Mundial embebidos, así que
   funciona sin configurar nada más.)
3. **Deploy**. Tendrás:
   - Frontend en `https://<tu-proyecto>.vercel.app`
   - API en `https://<tu-proyecto>.vercel.app/api/health`, `/api/standings`, etc.

> Nota técnica: la API se compila con `tsc` (vía `nest build`) **antes** de
> empaquetar la función, porque NestJS necesita la metadata de decoradores que
> los bundlers serverless no emiten. Por eso `api/index.ts` importa
> `apps/api/dist`. Si una función excede el arranque en frío, sube `maxDuration`
> en `vercel.json`.

---

## Camino B — Frontend en Vercel + API en Render (recomendado para fiabilidad)

NestJS rinde mejor como servidor de larga vida. El repo incluye `render.yaml`
(blueprint) para desplegar la API en Render con un clic.

### B.1 API en Render

1. En Render: **New → Blueprint** y conecta el repo. Detecta `render.yaml`.
2. Deploy. La API queda en `https://road-to-mundial-api.onrender.com/api`.
   (Health check en `/api/health`.)

### B.2 Frontend en Vercel apuntando a esa API

Edita el `vercel.json` de la raíz: quita el bloque `functions` y añade un
*rewrite* que reenvíe `/api` a Render (reemplaza el host por el tuyo):

```jsonc
{
  "installCommand": "npm install",
  "buildCommand": "npm run build:core && npm --workspace @rtm/web run build:prod",
  "outputDirectory": "apps/web/dist/web/browser",
  "framework": null,
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://road-to-mundial-api.onrender.com/api/:path*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

Despliega en Vercel (Root Directory = raíz). El frontend seguirá llamando a
`/api` y Vercel lo reenviará a Render.

---

## Datos en tiempo real (mover la tabla durante el torneo)

Independiente del camino elegido:

1. Crea tu clave gratuita en https://www.api-football.com.
2. En GitHub → Settings → Secrets → Actions, añade `API_FOOTBALL_KEY`.
3. El workflow `.github/workflows/refresh-snapshot.yml` se ejecuta cada 3 h:
   consulta API-Football, regenera `apps/api/data/worldcup-2026.snapshot.json` y
   lo commitea. Cada commit dispara un redeploy (Vercel/Render), reflejando la
   tabla y los resultados actualizados.
4. Para que la API sirva ese snapshot, pon `DATA_SOURCE=snapshot`:
   - Vercel: Project → Settings → Environment Variables.
   - Render: ya está en `render.yaml` (cámbialo de `seed` a `snapshot`).

Mientras no configures la clave, la app funciona con el dataset real embebido
(`DATA_SOURCE=seed`).

---

## Base de datos (opcional, PostgreSQL)

Con `DATA_SOURCE=prisma`: provisiona PostgreSQL (Neon/Supabase/Railway), define
`DATABASE_URL`, y en el build ejecuta `prisma generate` + `prisma migrate deploy`
+ `npm --workspace @rtm/api run db:seed`.

---

## Checklist

- [ ] `npm install && npm run build:core` sin errores.
- [ ] `npm --workspace @rtm/web run build:prod` genera `apps/web/dist/web/browser`.
- [ ] (Camino A) `npm --workspace @rtm/api run build` genera `apps/api/dist`.
- [ ] `GET /api/health` responde `{ status: "ok" }`.
- [ ] `GET /api/standings` devuelve los 12 grupos.
- [ ] El frontend navega entre `/`, `/grupos`, `/comparador`, `/partido/:id`.
- [ ] (Tiempo real) `API_FOOTBALL_KEY` configurada y el workflow ejecutado.
