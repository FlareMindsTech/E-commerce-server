import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    product_variant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ProductVariant", 
      required: true 
    }
  },
  { timestamps: true }  
);

export default mongoose.model("Wishlist", wishlistSchema);
