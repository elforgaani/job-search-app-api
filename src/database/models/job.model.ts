import mongoose from "mongoose";
import {
  jobLocationEnum,
  seniorityLevelEnum,
  workingTimeEnum,
} from "../../utils/constants";

const { Schema, model } = mongoose;

const schema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: jobLocationEnum,
      required: true,
    },
    workingTime: {
      type: String,
      enum: workingTimeEnum,
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: seniorityLevelEnum,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || model("Job", schema);
