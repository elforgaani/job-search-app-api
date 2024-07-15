import Joi from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";
import * as ValidationRules from "../../utils/validation-rules.utils";
import {
  jobLocationEnum,
  seniorityLevelEnum,
  workingTimeEnum,
} from "../../utils/constants";

export const addJob: ValidationSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string()
      .required()
      .valid(...jobLocationEnum),
    workingTime: Joi.string()
      .required()
      .valid(...workingTimeEnum),
    seniorityLevel: Joi.string()
      .required()
      .valid(...seniorityLevelEnum),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string().required()).required(),
    softSkills: Joi.array().items(Joi.string().required()).required(),
  }),
};

export const updateJob: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().required().custom(ValidationRules.objectIdRule),
  }),
  body: Joi.object({
    jobTitle: Joi.string().optional(),
    jobLocation: Joi.string()
      .optional()
      .valid(...jobLocationEnum),
    workingTime: Joi.string()
      .optional()
      .valid(...workingTimeEnum),
    seniorityLevel: Joi.string()
      .optional()
      .valid(...seniorityLevelEnum),
    jobDescription: Joi.string().optional(),
    technicalSkills: Joi.array().items(Joi.string().optional()).optional(),
    softSkills: Joi.array().items(Joi.string().optional()).optional(),
  }).or(
    "jobTitle",
    "jobLocation",
    "workingTime",
    "seniorityLevel",
    "jobDescription",
    "technicalSkills",
    "softSkills"
  ),
};

export const deleteJob: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().required().custom(ValidationRules.objectIdRule),
  }),
};

export const getJobsWithCompanyName: ValidationSchema = {
  query: Joi.object({
    name: Joi.string().required().min(3).max(20),
  }),
};

export const getJobWithFilters: ValidationSchema = {
  query: Joi.object({
    jobTitle: Joi.string().optional(),
    jobLocation: Joi.string()
      .optional()
      .valid(...jobLocationEnum),
    workingTime: Joi.string()
      .optional()
      .valid(...workingTimeEnum),
    seniorityLevel: Joi.string()
      .optional()
      .valid(...seniorityLevelEnum),
    technicalSkills: Joi.string().optional(),
  }).or(
    "jobTitle",
    "jobLocation",
    "workingTime",
    "seniorityLevel",
    "jobDescription",
    "technicalSkills"
  ),
};

export const applyToJob: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().required().custom(ValidationRules.objectIdRule),
  }),
  body: Joi.object({
    userTechSkills: Joi.array().required().items(Joi.string().required()),
    userSoftSkills: Joi.array().required().items(Joi.string().required()),
  }),
};
