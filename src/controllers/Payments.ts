import chalk from "chalk";
import { razorpayInstance } from "../config/razorpay.js";
import { Course, CourseSchemaType } from "../models/Course.js";
import { User } from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import crypto, { Hmac } from "crypto";
import { CustomRequest } from "../middlewares/auth.js";

type CapturePaymentFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// capture payment and initiate razorpay order
export const capturePayment: CapturePaymentFunctionType = async (req, res) => {
  try {
    // fetch userId and courseId
    const { course_id } = req.body;

    const userId = req.user?.id;

    // validate
    if (!course_id) {
      return res.status(404).json({
        success: false,
        message: "Please provide a course id",
      });
    }

    // check in db
    let courseDetails;
    try {
      const course: CourseSchemaType | null = await Course.findById(
        course_id
      ).exec();
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Could not find a course with this id",
        });
      }

      // user already bought
      const userIdObject = new mongoose.Schema.Types.ObjectId(userId);

      if (course.studentsEnrolled.includes(userIdObject)) {
        return res.status(200).json({
          success: true,
          message: "Student is already is already enrolled with this course",
        });
      }

      // else user has to buy it
      courseDetails = course;
    } catch (e: any) {
      console.error(chalk.red.bold(e.message));
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }

    // create order for user
    const amount = courseDetails.price || 4999;
    const currency: string = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Date.now().toString() + (Math.random() * 100).toString(),
      notes: {
        courseId: course_id,
        userId,
      },
    };

    // call
    try {
      // initiate
      const paymentResponse = await razorpayInstance.orders.create(options);
      console.log(chalk.green.bold(paymentResponse));
      return res.status(200).json({
        success: true,
        couseName: courseDetails.courseName,
        courseDescription: courseDetails.courseDescription,
        thumbnail: courseDetails.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
        message: "Student is successfylly enrolled with this course",
      });
    } catch (e: any) {
      console.error(chalk.red.bold(e.message));
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// verifySignature of razorpay and server
export const verifySignature: CapturePaymentFunctionType = async (req, res) => {
  try {
    const webhooksecret = "rohitsadhu";

    const signature: string = req.headers["x-razorpay-signature"] as string;

    // create hashed digest
    const shaSum: Hmac = crypto.createHmac("sha256", webhooksecret);
    shaSum.update(JSON.stringify(req.body));

    const digest: string = shaSum.digest("hex");

    // match
    if (signature === digest) {
      console.log(chalk.green.bold("Payment is authorized"));

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        // find the couse and enroll the student
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: true }
        );

        if (!enrolledCourse) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          });
        }
        console.log(enrolledCourse);

        // find student and put course in it
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              courses: courseId,
            },
          },
          { new: true }
        );
        if (!enrolledStudent) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }
        console.log(enrolledStudent);

        // send email
        const emailResponse = await mailSender(
          enrolledStudent?.email,
          "Congratulations: ",
          "Congratulations you are onboarded into new course"
        );

        // return response
        return res.status(200).json({
          success: true,
          message: "Signature verified",
        });
      } catch (e: any) {
        console.error(chalk.red.bold(e.message));
        return res.status(500).json({
          success: false,
          message: e.message,
        });
      }
    } else {
      // return response
      return res.status(400).json({
        success: true,
        message: "Invalid Request",
      });
    }
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
