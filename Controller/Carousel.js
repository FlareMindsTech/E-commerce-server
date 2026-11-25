import Carousel from "../Models/Carousel.js";
import { deleteFromBunny } from "../Utils/bunny.js";

/**
 * ✅ Upload Carousel Images (Admin only)
 * - Upload multiple images to Bunny Storage
 * - Store file CDN URLs in DB
 */
export const uploadCarouselImages = async (req, res) => {
  try {
    const files = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Bunny storage engine provides CDN URLs in files[].path
    const imageUrls = files.map((file) => file.path);

    let carousel = await Carousel.findOne();

    if (!carousel) {
      carousel = new Carousel({ images: imageUrls });
    } else {
      carousel.images.push(...imageUrls);
    }

    await carousel.save();

    return res.status(201).json({
      message: "Images uploaded successfully",
      data: carousel,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Get All Carousel Images (Public)
 */
export const getCarouselImages = async (req, res) => {
  try {
    const carousel = await Carousel.findOne();
    if (!carousel || carousel.images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }
    res.status(200).json({ data: carousel.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Delete a Carousel Image (Admin only)
 * - Removes from DB
 * - Delete from Bunny Storage using image URL or path
 */
export const deleteCarouselImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const carousel = await Carousel.findOne();
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    // Remove from DB
    carousel.images = carousel.images.filter((img) => img !== imageUrl);
    await carousel.save();

    // Delete image from Bunny Storage
    await deleteFromBunny(imageUrl);

    res.status(200).json({ message: "Image deleted successfully", data: carousel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
