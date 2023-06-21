import {
  RatingAndReview,
  RatingAndReviewSchemaType,
} from "../models/RatingAndReview.js";
import { Course, CourseSchemaType } from "../models/Course.js";
import chalk from "chalk";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { CustomRequest } from "../middlewares/auth.js";

type CreateRatingFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// createRating
export const createRating: CreateRatingFunctionType = async (req, res) => {
  try {
    // fetch user id
    const { userId } = req.user?.id;

    const { rating, review, courseId } = req.body;

    // check if userId is enrolled or not
    const courseDetails: CourseSchemaType | null = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    }).exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // check if user already reviewed this course
    const alreadyReviewed: RatingAndReviewSchemaType | null =
      await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      }).exec();

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Student already reviewed this course",
      });
    }

    // create a review
    const reviewResponse: RatingAndReviewSchemaType | null =
      await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId,
      });

    if (!reviewResponse) {
      return res.status(403).json({
        success: false,
        message: "Unable to register review",
      });
    }

    // update the review in course schema
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: reviewResponse._id,
        },
      },
      { new: true }
    ).exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: reviewResponse,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getAverageRating
export const getAverageRating: CreateRatingFunctionType = async (req, res) => {
  try {
    // fetch courseId
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Schema.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      // return response
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
        message: "Rating fetched successfully",
      });
    }
    return res.status(200).json({
      success: true,
      averageRating: 0,
      message: "Rating does not exist",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getAllRatingAndReviews
export const getAllRatingAndReviews: CreateRatingFunctionType = async (
  req,
  res
) => {
  try {
    const allRatingAndReviews: RatingAndReviewSchemaType[] | null =
      await RatingAndReview.find({})
        .sort({ rating: "desc" })
        .populate({
          path: "user",
          select: "firstName lastName email, image",
        })
        .populate({
          path: "course",
          select: "courseName",
        })
        .exec();
    if (!allRatingAndReviews || allRatingAndReviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allRatingAndReviews,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
