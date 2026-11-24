import { z } from "zod";
import { registry } from "../../docs/openapi.js";

const HealthResponseSchema = z
  .object({
    status: z.enum(["ok", "error"]),
    database: z.enum(["up", "down"]),
  })
  .meta({ id: "HealthResponse" });

registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Check that the server and database are running",
  responses: {
    200: {
      description: "Server and database are healthy",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
          example: { status: "ok", database: "up" },
        },
      },
    },
    503: {
      description: "Database is unreachable",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
          example: { status: "error", database: "down" },
        },
      },
    },
  },
});
