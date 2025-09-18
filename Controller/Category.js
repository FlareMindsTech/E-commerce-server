import Category from "../Models/Category.js";

// ---------------- Create Category ----------------
export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // ✅ Case-insensitive duplicate check
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" } // matches name exactly, ignore case
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim(), description, status });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get All Categories ----------------
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get Category By Id ----------------
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Update Category ----------------
export const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // ✅ Check for duplicate name (case-insensitive) when updating
    if (name) {
      const duplicate = await Category.findOne({
        _id: { $ne: req.params.id }, // exclude current category
        name: { $regex: `^${name.trim()}$`, $options: "i" }
      });
      if (duplicate) return res.status(400).json({ message: "Category with this name already exists" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), description, status },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Delete Category ----------------
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
