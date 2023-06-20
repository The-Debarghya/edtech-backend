import { Section } from "../models/Section.js";
import { Course } from "../models/Course.js";
import chalk from "chalk";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

type CreateSectionFunctionType = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// createSection
export const createSection: CreateSectionFunctionType = async (req, res) => {
  try {
    // fetch data
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(404).json({
        success: false,
        message: "Missing properties",
      });
    }

    // create section
    const newSection = await Section.create({
      sectionName,
    });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// updateSection
export const updateSection: CreateSectionFunctionType = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "Missing properties",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    return res.status(200).json({
      success: false,
      message: "Section Name updated successfully",
      data: section,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// deleteSection
export const deleteSection: CreateSectionFunctionType = async (req, res) => {
  try {
    // get Id - sending id in params
    const { sectionId } = req.params;

    // find and delete
    await Section.findByIdAndDelete(sectionId);
    // TODO: delete from course in which it is present

    return res.status(200).json({
      success: false,
      message: "Section deleted successfully",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
