import { User, UserSchemaType } from "../models/User.js";
import { Otp, OtpSchemaType } from "../models/Otp.js";
import { Request, Response } from "express";
import chalk from "chalk";
import otpGenerator from "otp-generator";
import { Profile, ProfileSchemaType } from "../models/Profile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Query } from "mongoose";

type SendOtpFunctionType = (
  req: Request,
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
  req: Request,
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
    });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // find most recent otp for user
    const recentOtp: OtpSchemaType[] = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
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
  req: Request,
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
        message: "User is not registered",
      });
    }

    // match password and generate JWT
    if (await bcrypt.compare(password, checkUserPresent.password)) {
      const payload = {
        email: checkUserPresent.email,
        id: checkUserPresent._id,
        accountType: checkUserPresent.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "rohit", {
        expiresIn: "2h",
      });

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
