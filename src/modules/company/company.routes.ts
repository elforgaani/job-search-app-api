import { Router } from "express";
import {
  authenticationMiddleware,
  errorHanlderMiddleware,
  validationMiddleware,
  authorizationMiddleware,
} from "../../middlewares";
import * as CompanyController from "../company/company.controller";
import * as CompanySchemas from "./company.schema";
const router = Router();

// Warp All Routes With Auth Middlware using router.use()

router.use(authenticationMiddleware);

router.get(
  "/search-company/:name",
  validationMiddleware(CompanySchemas.searchCompany),
  errorHanlderMiddleware(CompanyController.searchCompany)
);

// Warp All Routes With Authorization Middlware using router.use()

router.use(authorizationMiddleware("company_hr"));

router.post(
  "/add-company",
  validationMiddleware(CompanySchemas.addCompany),
  errorHanlderMiddleware(CompanyController.addCompany)
);

router.put(
  "/update-company",
  validationMiddleware(CompanySchemas.updateCompany),
  errorHanlderMiddleware(CompanyController.updateCompany)
);

router.delete(
  "/delete-company",
  errorHanlderMiddleware(CompanyController.deleteCompany)
);

router.get(
  "/get-company-data/:id",
  validationMiddleware(CompanySchemas.getCompanyData),
  errorHanlderMiddleware(CompanyController.getCompanyData)
);

router.get(
  "/get-job-applications/:id",
  validationMiddleware(CompanySchemas.getJobApplications),
  errorHanlderMiddleware(CompanyController.getJobApplications)
);

export default router;
