import mongoose, { Schema, model } from "mongoose";

export interface CourseSchemaType {
    courseName: string,
    courseDescription: string,
    instructor: mongoose.Schema.Types.ObjectId,
    whatYouWillLearn: string,
    courseContent: mongoose.Schema.Types.ObjectId[],
    ratingAndReviews: mongoose.Schema.Types.ObjectId[],
    price: number,
    thumbnail: string,
    tag: mongoose.Schema.Types.ObjectId,
    studentsEnrolled: mongoose.Schema.Types.ObjectId[],
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
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
});

export const Course = model<CourseSchemaType>("Course", courseSchema);
