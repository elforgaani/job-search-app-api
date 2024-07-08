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
    role: user.role
  };
  const token = jwt.sign(userDate, process.env.JWT_SECRET || "", {
    expiresIn: "7d",
  });

  res
    .status(200)
    .json({ success: true, message: "User Signed In Successfully", token });
};

export const generateOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { email } = user;
  const isOtpExist = await Otp.findOne({ email })
  if (isOtpExist) {
    return next(new CustomError(false, 400, "You Can't resend Otp, Wait Some time."));
  }
  const otp = getRandomNumber();

  const emailContent: EmailContent = {
    from: "No-Reply <elforgaani@gmail.com>",
    to: email,
    subject: "Your Otp",
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
}

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  // User must generate OTP using '/generate-otp', then use it to update their account,
  // The email that used to generate otp should be the same email used in here.
  const { user } = req;
  const { email, mobileNumber, recoveryEmail, dob, firstName, lastName, otp } = req.body;
  if (email || mobileNumber) {
    const isDuplicated = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (isDuplicated) {
      return next(new CustomError(false, 409, "Email or Phone Number are duplicated."));
    }
    const isOtpExist = await Otp.findOne({ email, otp });
    if (!isOtpExist) {
      return next(new CustomError(false, 400, "OTP is Invalid"));
    }
  }
  const updatedUser = await User.findByIdAndUpdate(user.id, { email, mobileNumber, recoveryEmail, dob, firstName, lastName }, { new: true },).select('email mobileNumber recoveryEmail dob firstName lastName');
  res.status(200).json({ success: true, message: "User Updated successfully", data: updatedUser });
}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const result = await User.findByIdAndDelete(user.id);
  res.status(200).json({ success: true, message: "User Deleted Successfully." });
}

export const getAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  const result = await User.findById(user.id).select('firstName lastName userName email recoveryEmail dob role status');
  res.status(200).json({ success: true, data: result });
}


export const specificAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await User.findById(id).select('firstName lastName userName email recoveryEmail dob role status');
  if (!user) {
    return next(new CustomError(false, 404, "User Doesn't Exist"));
  }
  res.status(200).json({ success: false, data: user });
}

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { password, newPassword } = req.body;
  const { password: currentPassword } = await User.findById(user.id).select('password');
  const isRightPassword = compareSync(password, currentPassword);
  if (!isRightPassword) {
    return next(new CustomError(false, 401, "Password is Incorrect"));
  }
  const newHashedPassword = hashSync(newPassword, parseInt(process.env.SALT_ROUNDS || ""));
  await User.findByIdAndUpdate(user.id, { password: newHashedPassword });
  res.status(200).json({ success: true, message: "Password Updated Successfully." });
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => { }

export const accountsWithRecoveryEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  const accounts = await User.find({ recoveryEmail: email }).select('email');
  res.status(200).json({ success: true, data: accounts });

}