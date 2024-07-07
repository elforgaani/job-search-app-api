import Joi from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";

export const signUpUser: ValidationSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    // userName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    recoveryEmail: Joi.string().required().email(),
    dob: Joi.date().required(),
    mobileNumber: Joi.string().length(10),
    role: Joi.string().valid(...["user", "company_hr"]),
    status: Joi.string().valid(...["online", "offline"]),
  }),
};

export const verifyEmail: ValidationSchema = {
  body: Joi.object({
    otp: Joi.string().required().length(6),
    email: Joi.string().required().email(),
  }),
};

export const resendOtp: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
  }),
};
