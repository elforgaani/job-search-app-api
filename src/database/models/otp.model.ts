import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },

  expireAt: { type: Date, default: Date.now, expires: 180 },
});

export default mongoose.models.Otp || model("Otp", schema);
