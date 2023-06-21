import { SubSection, SubSectionSchemaType } from "../models/SubSection.js";
import { Section } from "../models/Section.js";
import chalk from "chalk";
import { Request, Response } from "express";
import { FileType, uploadImageToCloudinary } from "../utils/imageUploader.js";
import { CustomRequest } from "../middlewares/auth.js";

type CreateSubSectionFunctionType = (
  req: CustomRequest,
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
    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
      data: updatedSection,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// updateSubSection
export const updateSubSection: CreateSubSectionFunctionType = async (
  req,
  res
) => {
  try {
    const { sectionId, title, description } = req.body;
    const subSection: SubSectionSchemaType | null = await SubSection.findById(
      sectionId
    ).exec();

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video as FileType;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME || "rohit"
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// deleteSubSection
export const deleteSubSection: CreateSubSectionFunctionType = async (
  req,
  res
) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    ).exec();

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    }).exec();

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // return response
    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
