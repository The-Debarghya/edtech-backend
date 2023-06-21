import { User, UserSchemaType } from "../models/User.js";
import { Otp, OtpSchemaType } from "../models/Otp.js";
import { Request, Response } from "express";
import chalk from "chalk";
import otpGenerator from "otp-generator";
import { Profile, ProfileSchemaType } from "../models/Profile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Query } from "mongoose";
import { CustomRequest } from "./Course.js";
import { mailSender } from "../utils/mailSender.js";
import { passwordUpdateTemplate } from "../mail/templates/passwordUpdateTemplate.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

type SendOtpFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// sendOtp
export const sendOtp: SendOtpFunctionType = async (req, res) => {
  try {
    // fetch email
    const { email }: OtpSchemaType = req.body;

    // check for existence
    const checkUserPresent: UserSchemaType | null = await User.findOne({
      email,
    });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate otp
    const otp: string = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(chalk.yellow.bold(`otp generated: ${otp}`));

    /*
        TODO: remove this and put optimized code
        // check unique otp or not
        let result = await Otp.findOne({otp});

        while(result){
            const new_otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await Otp.findOne({otp: new_otp});
        }

        */

    const otpPayload: { email: string; otp: string } = { email, otp };

    // create entry in db
    const otpBody: OtpSchemaType | null = await Otp.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

type SignUpFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;
// signUp
export const signUp: SignUpFunctionType = async (
  req: Request,
  res: Response
) => {
  try {
    // fetch from body
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
    }: UserSchemaType = req.body;

    const { otp }: OtpSchemaType = req.body;

    const { contactNumber }: ProfileSchemaType = req.body;

    const confirmPassword: string = req.body.confirmPassword;

    // validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // check for existence
    const checkUserPresent: UserSchemaType | null = await User.findOne({
      email,
    }).exec();

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // find most recent otp for user
    const recentOtp: OtpSchemaType[] = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    console.log(chalk.yellow.bold(`recent otp: ${recentOtp}`));

    // validate otp
    if (recentOtp.length === 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Otp not matching",
      });
    }

    // hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // save to db
    let approved: any = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      contactNumber,
      approved: approved,
      additionalDetails: profileDetails._id,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

type LoginFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// login
export const login: LoginFunctionType = async (req, res) => {
  try {
    // fetch
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for existence
    const checkUserPresent: UserSchemaType | null = await User.findOne({
      email,
    })
      .populate("additionalDetails")
      .exec();

    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up",
      });
    }

    // match password and generate JWT
    if (await bcrypt.compare(password, checkUserPresent.password)) {
      const payload = {
        email: checkUserPresent.email,
        id: checkUserPresent._id,
        role: checkUserPresent.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "rohit", {
        expiresIn: "24h",
      });

      // Save token to user document in database
      // user.token = token;
      // user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        checkUserPresent,
        message: "Logged in successfully",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Password is incorrect",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

type ChangePasswordFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// changePassword
export const changePassword: ChangePasswordFunctionType = async (req, res) => {
  try {
    // fetch userId
    const userId = req.user.id;

    // Get user data from req.user
    const userDetails: UserSchemaType | null = await User.findById(userId);

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword: string = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails: UserSchemaType | null =
      await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      );

    if (!updatedUserDetails) {
      return res
        .status(403)
        .json({ success: false, message: "Updation of User failed" });
    }

    // Send notification email
    try {
      const emailResponse: SMTPTransport.SentMessageInfo | undefined =
        await mailSender(
          updatedUserDetails.email,
          "Success!!! Password changed successfully",
          passwordUpdateTemplate(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        );
      if (!emailResponse) {
        return res
          .status(400)
          .json({ success: false, message: "Email sending failed" });
      }
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error: any) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
