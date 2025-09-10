import User from "../Models/User.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Create user
    const user = new User({ firstName, lastName, email, phone });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        password: user.password, // showing password in response for testing (not safe for production)
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
