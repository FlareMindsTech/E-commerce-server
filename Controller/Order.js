import Order from "../Models/Order.js";
import OrderItem from "../Models/OrderItem.js";

// Create a new Order
export const createOrder = async (req, res) => {
  try {
    const { user, address, total_amount, notes } = req.body;

    const order = await Order.create({
      user,
      address,
      total_amount,
      notes
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Order by ID with populated fields
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("address")
      .populate({
        path: "orderItems",
        populate: { path: "product" } // populate product inside orderItems
      })
      .populate("offer")
      .populate("payment");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order (e.g., add orderItems or payment)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: Delete all orderItems linked to this order
    await OrderItem.deleteMany({ order: req.params.id });

    res.json({ message: "Order and related items deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (optional: admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("address")
      .populate({
        path: "orderItems",
        populate: { path: "product" }
      })
      .populate("offer")
      .populate("payment");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
