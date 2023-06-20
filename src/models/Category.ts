import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface CategorySchemaType extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  courses: mongoose.Schema.Types.ObjectId[];
}

const categorySchema = new Schema<CategorySchemaType>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Category: Model<CategorySchemaType> = model<CategorySchemaType>(
  "Category",
  categorySchema
);
