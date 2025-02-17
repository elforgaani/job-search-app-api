import express from "express";
import "dotenv/config";
import { globalErrorResponse } from "./middlewares/global-error.middleware";
import { dbConnection } from "./database/connection";
import UsersRouter from "./modules/user/user.routes";
import CompanyRouter from './modules/company/company.routes';
import JobRouter from './modules/job/job.routes';

export const main = () => {
  const app = express();

  const port = parseInt(process.env.PORT || "4000");
  dbConnection();
  // sendEmailService();
  app.use(express.json());
  app.use("/api/v1/user", UsersRouter);
  app.use("/api/v1/company", CompanyRouter);
  app.use("/api/v1/job", JobRouter)
  app.use(globalErrorResponse());

  app.listen(port, () => console.log("Server Connected Successfully."));
};
