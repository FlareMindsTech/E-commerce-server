import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User is required"],
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid user ID"
      }
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: [true, "Product is required"],
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid product ID"
      }
    }
  },
  { timestamps: true }
);

// Prevent duplicate wishlist entries for the same user & product
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
