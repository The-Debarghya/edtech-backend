import mongoose, { Schema, model } from "mongoose";

export interface ProfileSchemaType {
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

export const Profile = model<ProfileSchemaType>("Profile", profileSchema);
