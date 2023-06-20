import { Request, Response } from "express";
import { User, UserSchemaType } from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import chalk from "chalk";
import bcrypt from "bcrypt";
import crypto from "crypto";

type ResetPasswordTokenFunctionType = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// resetPasswordToken
export const resetPasswordToken: ResetPasswordTokenFunctionType = async (
  req,
  res
) => {
  try {
    const email = req.body.email;

    const user: UserSchemaType | null = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomBytes(20).toString("hex");

    // save token to db
    const updateDetails: UserSchemaType | null = await User.findOneAndUpdate(
      { email },
      { token, resetPasswordExpires: Date.now() + 3600000 },
      { new: true }
    );

    // create url
    const url = `http://localhost:30000/update-password/${token}`;

    // send email
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, please check email to change password",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// resetPassword
export const resetPassword: ResetPasswordTokenFunctionType = async (
  req,
  res
) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // validate
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // find user from token
    const user: UserSchemaType | null = await User.findOne({ token }).exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // token time check
    if (user.resetPasswordExpires.getTime() < new Date(Date.now()).getTime()) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // else hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // then save the updated password to db
    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
