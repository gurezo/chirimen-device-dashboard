import { onRequest } from "firebase-functions/v2/https";
import { getApp } from "./main";

/**
 * HTTP function for /api/** rewrites from Firebase Hosting.
 * Serves the NestJS API (e.g. GET /api/health).
 */
export const api = onRequest((req, res) => {
  getApp().then((app) => app(req, res));
});
