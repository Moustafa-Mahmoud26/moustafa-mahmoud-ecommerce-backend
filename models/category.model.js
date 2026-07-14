import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

CategorySchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
  }
});

export default model("Category", CategorySchema, "categories");