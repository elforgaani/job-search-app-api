import { NextFunction, Request, Response } from "express";
import Company from "../../database/models/company.model";
import { CustomError } from "../../interfaces/CustomError";
import Job from "../../database/models/job.model";

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

export const getJobsWithCompanyName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.query;
  console.log(name);

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

export const getJobsWithFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
