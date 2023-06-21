import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";

import { User } from "../models/User.js";
import { NextFunction, Request, Response } from "express";
import chalk from "chalk";

export interface CustomRequest extends Request {
  user?: JwtPayload;
}

type authMiddlewareType = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => void;
// auth
export const auth: authMiddlewareType = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    // token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not present",
      });
    }

    // verify the token
    try {
      const decode: JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET || "rohit"
      ) as JwtPayload;
      console.log(decode);
      req.user = decode;
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// isStudent
type IsRoleMiddlewareType = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | undefined>;

export const isStudent: IsRoleMiddlewareType = async (req, res, next) => {
  try {
    if (req.user?.accountType !== "student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students only",
      });
    }
    next();
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// isInstructor
export const isInstructor: IsRoleMiddlewareType = async (req, res, next) => {
  try {
    if (req.user?.accountType !== "instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructors only",
      });
    }
    next();
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// isAdmin
export const isAdmin: IsRoleMiddlewareType = async (req, res, next) => {
  try {
    if (req.user?.accountType !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin  only",
      });
    }
    next();
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
