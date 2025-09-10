import User from '../Models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const UserController = {

  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user._id, role: 'customer', kind: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ success: true, token, user });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id, role: 'customer', kind: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ success: true, token, user });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

};
