import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
    enum: ["user", "company_hr"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
});

export default mongoose.models.user || model("User", schema);
