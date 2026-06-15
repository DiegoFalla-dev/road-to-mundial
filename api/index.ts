/**
 * Función serverless de Vercel para la API (OPCIONAL — despliegue todo-en-Vercel).
 *
 * Arranca NestJS sobre Express una sola vez y reutiliza la instancia entre
 * invocaciones (las funciones serverless se mantienen "calientes"). Importa el
 * AppModule YA COMPILADO (apps/api/dist) porque NestJS depende de la metadata de
 * decoradores que `tsc` emite y los bundlers serverless (esbuild) no; por eso el
 * build de Vercel debe compilar la API con `nest build` antes (ver vercel.json).
 *
 * Ruta recomendada y más fiable: API en un host Node (ver render.yaml) y Vercel
 * como proxy a `/api`. Esta función es la alternativa para no salir de Vercel.
 */
import 'reflect-metadata';
import express, { type Express, type Request, type Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// @ts-expect-error: se resuelve tras `nest build` (apps/api/dist).
import { AppModule } from '../apps/api/dist/app.module.js';

const server: Express = express();
let ready: Promise<void> | null = null;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!ready) ready = bootstrap();
  await ready;
  server(req, res);
}
