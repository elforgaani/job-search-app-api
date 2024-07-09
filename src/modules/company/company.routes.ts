import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware";
import * as CompanyController from "../company/company.controller";
import { errorHanlderMiddleware } from "../../middlewares/error-hanlder.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as CompanySchemas from "./company.schema";
const router = Router();

router.post(
  "/add-company",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(CompanySchemas.addCompany),
  errorHanlderMiddleware(CompanyController.addCompany)
);

router.put(
  "/update-company",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(CompanySchemas.updateCompany),
  errorHanlderMiddleware(CompanyController.updateCompany)
);

router.delete(
  "/delete-company",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  errorHanlderMiddleware(CompanyController.deleteCompany)
);

// Todo:Route No 4 in Notion File

router.get(
  "/search-company/:name",
  authenticationMiddleware,
  validationMiddleware(CompanySchemas.searchCompany),
  errorHanlderMiddleware(CompanyController.searchCompany)
);

router.get(
  "/get-job-applications/:id",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(CompanySchemas.getJobApplications),
  errorHanlderMiddleware(CompanyController.getJobApplications)
);

export default router;
