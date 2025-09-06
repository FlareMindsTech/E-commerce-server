import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product_variant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ProductVariant",   
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      trim: true, 
      maxlength: 1000 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
