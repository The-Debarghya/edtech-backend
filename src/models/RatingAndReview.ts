import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface RatingAndReviewSchemaType extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  review: string;
  course: mongoose.Schema.Types.ObjectId;
}

const ratingAndReviewSchema = new Schema<RatingAndReviewSchemaType>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
});

export const RatingAndReview: Model<RatingAndReviewSchemaType> =
  model<RatingAndReviewSchemaType>("RatingAndReview", ratingAndReviewSchema);
