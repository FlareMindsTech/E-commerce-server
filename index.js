import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

import userRoutes from './Routes/User.js';
import addressRoutes from './Routes/Address.js';
import cartRoutes from './Routes/CartItem.js';
import categoryRoutes from './Routes/Category.js';
import productRoutes from './Routes/Product.js';

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  

app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);





mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://sivakumar:siva@cluster0.ufpyq.mongodb.net/ecommercedatabase")
  .then(() => console.log("You! Connected to MongoDB..."))
  .catch((err) =>
    console.error("Could not connect to MongoDB... " + err.message)
  );

//  mongoose.connect('mongodb+srv://flaremindstech:flareminds%401308@cluster0.12wutsc.mongodb.net/Billingnew?retryWrites=true&w=majority&appName=Cluster0')
// .then(() => console.log('Connected to MongoDB Atlas...'))
// .catch(err => console.error('Could not connect to MongoDB...'));

// Routes
// app.use('/api/users', userRoutes);


app.get("/", (req, res) => {
  res.send("welcome to Billing Software Server"); 
});





const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
