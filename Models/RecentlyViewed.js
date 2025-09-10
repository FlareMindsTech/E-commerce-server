import mongoose from "mongoose";

const recentViewedSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    }
  },
  { timestamps: true }
);

recentViewedSchema.index({ user: 1, product_variant: 1 }, { unique: true });

export default mongoose.model("RecentViewed", recentViewedSchema);
