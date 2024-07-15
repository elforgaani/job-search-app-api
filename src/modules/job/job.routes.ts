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

// Warp All Routes With Auth Middlware using router.use()

router.use(authenticationMiddleware);

router.post(
  "/add-job",
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.addJob),
  errorHanlderMiddleware(JobController.addJob)
);

router.put(
  "/update-job/:id",
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.updateJob),
  errorHanlderMiddleware(JobController.updateJob)
);

router.delete(
  "/delete-job/:id",
  authorizationMiddleware("company_hr"),
  validationMiddleware(JobSchemas.deleteJob),
  errorHanlderMiddleware(JobController.deleteJob)
);

router.get(
  "/get-all-jobs",
  authorizationMiddleware(["company_hr", "user"]),
  errorHanlderMiddleware(JobController.getAllJobs)
);

router.get(
  "/get-jobs-by-company-name",
  authorizationMiddleware(["company_hr", "user"]),
  validationMiddleware(JobSchemas.getJobsWithCompanyName),
  errorHanlderMiddleware(JobController.getJobsWithCompanyName)
);

router.get(
  "/get-jobs-with-filters",
  authorizationMiddleware(["user", "company_hr"]),
  validationMiddleware(JobSchemas.getJobWithFilters),
  errorHanlderMiddleware(JobController.getJobsWithFilters)
);

router.post(
  "/apply-to-job/:id",
  authorizationMiddleware("user"),
  validationMiddleware(JobSchemas.applyToJob),
  errorHanlderMiddleware(JobController.applyToJob)
);

export default router;
