import mongoose, { Schema, model } from "mongoose";

export interface CourseProgressSchemaType {
    courseID: mongoose.Schema.Types.ObjectId,
    completedVideos: mongoose.Schema.Types.ObjectId,
}

const courseProgressSchema = new Schema<CourseProgressSchemaType>({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection"
    }
});

export const CourseProgress = model<CourseProgressSchemaType>("CourseProgress", courseProgressSchema);
