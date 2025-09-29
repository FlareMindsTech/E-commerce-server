import Order from "../Models/Order.js";
import OrderItem from "../Models/OrderItem.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const { user, address, total_amount, notes } = req.body;

    const order = await Order.create({ user, address, total_amount, notes });
    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Order by ID (any user)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("address")
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("offer")
      .populate("payment");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // If user role is 'user', restrict access to their other orders
    if (req.user.role === "user" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Delete all linked order items
    await OrderItem.deleteMany({ order: req.params.id });
    res.json({ message: "Order and related items deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all Orders with search & pagination
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    let query = {};
    if (search) {
      query["user"] = search; // you can customize search by user ID, email, etc.
    }
    if (status) query.status = status;

    // Restrict non-admin users to their own orders
    if (req.user.role === "user") query.user = req.user._id;

    const orders = await Order.find(query)
      .populate("user")
      .populate("address")
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("offer")
      .populate("payment")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
