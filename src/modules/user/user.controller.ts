import { Request, Response, NextFunction } from "express";
import { sendEmailService } from "../../services/send-email.service";
import { EmailContent } from "../../interfaces/EmailContent";
import { getRandomNumber } from "../../utils/random-number.utils";
import Otp from "../../database/models/otp.model";
import User from "../../database/models/user.model";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../../interfaces/CustomError";

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
  console.log(isOtpValid.otp);
  console.log(otp);


  if (!isOtpValid) {
    return res
      .status(400)
      .json({ success: false, message: "Otp Expired, get a new one." });
  }

  if (!(parseInt(isOtpValid?.otp) == otp)) {
    console.log('from condition' + (parseInt(isOtpValid?.otp) === otp))

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
    return next(new CustomError(false, 404, "User Doesn't Exist"));
  }
  const isOtpExist = await Otp.findOne({ email });
  if (isOtpExist) {
    return next(new CustomError(false, 400, "You Can't resend Otp, Wait Some time."));
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
    return next(new CustomError(false, 400, "Error While Sending OTP to Email"));
  }
  await Otp.create({ email, otp });
  res.status(200).json({
    success: true,
    message: "Otp has been sent Successfully.",
  });
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, mobileNumber, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (!user) {
    return next(new CustomError(false, 404, "User Doesn't Exist"));
  }
  const isRightPassword = compareSync(password, user.password);
  if (!isRightPassword) {
    return next(new CustomError(false, 404, "Wrong Sign In Credentials"))
  }
  if (!user?.isConfirmed) {
    return next(new CustomError(false, 400, "Please Cofirm Your Email First"));
  }
  await User.findByIdAndUpdate(user._id, { status: 'online' });

  const userDate = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(userDate, process.env.JWT_SECRET || "", {
    expiresIn: "7d",
  });

  res
    .status(200)
    .json({ success: true, message: "User Signed In Successfully", token });
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {

}