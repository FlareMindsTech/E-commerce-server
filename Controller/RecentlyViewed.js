import RecentViewed from "../Models/RecentlyViewed.js";

// ✅ Add or update recent viewed
export const addRecentViewed = async (req, res) => {
  try {
    const { user, product_variant } = req.body;

    // Check if this user already viewed this product
    let recent = await RecentViewed.findOne({ user, product_variant });

    if (recent) {
      // Update timestamp (touch it so it's "recent")
      recent.updatedAt = Date.now();
      await recent.save();
      return res.status(200).json({ message: "Updated recent viewed", data: recent });
    }

    // Else create new
    recent = new RecentViewed({ user, product_variant });
    await recent.save();

    res.status(201).json({ message: "Added to recent viewed", data: recent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all recent viewed for a user
export const getRecentViewedByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const recentViewed = await RecentViewed.find({ user: userId })
      .populate({
        path: "product_variant",
        populate: { path: "product", model: "Product" } // if ProductVariant has product ref
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ data: recentViewed });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete single recent viewed
export const deleteRecentViewed = async (req, res) => {
  try {
    const { id } = req.params;
    await RecentViewed.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Clear all recent viewed of a user
export const clearRecentViewed = async (req, res) => {
  try {
    const { userId } = req.params;
    await RecentViewed.deleteMany({ user: userId });
    res.status(200).json({ message: "Cleared all recent viewed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
