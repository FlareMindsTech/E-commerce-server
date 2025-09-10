import mongoose from "mongoose";
import bcrypt from "bcrypt";

const specialChars = "!@#$%^&*()_+";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
  },
  fullName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  password: { type: String, required: true },
});

// Generate fullName + auto password before save
userSchema.pre("save", async function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;

  if (this.isNew) {
    const first3 = this.firstName.slice(0, 3);
    const last4 = this.phone.slice(-4);
    const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const plainPassword = first3 + last4 + randomChar;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(plainPassword, salt);

    // Save plain password temporarily (for sending email)
    this._plainPassword = plainPassword;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
