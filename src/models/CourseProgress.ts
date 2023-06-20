import mongoose, { Document, Model, Models, Schema, model } from "mongoose";

export interface CourseProgressSchemaType extends Document {
    _id: mongoose.Schema.Types.ObjectId,
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

export const CourseProgress: Model<CourseProgressSchemaType> = model<CourseProgressSchemaType>("CourseProgress", courseProgressSchema);

