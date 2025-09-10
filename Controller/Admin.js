// import Admin from '../Models/Admin.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// export const AdminController = {

//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       const admin = await Admin.findOne({ email }).select("+password");
//       if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

//       const valid = await bcrypt.compare(password, admin.password);
//       if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

//       const token = jwt.sign({ id: admin._id, role: admin.role, kind: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
//       res.json({ success: true, token, admin });

//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   },

//   createAdmin: async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;

//       const exists = await Admin.findOne({ email });
//       if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const admin = await Admin.create({
//         name,
//         email,
//         password: hashedPassword,
//         role
//       });

//       res.json({ success: true, admin });

//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }

// };
