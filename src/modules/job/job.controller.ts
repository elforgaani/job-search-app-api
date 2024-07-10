import { NextFunction, Request, Response } from "express";
import Company from "../../database/models/company.model";
import { CustomError } from "../../interfaces/CustomError";
import Job from "../../database/models/job.model";
import Application from "../../database/models/application.model";

/**
 * @property {string} jobTitle
 * @property {string} jobLocation
 * @property {string} seniorityLevel
 * @property {string} jobDescription
 * @property {string[]} technicalSkills
 * @property {string[]} softSkills
 */
/**
 * Adds a new job.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const addJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const {
    jobTitle,
    jobLocation,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const jobData = {
    jobTitle,
    jobLocation,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: user.id,
  };
  // Todo: Needs to be optimized
  const isCompanyExist = await Company.find({ companyHr: user.id });

  if (!isCompanyExist) {
    return next(new CustomError(false, 404, "Company Doesn't Exist"));
  }
  const job = await Job.create(jobData);
  res.status(200).json({ success: true, message: "Job Created Successfully" });
};

/**
 * @property {string} jobTitle
 * @property {string} jobLocation
 * @property {string} seniorityLevel
 * @property {string} jobDescription
 * @property {string[]} technicalSkills
 * @property {string[]} softSkills
 */
/**
 * Updates an existing job.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { id: jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const newJobData = {
    jobTitle,
    jobLocation,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  };
  const oldJobData = await Job.findById(jobId);
  if (!oldJobData) {
    return next(new CustomError(false, 404, "Job Not Found"));
  }
  if ((oldJobData.addedBy.toString() || "") !== user.id) {
    return next(
      new CustomError(false, 403, "You'are not authorized to Update this Job")
    );
  }
  const result = await Job.findByIdAndUpdate(jobId, newJobData, { new: true });
  res
    .status(200)
    .json({ success: true, message: "Job Updated Successfully", data: result });
};

/**
 * Deletes an existing job.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { id: jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new CustomError(false, 404, "Job Not Found"));
  }
  if ((job.addedBy.toString() || "") !== user.id) {
    return next(
      new CustomError(false, 403, "You'are not authorized to Delete this Job")
    );
  }
  await Job.findByIdAndDelete(jobId);
  res.status(200).json({ success: true, message: "Job Deleted Successfully" });
};

/**
 * Retrieves all jobs with associated company and industry information.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHr",
        as: "companyInfo",
      },
    },
    {
      $unwind: "$companyInfo",
    },
    {
      $lookup: {
        from: "industries",
        localField: "companyInfo.industry",
        foreignField: "_id",
        as: "industry",
      },
    },
    {
      $unwind: "$industry",
    },
  ]);
  res.status(200).json({ success: true, data: jobs });
};

/**
 * Retrieves jobs filtered by company name, with associated company and industry information.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getJobsWithCompanyName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.query;

  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHr",
        as: "companyInfo",
      },
    },
    {
      $unwind: "$companyInfo",
    },
    {
      $lookup: {
        from: "industries",
        localField: "companyInfo.industry",
        foreignField: "_id",
        as: "industry",
      },
    },
    {
      $unwind: "$industry",
    },
    {
      $match: {
        "companyInfo.companyName": name,
      },
    },
    {
      $addFields: {
        "companyInfo.industry": "$industry",
      },
    },
    {
      $project: {
        jobTitle: 1,
        jobLocation: 1,
        seniorityLevel: 1,
        jobDescription: 1,
        technicalSkills: 1,
        softSkills: 1,
        "companyInfo.companyName": 1,
        "companyInfo.companyEmail": 1,
        "companyInfo.industry.name": 1,
      },
    },
  ]);
  res.status(200).json({ success: true, data: jobs });
};

/**
 * Retrieves jobs filtered by various criteria.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getJobsWithFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
  } = req.query;

  const filter: any = {};
  if (jobTitle) filter.jobTitle = jobTitle;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (workingTime) filter.workingTime = workingTime;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (technicalSkills) technicalSkills;

  const jobs = await Job.find(filter);
  res.status(200).json({ success: true, data: jobs });
};

/**
 * Application data structure.
 * @property {string} jobId - The ID of the job to which the user is applying.
 * @property {string} userId - The ID of the user applying for the job.
 * @property {string[]} userTechSkills - Array of technical skills of the user.
 * @property {string[]} userSoftSkills - Array of soft skills of the user.
 */
/**
 * Allows a user to apply to a job.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const applyToJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { id: jobId } = req.params;
  // Should Be Included to user Profile When Creating Account
  const { userTechSkills, userSoftSkills } = req.body;
  const applicationData = {
    jobId,
    userId: user.id,
    userTechSkills,
    userSoftSkills,
  };
  const isJobExist = await Job.findById(jobId);
  if (!isJobExist) {
    return next(new CustomError(false, 404, "Job Doesn't Exist"));
  }
  const application = await Application.create(applicationData);
  res.status(200).json({
    success: true,
    message: "Application Created Successfully",
    data: application,
  });
};
