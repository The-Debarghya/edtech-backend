import express, { Router } from "express";

import { auth } from "../middlewares/auth.js";
import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} from "../controllers/Profile.js";

const router: Router = Router();
// ***************************************************************************************
//                                      Profile routes
// ***************************************************************************************
// Delet User Account
router.delete("/deleteProfile", deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

export default router;
