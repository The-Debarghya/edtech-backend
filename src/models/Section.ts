import mongoose, { Schema, model } from "mongoose";

export interface SectionSchemaType {
    sectionName: string,
    subSection: mongoose.Schema.Types.ObjectId[],
}

const sectionSchema = new Schema<SectionSchemaType>({
    sectionName: {
        type: String,
    },
    subSection: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection"
    }]
});

export const Section = model<SectionSchemaType>("Section", sectionSchema);
