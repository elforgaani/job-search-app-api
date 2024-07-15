import mongoose from "mongoose";
import { numberOfEmployeesEnum } from "../../utils/constants";

const { Schema, model } = mongoose;

const schema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: Schema.Types.ObjectId,
    ref: "Industry",
  },
  address: {
    long: String,
    lat: String,
    conutry: String,
    city: String,
    zip: String,
  },
  numberOfEmployees: {
    type: String,
    enum: numberOfEmployeesEnum,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
  },
  companyHr: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.models.Company || model("Company", schema);
