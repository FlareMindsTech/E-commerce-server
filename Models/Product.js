import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 200 
    },
    description: { 
      type: String, 
      trim: true, 
      maxlength: 2000 
    },
    images: [{ 
      type: String, 
      trim: true 
    }], 
    sku: { 
      type: String, 
      unique: true, 
      required: true, 
      uppercase: true, 
      trim: true 
    }, 
    stock: { 
      type: Number, 
      default: 0, 
      min: 0 
    }, 
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
