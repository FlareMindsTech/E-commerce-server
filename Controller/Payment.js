import Payment from "../Models/Payment.js";
import Order from "../Models/Order.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { order, amount, method, payment_gateway, transaction_id } = req.body;

    // ✅ ensure the order exists
    const existingOrder = await Order.findById(order);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      order,
      amount,
      method,
      payment_gateway,
      transaction_id
    });

    // ✅ update order with payment reference
    existingOrder.payment = payment._id;
    await existingOrder.save();

    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("order");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment (status, etc.)
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment updated", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // ✅ also remove reference from order
    await Order.findByIdAndUpdate(payment.order, { $unset: { payment: "" } });

    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments (admin use)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("order");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
