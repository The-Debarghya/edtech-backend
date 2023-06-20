import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface ProfileSchemaType extends Document {
    _id: mongoose.Schema.Types.ObjectId,
    gender: string,
    dateOfBirth: string,
    about: string,
    contactNumber: number,
}

const profileSchema = new Schema<ProfileSchemaType>({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
});

export const Profile: Model<ProfileSchemaType> = model<ProfileSchemaType>("Profile", profileSchema);
