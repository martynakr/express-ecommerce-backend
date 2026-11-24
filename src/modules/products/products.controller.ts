import type { Request, Response } from "express";
import type { ProductListQuery } from "./products.schemas.js";
import { productsService } from "./products.service.js";

export const productsController = {
  async list(req: Request, res: Response) {
    const query = req.query as unknown as ProductListQuery;
    const result = await productsService.list(query);
    res.status(200).json(result);
  },
};
