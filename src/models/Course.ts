import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface CourseSchemaType extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  courseName: string;
  courseDescription: string;
  instructor: mongoose.Schema.Types.ObjectId;
  whatYouWillLearn: string;
  courseContent: mongoose.Schema.Types.ObjectId[];
  ratingAndReviews: mongoose.Schema.Types.ObjectId[];
  price: number;
  thumbnail: string;
  category: mongoose.Schema.Types.ObjectId;
  tag: string[];
  studentsEnrolled: mongoose.Schema.Types.ObjectId[];
  instructions: string[];
  status: string;
}

const courseSchema = new Schema<CourseSchemaType>({
  courseName: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tag: {
    type: [String],
    required: true,
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
});

export const Course: Model<CourseSchemaType> = model<CourseSchemaType>(
  "Course",
  courseSchema
);
