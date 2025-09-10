import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    images: [
      {
        type: String,
        trim: true,
        validate: {
          validator: (v) => v.match(/^https?:\/\/.*\.(jpeg|jpg|png|webp)$/i),
          message: "Image must be a valid URL ending with jpeg, jpg, png, or webp",
        },
      },
    ],
    sku: {
      type: String,
      unique: true,
      required: [true, "SKU is required"],
      uppercase: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be either active or inactive",
      },
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
