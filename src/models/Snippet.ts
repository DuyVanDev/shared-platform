import mongoose, { Schema, model, models } from "mongoose";
import User from "./User";

const SnippetSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // for shareable URL
    code: { type: String, required: true },
    programmingLanguage: { type: String, required: true },
    topics: [{ type: String }], // e.g. ["algorithm","array"]
    description: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: true },
    timeComplexity: { type: String }, // e.g. "O(n)", "O(n^2)" (estimated)
  },
  { timestamps: true }
);

// indexes for faster searching
SnippetSchema.index({ slug: 1 });
SnippetSchema.index({ programmingLanguage: 1 });
SnippetSchema.index({ topics: 1 });
SnippetSchema.index({ title: "text", description: "text", code: "text" });

export default models.Snippet || model("Snippet", SnippetSchema);
