import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Error While Connecting Database" + error);
  }
};
