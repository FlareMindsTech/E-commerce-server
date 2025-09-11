import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Capitalize helper
const capitalizeName = (name) => {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    set: capitalizeName,
  },
  lastName: {
    type: String,
    required: true,
    set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined; // remove confirmPassword from DB
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
