import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 128,
      required: true,
      select: false 
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
