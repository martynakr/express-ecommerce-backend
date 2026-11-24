import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authController } from "./auth.controller.js";
import { LoginBodySchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/login", validate({ body: LoginBodySchema }), authController.login);
