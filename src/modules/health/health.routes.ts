import { Router } from "express";
import { z } from "zod";
import { registry } from "../../docs/openapi.js";
import { prisma } from "../../lib/prisma.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "up" });
  } catch {
    res.status(503).json({ status: "error", database: "down" });
  }
});

const HealthResponse = registry.register(
  "HealthResponse",
  z.object({
    status: z.enum(["ok", "error"]),
    database: z.enum(["up", "down"]),
  }),
);

registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Check that the server and database are running",
  responses: {
    200: {
      description: "Server and database are healthy",
      content: { "application/json": { schema: HealthResponse } },
    },
    503: {
      description: "Database is unreachable",
      content: { "application/json": { schema: HealthResponse } },
    },
  },
});
