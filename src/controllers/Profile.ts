import chalk from "chalk";
import { Profile, ProfileSchemaType } from "../models/Profile.js";
import { User, UserSchemaType } from "../models/User.js";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.js";
import { FileType, uploadImageToCloudinary } from "../utils/imageUploader.js";

type UpdateProfileFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// updateProfile
export const updateProfile: UpdateProfileFunctionType = async (req, res) => {
  try {
    // fetch data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    const userId = req.user?.id;

    // validate
    if (!contactNumber || !gender) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find profile
    const userDetails = await User.findById(userId);

    const profileId = userDetails?.additionalDetails;

    const profileDetails: ProfileSchemaType = (await Profile.findById(
      profileId
    )) as ProfileSchemaType;

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    // save profile
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Update profile successfully",
      profileDetails,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// deleteAccount
export const deleteAccount: UpdateProfileFunctionType = async (req, res) => {
  try {
    // get id
    const userId = req.user?.id;

    // validate
    const userDetails: UserSchemaType | null = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODO: unenroll user from all enrolled courses
    // also find how can we schedule deletion [cronjobs]

    // delete user
    await User.findByIdAndDelete(userId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Deleted account successfully",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getAllUsers

export const getAllUserDetails: UpdateProfileFunctionType = async (
  req,
  res
) => {
  try {
    // fetch data
    const userId = req.user?.id;

    // validate
    const userDetails: UserSchemaType | null = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      data: userDetails,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// updateDisplayPicture
export const updateDisplayPicture: UpdateProfileFunctionType = async (
  req,
  res
) => {
  try {
    const displayPicture: FileType | FileType[] | undefined =
      req.files?.displayPicture;
    if (!displayPicture || displayPicture) {
      return res.status(404).json({
        success: false,
        message: "File not provided",
      });
    }
    const userId = req.user?.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME || "rohit",
      1000,
      100
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getEnrolledCourses
export const getEnrolledCourses: UpdateProfileFunctionType = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;
    const userDetails: UserSchemaType | null = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: `Fetched enrolled courses successfully`,
      data: userDetails.courses,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
