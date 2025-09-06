import mongoose from "mongoose";

const recentViewedSchema = new mongoose.Schema(
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
    },
    device: { 
      type: String, 
      enum: ["mobile", "desktop", "tablet", "other"], 
      default: "other" 
    }
  },
  { timestamps: true }
);

recentViewedSchema.index({ user: 1, product_variant: 1 }, { unique: true });

export default mongoose.model("RecentViewed", recentViewedSchema);
