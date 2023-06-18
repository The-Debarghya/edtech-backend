import mongoose, { Schema, model } from "mongoose";

export interface UserSchemaType {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: string;
    additionalDetails: mongoose.Schema.Types.ObjectId;
    courses: mongoose.Schema.Types.ObjectId[];
    image: string;
    courseProgress: mongoose.Schema.Types.ObjectId[];
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
});

export const User = model<UserSchemaType>("User", userSchema);
