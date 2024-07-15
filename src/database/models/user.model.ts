import mongoose from "mongoose";
import { roleEnum, statusEnum } from "../../utils/constants";

const { Schema, model } = mongoose;

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: roleEnum,
      default: "user",
    },
    status: {
      type: String,
      enum: statusEnum,
      default: "offline",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || model("User", schema);
