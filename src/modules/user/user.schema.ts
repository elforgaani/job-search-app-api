import Joi, { string } from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";
import * as ValidationRules from "../../utils/validation-rules.utils";
import { roleEnum, statusEnum } from "../../utils/constants";
export const signUpUser: ValidationSchema = {
  body: Joi.object({
    firstName: Joi.string().required().min(2).max(30),
    lastName: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    recoveryEmail: Joi.string().required().email(),
    dob: Joi.date().required(),
    mobileNumber: Joi.string().length(10),
    role: Joi.string().valid(...roleEnum),
    status: Joi.string().valid(...statusEnum),
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

export const signInUser: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().email(),
    mobileNumber: Joi.string().length(10),
    password: Joi.string().required().min(8).max(30),
  }).or("email", "mobileNumber"),
};

export const updateAccount: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().optional().email(),
    mobileNumber: Joi.string().optional().length(10),
    recoveryEmail: Joi.string().optional().email(),
    dob: Joi.date().optional(),
    firstName: Joi.string().optional().min(2).max(30),
    lastName: Joi.string().optional().min(2).max(30),
    otp: Joi.string().optional().length(6),
  })
    .or(
      "email",
      "mobileNumber",
      "recoveryEmail",
      "dob",
      "firstName",
      "lastName"
    )
    .and("email", "otp"),
};

export const generateOtp: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
  }),
};

export const specificAccount: ValidationSchema = {
  params: Joi.object({
    id: Joi.string().custom(ValidationRules.objectIdRule).required(),
  }),
};

export const updatePassword: ValidationSchema = {
  body: Joi.object({
    password: Joi.string().required().min(8).max(30),
    newPassword: Joi.string().required().min(8).max(30),
  }),
};

export const accountsWithRecoveryEmail: ValidationSchema = {
  params: Joi.object({
    email: Joi.string().required().email(),
  }),
};

export const forgetPassword: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    otp: Joi.string().required().length(6),
  }),
};
