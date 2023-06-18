import mongoose, { Schema, model } from "mongoose";

export interface SubSectionSchemaType {
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

export const SubSection = model<SubSectionSchemaType>("SubSection", subSectionSchema);
