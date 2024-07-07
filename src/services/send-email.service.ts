import nodemailer from "nodemailer";
import { EmailContent } from "../interfaces/EmailContent";
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASS,
  },
  service: "gmail",
});

export const sendEmailService = async (content: EmailContent) => {
  return await transporter.sendMail(content);
};
