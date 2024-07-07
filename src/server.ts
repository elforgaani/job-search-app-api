import express from "express";
import "dotenv/config";
import { globalErrorResponse } from "./middlewares/global-error.middleware";
import { dbConnection } from "./database/connection";
import UsersRouter from "./modules/user/user.routes";
import { sendEmailService } from "./services/send-email.service";
export const main = () => {
  const app = express();
  const port = parseInt(process.env.PORT || "4000");

  dbConnection();
  // sendEmailService();
  app.use(express.json());
  app.use("/api/v1/user", UsersRouter);
  app.use(globalErrorResponse());

  app.listen(port, () => console.log("Server Connected Successfully."));
};
