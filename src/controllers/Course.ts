import { Request, Response } from "express";
import { Course, CourseSchemaType } from "../models/Course.js";
import { Category } from "../models/Category.js";
import { User, UserSchemaType } from "../models/User.js";

import { FileType, uploadImageToCloudinary } from "../utils/imageUploader.js";
import chalk from "chalk";
import { JwtPayload } from "jsonwebtoken";
import { UploadApiResponse } from "cloudinary";

export interface CustomRequest extends Request {
  user: JwtPayload;
}

type CreateCourseFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// createCourse
export const createCourse: CreateCourseFunctionType = async (req, res) => {
  try {
    // fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files?.thumbnailImage as FileType;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails: UserSchemaType | null = await User.findById(
      userId,
      {
        accountType: "instructor",
      }
    ).exec();
    console.log("instructorDetails: ", instructorDetails);

    // TODO: verify userId and instructorDetails._id are same or not

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given tag
    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage: UploadApiResponse | null =
      await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME || "rohit"
      );

    if (!thumbnailImage) {
      return res.status(403).json({
        success: false,
        message: "Could not upload thumbnail, please try again",
      });
    }

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // add course to schema of instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    ).exec();

    // update the tag schema
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    ).exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// showAllCourses
export const showAllCourses: CreateCourseFunctionType = async (req, res) => {
  try {
    const allCourses: CourseSchemaType[] | null = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    if (allCourses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Courses db empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Courses data fetched successfully",
      data: allCourses,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
