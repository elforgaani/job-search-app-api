import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: true,
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["junior", "mid-level", "senior", "team-lead", "cto"],
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
