import { NextFunction, Request, Response } from "express";
import Industry from "../../database/models/industry.model";
import { CustomError } from "../../interfaces/CustomError";
import Company from "../../database/models/company.model";

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
  console.log(industry);
  console.log(isIndustryExist);

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
