import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // if you have a ProductVariant model, change this
      required: [true, "Product (variant) ID is required"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
      max: [10, "Quantity cannot exceed 10"], // ✅ optional business logic
    },
  },
  { timestamps: true }
);

// Prevent duplicate cart entries for same user + product
cartItemSchema.index({ user_id: 1, variant_id: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
