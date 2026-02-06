import type { Application } from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../apps/api/src/app/app.module";

let appPromise: Promise<Application> | null = null;

/**
 * Returns the Express app that backs the NestJS API (used by Firebase HTTPS function).
 */
export function getApp(): Promise<Application> {
  if (!appPromise) {
    appPromise = (async () => {
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix("api");
      await app.init();
      return app.getHttpAdapter().getInstance() as Application;
    })();
  }
  return appPromise;
}
