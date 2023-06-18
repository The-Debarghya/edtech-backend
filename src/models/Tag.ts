import mongoose, { Schema, model } from "mongoose";

export interface TagSchemaType {
    name: string,
    description: string,
    course: mongoose.Schema.Types.ObjectId,
}

const tagSchema = new Schema<TagSchemaType>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
});

export const Tag = model<TagSchemaType>("Tag", tagSchema);
