import Joi from "joi";
import { ValidationSchema } from "../../interfaces/ValidationSchema";
import * as ValidationRules from '../../utils/validation-rules.utils'
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
            zip: Joi.string().optional()
        }).optional(),
        numberOfEmployees: Joi.string().required().valid(...['10-20', '21-50', '51-100', '100-200', '200-500', '500-1000', '+100']),
        companyEmail: Joi.string().email().required(),
        companyHr: Joi.string().custom(ValidationRules.objectIdRule),
    })
}