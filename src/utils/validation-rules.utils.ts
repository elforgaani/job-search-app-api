import { Types } from "mongoose"

export const objectIdRule = (value: string, helper: any) => {
    const isValidValue = Types.ObjectId.isValid(value);
    return isValidValue ? value : helper.message('Invalid Id');
}