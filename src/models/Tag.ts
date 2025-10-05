import mongoose, { Schema, model, models } from "mongoose";

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export default models.Tag || model("Tag", TagSchema);
