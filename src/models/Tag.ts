import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface TagSchemaType extends Document {
    _id: mongoose.Schema.Types.ObjectId,
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

export const Tag: Model<TagSchemaType> = model<TagSchemaType>("Tag", tagSchema);
