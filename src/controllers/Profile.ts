import chalk from "chalk";
import { Profile, ProfileSchemaType } from "../models/Profile.js";
import { User, UserSchemaType } from "../models/User.js";
import { Request, Response } from "express";
import { CustomRequest } from "./Course.js";

type UpdateProfileFunctionType = (
  req: CustomRequest,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// updateProfile
export const updateProfile: UpdateProfileFunctionType = async (req, res) => {
  try {
    // fetch data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    const userId = req.user.id;

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
      success: false,
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
    const userId = req.user.id;

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
      success: false,
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
    const userId = req.user.id;

    // validate
    const userDetails: UserSchemaType | null = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: false,
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
