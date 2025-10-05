import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);