import Address from "../Models/Address.js";
import User from "../Models/User.js";

// Create address
export const createAddress = async (req, res) => {
  try {
    const { user_id, city, state, pincode, country, phone, is_default } = req.body;

    // check user exists
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // if this is default, remove other defaults
    if (is_default) {
      await Address.updateMany({ user_id }, { is_default: false });
    }

    const address = await Address.create({
      user_id,
      city,
      state,
      pincode,
      country,
      phone,
      is_default,
    });

    res.status(201).json({ message: "Address created", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all addresses (admin use)
export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("user_id", "name email");
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get addresses of a specific user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.params.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update address
export const updateAddress = async (req, res) => {
  try {
    const { city, state, pincode, country, phone, is_default } = req.body;

    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // ensure only one default
    if (is_default) {
      await Address.updateMany({ user_id: address.user_id }, { is_default: false });
    }

    Object.assign(address, { city, state, pincode, country, phone, is_default });
    await address.save();

    res.json({ message: "Address updated", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
