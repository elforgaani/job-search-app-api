import express from "express";
import "dotenv/config";
import { globalErrorMiddleware } from "./middlewares/global-error.middleware";
import { dbConnection } from "./database/connection";
export const main = () => {
  const app = express();
  const port = parseInt(process.env.PORT || "4000");
  
  dbConnection();

  app.use(express.json());

  app.use(globalErrorMiddleware);

  app.listen(port, () => console.log("Server Connected Successfully."));
};
