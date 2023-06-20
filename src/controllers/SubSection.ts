import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Section.js";
import chalk from "chalk";
import { Request, Response } from "express";
import { FileType, uploadImageToCloudinary } from "../utils/imageUploader.js";

type CreateSubSectionFunctionType = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// createSubSection
export const createSubSection: CreateSubSectionFunctionType = async (
  req,
  res
) => {
  try {
    // fetch data from request body
    const { sectionId, title, description, timeDuration } = req.body;

    const video: FileType = req.files?.videoFile as FileType;

    if (!sectionId || !title || !description || !timeDuration) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadedDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME || "rohit"
    );

    // create sub section
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadedDetails.secure_url,
    });

    // update section with subsection
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSection._id,
        },
      },
      {
        new: true,
      }
    )
      .populate("subSection")
      .exec();

    console.log(updatedSection);

    // return response
    return res.status(500).json({
      success: true,
      message: "Sub section created successfully",
      updatedSection,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// TODO: updateSubSection

// TODO:deleteSubSection
