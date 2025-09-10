import OrderItem from "../Models/OrderItem.js";

// ✅ Create Order Item
export const createOrderItem = async (req, res) => {
  try {
    const { order, product, quantity, price } = req.body;

    const newOrderItem = new OrderItem({
      order,
      product,
      quantity,
      price
    });

    await newOrderItem.save();
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate("order", "status totalAmount")
      .populate("product", "name price");

    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate("order", "status totalAmount")
      .populate("product", "name price");

    if (!orderItem) {
      return res.status(404).json({ message: "Order Item not found" });
    }
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update order item
export const updateOrderItem = async (req, res) => {
  try {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrderItem) {
      return res.status(404).json({ message: "Order Item not found" });
    }
    res.json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete order item
export const deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Order Item not found" });
    }
    res.json({ message: "Order Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
