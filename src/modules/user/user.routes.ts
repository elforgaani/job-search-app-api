import { Router } from "express";
import * as UserController from "./user.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as UserSchemas from "./user.schema";
import { errorHanlderMiddleware } from "../../middlewares/error-hanlder.middleware";

const router = Router();
router.post(
  "/sign-up",
  validationMiddleware(UserSchemas.signUpUser),
  errorHanlderMiddleware(UserController.signUp)
);
router.post(
  "/verify-email",
  validationMiddleware(UserSchemas.verifyEmail),
  errorHanlderMiddleware(UserController.confirmEmail)
);

router.post(
  "/resend-otp",
  validationMiddleware(UserSchemas.resendOtp),
  errorHanlderMiddleware(UserController.resendOtp)
);

router.post(
  "/sign-in",
  validationMiddleware(UserSchemas.signInUser),
  errorHanlderMiddleware(UserController.signIn)
);

export default router;
