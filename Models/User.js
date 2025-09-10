import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"], // ✅ validation
    },
    password: {
      type: String,
      minlength: 4,
      maxlength: 128,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
  },
  { timestamps: true }
);

// Pre-save hook to capitalize first/last name & auto-generate password
userSchema.pre("save", function (next) {
  if (this.firstName) {
    this.firstName =
      this.firstName.charAt(0).toUpperCase() +
      this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName =
      this.lastName.charAt(0).toUpperCase() +
      this.lastName.slice(1).toLowerCase();
  }

  // Auto-generate password if not already set
  if (!this.isModified("password") && this.isNew) {
    const firstPart =
      this.firstName.slice(0, 4).charAt(0).toUpperCase() +
      this.firstName.slice(1, 4).toLowerCase();
    const lastPart = this.phone.slice(-4);
    this.password = `${firstPart}@${lastPart}`;
  }

  next();
});

export default mongoose.model("User", userSchema);
