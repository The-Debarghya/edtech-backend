import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface UserSchemaType extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
  additionalDetails: mongoose.Schema.Types.ObjectId;
  courses: mongoose.Schema.Types.ObjectId[];
  image: string;
  courseProgress: mongoose.Schema.Types.ObjectId[];
  token: string;
  resetPasswordExpires: Date;
}

const userSchema = new Schema<UserSchemaType>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "student", "instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: mongoose.Schema.Types.Date,
  },
});

export const User: Model<UserSchemaType> = model<UserSchemaType>(
  "User",
  userSchema
);
