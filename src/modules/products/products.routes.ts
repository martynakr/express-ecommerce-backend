import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { productsController } from "./products.controller.js";
import { ProductListQuerySchema } from "./products.schemas.js";

export const productsRouter = Router();

productsRouter.get("/", validate({ query: ProductListQuerySchema }), productsController.list);
