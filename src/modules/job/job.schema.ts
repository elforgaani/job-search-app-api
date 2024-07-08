import Joi from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";
import * as ValidationRules from "../../utils/validation-rules.utils";

export const addJob: ValidationSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string()
      .required()
      .valid(...["onsite", "remotely", "hybrid"]),
    seniorityLevel: Joi.string()
      .required()
      .valid(...["junior", "mid-level", "senior", "team-lead", "cto"]),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string().required()).required(),
    softSkills: Joi.array().items(Joi.string().required()).required(),
    addedBy: Joi.string().custom(ValidationRules.objectIdRule).required(),
  }),
};
