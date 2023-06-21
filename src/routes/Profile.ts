import express, { Router } from "express";

import { auth } from "../middlewares/auth.js";
import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} from "../controllers/Profile.js";

const profileRouter: Router = Router();
// ***************************************************************************************
//                                      Profile routes
// ***************************************************************************************
// Delet User Account
profileRouter.delete("/deleteProfile", auth, deleteAccount);
profileRouter.put("/updateProfile", auth, updateProfile);
profileRouter.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses
profileRouter.get("/getEnrolledCourses", auth, getEnrolledCourses);
profileRouter.put("/updateDisplayPicture", auth, updateDisplayPicture);

export default profileRouter;
