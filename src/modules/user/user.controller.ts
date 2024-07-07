import { Request, Response, NextFunction } from "express";
import { sendEmailService } from "../../services/send-email.service";
import { EmailContent } from "../../interfaces/EmailContent";
import { getRandomNumber } from "../../utils/random-number.utils";
import Otp from "../../database/models/otp.model";
import User from "../../database/models/user.model";
import { hashSync } from "bcrypt";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    dob,
    mobileNumber,
    role,
    status,
  } = req.body;

  const userName: string = `${firstName}${lastName}${Math.round(
    Math.random() * 10
  )}`;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res
      .status(409)
      .json({ success: false, message: "User Already Exist" });
  }
  const user = {
    firstName,
    lastName,
    userName,
    email,
    password,
    recoveryEmail,
    dob,
    mobileNumber,
    role,
    status,
  };
  const otp = getRandomNumber();

  const emailContent: EmailContent = {
    from: "No-Reply <elforgaani@gmail.com>",
    to: email,
    subject: "Confirm Your Account",
    html: `<h1>Your Otp is ${otp}</h1>`,
  };
  const emailResult = await sendEmailService(emailContent);
  console.log(emailResult.rejected);

  if (!emailResult?.accepted) {
    return res
      .status(400)
      .json({ success: false, message: "Error While Sending OTP to Email" });
  }
  await Otp.create({ email, otp });
  const hashedPassword = hashSync(
    password,
    parseInt(process.env.SALT_ROUNDS || "")
  );
  user.password = hashedPassword;
  await User.create(user);
  res.status(200).json({
    success: true,
    message: "User Registered Successfully, Please Confirm your email.",
  });
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    return res
      .status(404)
      .json({ success: false, message: "User is Not Exist" });
  }
  // Todo:Remove User Already Confirmed, in case of using the same endpoint in other processess
  if (isUserExist.isConfirmed) {
    return res
      .status(400)
      .json({ success: false, message: "User Already Confirmed" });
  }
  const isOtpValid = await Otp.findOne({ email });
  if (!isOtpValid) {
    return res
      .status(400)
      .json({ success: false, message: "Otp Expired, get a new one." });
  }

  if (!(parseInt(isOtpValid?.otp) === otp)) {
    return res
      .status(400)
      .json({ success: false, message: "Otp is Invalid, get a new one." });
  }
  await User.findOneAndUpdate({ email }, { isConfirmed: true });
  res
    .status(200)
    .json({ sucess: true, message: "Email Confirmed Successfully" });
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    return res
      .status(404)
      .json({ success: false, message: "User is Not Exist" });
  }
  const isOtpExist = await Otp.findOne({ email });
  if (isOtpExist) {
    return res.status(400).json({
      success: false,
      message: "You Can't resend Otp, Wait Some time.",
    });
  }
  const otp = getRandomNumber();
  const emailContent: EmailContent = {
    from: "No-Reply <elforgaani@gmail.com>",
    to: email,
    subject: "Confirm Your Account",
    html: `<h1>Your Otp is ${otp}</h1>`,
  };
  const emailResult = await sendEmailService(emailContent);
  if (!emailResult?.accepted) {
    return res
      .status(400)
      .json({ success: false, message: "Error While Sending OTP to Email" });
  }
  await Otp.create({ email, otp });
  res.status(200).json({
    success: true,
    message: "Otp has been sent Successfully.",
  });
};
