import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface SubSectionSchemaType extends Document {
    _id: mongoose.Schema.Types.ObjectId,
    title: string,
    timeDuration: string,
    description: string,
    videoUrl: string,
}

const subSectionSchema = new Schema<SubSectionSchemaType>({
    title: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
});

export const SubSection: Model<SubSectionSchemaType> = model<SubSectionSchemaType>("SubSection", subSectionSchema);
