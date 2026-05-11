/**
 * OperaAI Claims Intelligence — Express Server
 *
 * Serves the tRPC API and (in production) the built Vite frontend.
 */

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { appRouter } from "./routers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const isDev = process.env.NODE_ENV !== "production";

const app = express();

// ── tRPC API ──────────────────────────────────────────────────────────────────
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

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
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   tRPC API: http://localhost:${PORT}/api/trpc`);
  if (isDev) {
    console.log(`   Frontend (Vite): http://localhost:5173\n`);
  }
});
