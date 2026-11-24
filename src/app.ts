import express from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./docs/openapi.js";
import { healthRouter } from "./modules/health/health.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/health", healthRouter);

  const openApiDocument = generateOpenApiDocument();

  app.get("/docs.json", (_req, res) => {
    res.json(openApiDocument);
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  return app;
}
