import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface SectionSchemaType extends Document {
    _id: mongoose.Schema.Types.ObjectId,
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

export const Section: Model<SectionSchemaType> = model<SectionSchemaType>("Section", sectionSchema);
