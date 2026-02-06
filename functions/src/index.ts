import { onRequest } from "firebase-functions/v2/https";

/**
 * HTTP function for /api/** rewrites from Firebase Hosting.
 * Serves as a minimal stub; can be extended to proxy to NestJS API or implement handlers.
 */
export const api = onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }
  res.json({
    message: "Firebase Functions API",
    path: req.path,
    method: req.method,
  });
});
