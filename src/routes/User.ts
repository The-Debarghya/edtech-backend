import express, { Router } from "express";

// Import controllers and middleware functions
import { login, signUp, sendOtp, changePassword } from "../controllers/Auth.js";
import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword.js";
import { auth } from "../middlewares/auth.js";

const userRouter: Router = Router();

// Routes for Login, Signup, and Authentication

// ***************************************************************************************
//                                      Authentication routes
// ***************************************************************************************

// Route for user login
userRouter.post("/login", login);

// Route for user signup
userRouter.post("/signup", signUp);

// Route for sending OTP to the user's email
userRouter.post("/sendotp", sendOtp);

// Route for Changing the password
userRouter.post("/changepassword", auth, changePassword);

// ***************************************************************************************
//                                      Reset Password
// ***************************************************************************************

// Route for generating a reset password token
userRouter.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
userRouter.post("/reset-password", resetPassword);

export default userRouter;
