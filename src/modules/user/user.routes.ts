import { Router } from "express";
import * as UserController from "./user.controller";
import {
  authenticationMiddleware,
  errorHanlderMiddleware,
  validationMiddleware,
} from "../../middlewares";
import * as UserSchemas from "./user.schema";

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

router.put(
  "/update-account",
  authenticationMiddleware,
  validationMiddleware(UserSchemas.updateAccount),
  errorHanlderMiddleware(UserController.updateAccount)
);

router.post(
  "/generate-otp",
  authenticationMiddleware,
  validationMiddleware(UserSchemas.generateOtp),
  errorHanlderMiddleware(UserController.generateOtp)
);

router.get(
  "/account-details",
  authenticationMiddleware,
  errorHanlderMiddleware(UserController.getAccountDetails)
);

router.delete(
  "/delete-account",
  authenticationMiddleware,
  errorHanlderMiddleware(UserController.getAccountDetails)
);

router.get(
  "/specific-account/:id",
  validationMiddleware(UserSchemas.specificAccount),
  errorHanlderMiddleware(UserController.specificAccount)
);

router.put(
  "/update-password",
  authenticationMiddleware,
  validationMiddleware(UserSchemas.updatePassword),
  errorHanlderMiddleware(UserController.updatePassword)
);

router.get(
  "/accounts-with-recovery-email/:email",
  authenticationMiddleware,
  validationMiddleware(UserSchemas.accountsWithRecoveryEmail),
  errorHanlderMiddleware(UserController.accountsWithRecoveryEmail)
);

router.post(
  "/forget-password",
  validationMiddleware(UserSchemas.forgetPassword),
  errorHanlderMiddleware(UserController.forgetPassword)
);

export default router;
