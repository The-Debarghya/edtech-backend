import mongoose, { Schema, model } from "mongoose";

export interface RatingAndReviewSchemaType {
    user: mongoose.Schema.Types.ObjectId,
    rating: number,
    review: string
}

const ratingAndReviewSchema = new Schema<RatingAndReviewSchemaType>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    }
});

export const RatingAndReview = model<RatingAndReviewSchemaType>("RatingAndReview", ratingAndReviewSchema);
