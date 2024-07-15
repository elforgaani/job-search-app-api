import Joi from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";
import * as ValidationRules from "../../utils/validation-rules.utils";
import { numberOfEmployeesEnum } from "../../utils/constants";
export const addCompany: ValidationSchema = {
  body: Joi.object({
    companyName: Joi.string().required().min(3).max(30),
    description: Joi.string().required().min(10).max(200),
    industry: Joi.string().required().custom(ValidationRules.objectIdRule),
    address: Joi.object({
      long: Joi.string().optional(),
      lat: Joi.string().optional(),
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      zip: Joi.string().optional(),
    }).optional(),
    numberOfEmployees: Joi.string()
      .required()
      .valid(...numberOfEmployeesEnum),
    companyEmail: Joi.string().email().required(),
  }),
};
export const updateCompany: ValidationSchema = {
  body: Joi.object({
    companyName: Joi.string().optional().min(3).max(30),
    description: Joi.string().optional().min(10).max(200),
    industry: Joi.string().optional().custom(ValidationRules.objectIdRule),
    address: Joi.object({
      long: Joi.string().optional(),
      lat: Joi.string().optional(),
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      zip: Joi.string().optional(),
    }).optional(),
    numberOfEmployees: Joi.string()
      .optional()
      .valid(...numberOfEmployeesEnum),
    companyEmail: Joi.string().email().optional(),
  }).or(
    "companyName",
    "description",
    "industry",
    " address",
    " numberOfEmployees",
    "companyEmail"
  ),
};

export const searchCompany: ValidationSchema = {
  params: Joi.object({
    name: Joi.string().required().min(3).max(30),
  }),
};

export const getCompanyData: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().required().custom(ValidationRules.objectIdRule),
  }),
};

export const getJobApplications: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().required().custom(ValidationRules.objectIdRule),
  }),
};
