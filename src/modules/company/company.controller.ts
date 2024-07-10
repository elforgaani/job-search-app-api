import { NextFunction, Request, Response, application } from "express";
import Industry from "../../database/models/industry.model";
import { CustomError } from "../../interfaces/CustomError";
import Company from "../../database/models/company.model";
import Job from "../../database/models/job.model";
import Application from "../../database/models/application.model";
import mongoose from "mongoose";

/**
 * @property {string} companyName - Name of the company
 * @property {string} description - Description of the company
 * @property {string} industry - ID of the industry
 * @property {string} address - Address of the company
 * @property {number} numberOfEmployees - Number of employees in the company
 * @property {string} companyEmail - Email of the company
 * @property {string} companyHr - ID of the company's HR
 */

/**
 * Adds a new company.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const addCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHr,
  } = req.body;

  const isIndustryExist = await Industry.findById(industry);
  if (!isIndustryExist) {
    return next(new CustomError(false, 404, "Industry doesn't exist"));
  }

  const isCompanyHrDuplicated = await Company.findOne({ companyHr: user.id });
  if (isCompanyHrDuplicated) {
    return next(
      new CustomError(false, 409, "User Already an HR in another company.")
    );
  }
  const companyData = {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHr: user.id,
  };

  const company = await Company.create(companyData);
  res.status(200).json({
    success: true,
    message: "Company Created Successfully",
    data: company,
  });
};

/**
 * @property {string} companyName - Name of the company
 * @property {string} description - Description of the company
 * @property {string} industry - ID of the industry
 * @property {string} address - Address of the company
 * @property {number} numberOfEmployees - Number of employees in the company
 * @property {string} companyEmail - Email of the company
 */

/**
 * Updates an existing company.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const newCompanyData = {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  };
  const isCompanyNameDuplicated = await Company.findOne({
    companyName,
    companyHr: { $ne: user.id },
  });

  if (isCompanyNameDuplicated) {
    return next(
      new CustomError(
        false,
        409,
        "Company Name Already in use, Company Name should be uniqe."
      )
    );
  }

  const updatedCompany = await Company.findOneAndUpdate(
    { companyHr: user.id },
    newCompanyData,
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Company Updated Successfully.",
    data: updatedCompany,
  });
};

/**
 * Deletes an existing company.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const deletedCompany = await Company.findOneAndDelete({ companyHr: user.id });
  if (!deletedCompany) {
    return next(new CustomError(false, 404, "Company Not Found"));
  }
  res
    .status(200)
    .json({ success: true, message: "Company deleted Successfully" });
};
/**
 * Searches for a company by name.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */

export const searchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name: companyName } = req.params;
  const data = await Company.find({ companyName });
  res.status(200).json({ success: true, data });
};

/**
 * Retrieves job applications for a specific job.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getJobApplications = async (
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
    return next(new CustomError(false, 403, "You're not Authorized"));
  }
  const applications = await Application.aggregate([
    {
      $match: {
        jobId: new mongoose.Types.ObjectId(jobId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        jobId: 1,
        userTechSkills: 1,
        userSoftSkills: 1,
        "userInfo.firstName": 1,
        "userInfo.lastName": 1,
        "userInfo.email": 1,
        "userInfo.recoveryEmail": 1,
        "userInfo.dob": 1,
        "userInfo.status": 1,
      },
    },
  ]);
  res.status(200).json({ success: true, data: applications });
};

/**
 * Retrieves company data, including its jobs.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getCompanyData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: companyId } = req.params;
  const company = await Company.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(companyId),
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "companyHr",
        foreignField: "addedBy",
        as: "jobs",
      },
    },
    {
      $project: {
        __v: 0,
        "jobs.createdAt": 0,
        "jobs.updatedAt": 0,
        "jobs.__v": 0,
      },
    },
  ]);
  res.status(200).json({ success: true, data: company });
};
