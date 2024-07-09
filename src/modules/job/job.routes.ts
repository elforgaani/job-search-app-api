import { Router } from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
  errorHanlderMiddleware,
  validationMiddleware,
} from "../../middlewares";
import * as JobSchemas from "./job.schema";
import * as JobController from "./job.controller";

const router = Router();

router.post(
  "/add-job",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.addJob),
  errorHanlderMiddleware(JobController.addJob)
);

router.put(
  "/update-job/:id",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.updateJob),
  errorHanlderMiddleware(JobController.updateJob)
);

router.delete(
  "/delete-job/:id",
  authenticationMiddleware,
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.deleteJob),
  errorHanlderMiddleware(JobController.deleteJob)
);

router.get(
  "/get-all-jobs",
  authenticationMiddleware,
  authorizationMiddleware(["company_hr", "user"]),
  errorHanlderMiddleware(JobController.getAllJobs)
);

router.get(
  "/get-jobs-by-company-name",
  authenticationMiddleware,
  authorizationMiddleware(["company_hr", "user"]),
  validationMiddleware(JobSchemas.getJobsWithCompanyName),
  errorHanlderMiddleware(JobController.getJobsWithCompanyName)
);

router.get(
  "/get-jobs-with-filters",
  authenticationMiddleware,
  authorizationMiddleware(["user", "company_hr"]),
  validationMiddleware(JobSchemas.getJobWithFilters),
  errorHanlderMiddleware(JobController.getJobsWithFilters)
);

export default router;
