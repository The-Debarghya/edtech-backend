// Import the modules
import express, { Router } from "express";

// Course Controllers Import
import {
  createCourse,
  showAllCourses,
  getCourseDetails,
} from "../controllers/Course.js";

// Categories Controllers Import
import {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} from "../controllers/Category.js";

// Sections Controllers Import
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.js";

// Sub-Sections Controllers Import
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/SubSection.js";

// Rating Controllers Import
import {
  createRating,
  getAverageRating,
  getAllRatingAndReviews,
} from "../controllers/RatingAndReview.js";

// Importing Middlewares
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

const courseRouter: Router = Router();

// ***************************************************************************************
//                                      Course routes
// ***************************************************************************************

// Courses can Only be Created by Instructors
courseRouter.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
courseRouter.post("/addSection", auth, isInstructor, createSection);
// Update a Section
courseRouter.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
courseRouter.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
courseRouter.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
courseRouter.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
courseRouter.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
courseRouter.get("/getAllCourses", showAllCourses);
// Get Details for a Specific Courses
courseRouter.post("/getCourseDetails", getCourseDetails);

// ***************************************************************************************
//                                      Category routes (Only by Admin)
// ***************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
courseRouter.post("/createCategory", auth, isAdmin, createCategory);
courseRouter.get("/showAllCategories", showAllCategories);
courseRouter.post("/getCategoryPageDetails", categoryPageDetails);

// ***************************************************************************************
//                                      Rating and Review
// ***************************************************************************************
courseRouter.post("/createRating", auth, isStudent, createRating);
courseRouter.get("/getAverageRating", getAverageRating);
courseRouter.get("/getReviews", getAllRatingAndReviews);

export default courseRouter;
