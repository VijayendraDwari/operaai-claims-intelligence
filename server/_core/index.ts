/**
 * OperaAI Claims Intelligence — Server Entry Point
 *
 * Wires up Express with tRPC middleware.
 * In development, Vite serves the frontend on port 5173 with HMR.
 * In production, Express serves the built static files.
 */

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { appRouter } from "../routers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const isDev = process.env.NODE_ENV !== "production";

const app = express();

app.use(express.json());

// ── tRPC API ──────────────────────────────────────────────────────────────────
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "OperaAI Claims Intelligence" });
});

// ── Static Frontend (production only) ────────────────────────────────────────
if (!isDev) {
  const distPath = path.join(__dirname, "../../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`\n🎭 OperaAI Claims Intelligence`);
  console.log(`   API Server: http://localhost:${PORT}`);
  if (isDev) {
    console.log(`   Frontend (Vite dev): http://localhost:5173`);
  }
  console.log(`   Environment: ${isDev ? "development" : "production"}\n`);
});
