import { Router } from "express";
import * as UserController from "./user.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { signUpSchema } from "./user.schema";
import { errorHanlderMiddleware } from "../../middlewares/error-hanlder.middleware";

const router = Router();
router.post(
  "/",
  validationMiddleware(signUpSchema),
  errorHanlderMiddleware(UserController.signUp)
);

export default router;
