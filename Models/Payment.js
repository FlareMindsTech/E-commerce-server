import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    order: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
      // ⚡ store in smallest unit (paise/cents) for accuracy 
    },
    method: { 
      type: String, 
      enum: ["UPI", "Card", "Cash", "NetBanking", "Wallet"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "success", "failed", "refunded"], 
      default: "pending" 
    },
    transaction_id: { 
      type: String, 
      unique: true, 
      sparse: true, // allows multiple nulls
      trim: true 
    },
    payment_gateway: { 
      type: String, 
      enum: ["Razorpay", "Stripe", "PayPal", "Cashfree", "Other"], 
      default: "Other" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);