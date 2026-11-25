import multer from "multer";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const storageEndpoint = (process.env.BUNNY_STORAGE_ENDPOINT || "").replace(/\/+$/, "");
const storageAccessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
const cdnUrl = (process.env.BUNNY_CDN_URL || "").replace(/\/+$/, "");

/**
 * Upload a buffer to Bunny Storage
 * @param {Buffer} buffer
 * @param {string} relativePath - e.g. "products/xyz.jpg"
 * @param {string} mimeType
 * @returns {Promise<string>} Public CDN URL
 */
export async function uploadToBunny(buffer, relativePath, mimeType = "application/octet-stream") {
  if (!storageEndpoint || !storageAccessKey) {
    throw new Error("Bunny storage credentials (BUNNY_STORAGE_ENDPOINT, BUNNY_STORAGE_ACCESS_KEY) are missing in environment variables.");
  }

  const cleanPath = relativePath.replace(/^\/+/, "");
  const uploadUrl = `${storageEndpoint}/${cleanPath}`;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: storageAccessKey,
      "Content-Type": mimeType || "application/octet-stream",
    },
    body: buffer,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Bunny storage upload failed (${res.status} ${res.statusText}): ${errorText}`);
  }

  return `${cdnUrl}/${cleanPath}`;
}

/**
 * Delete a file from Bunny Storage by relative path or full URL
 * @param {string} pathOrUrl - e.g. "products/xyz.jpg" or "https://aadviecomassets.b-cdn.net/products/xyz.jpg"
 * @returns {Promise<boolean>}
 */
export async function deleteFromBunny(pathOrUrl) {
  if (!pathOrUrl || !storageEndpoint || !storageAccessKey) return false;

  let relativePath = pathOrUrl;

  // If full URL, extract path
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    try {
      const parsed = new URL(pathOrUrl);
      relativePath = parsed.pathname;
    } catch {
      // ignore parsing error, use pathOrUrl
    }
  }

  const cleanPath = relativePath.replace(/^\/+/, "");
  const deleteUrl = `${storageEndpoint}/${cleanPath}`;

  try {
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: storageAccessKey,
      },
    });

    return res.ok || res.status === 404;
  } catch (error) {
    console.error(`Failed to delete file from Bunny Storage (${cleanPath}):`, error.message);
    return false;
  }
}

/**
 * Custom Multer Storage Engine for Bunny Storage
 */
class BunnyStorageEngine {
  constructor(options = {}) {
    this.folder = options.folder;
  }

  _handleFile(req, file, cb) {
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("error", (err) => cb(err));
    file.stream.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);

        // Determine destination folder
        let folder = "uploads";
        if (typeof this.folder === "function") {
          folder = this.folder(req, file);
        } else if (this.folder) {
          folder = this.folder;
        } else if (req.body && req.body.folder) {
          folder = req.body.folder;
        } else if (req.baseUrl) {
          if (req.baseUrl.includes("product")) folder = "products";
          else if (req.baseUrl.includes("carousel")) folder = "carousel";
          else if (req.baseUrl.includes("user")) folder = "profile";
          else if (req.baseUrl.includes("category")) folder = "categories";
        }

        let ext = (path.extname(file.originalname) || "").toLowerCase();
        if (!ext) {
          if (file.mimetype === "image/jpeg") ext = ".jpg";
          else if (file.mimetype === "image/png") ext = ".png";
          else if (file.mimetype === "image/webp") ext = ".webp";
          else if (file.mimetype === "image/gif") ext = ".gif";
          else ext = ".jpg";
        }

        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
        const relativePath = `${folder}/${uniqueName}`;

        const publicUrl = await uploadToBunny(buffer, relativePath, file.mimetype);

        cb(null, {
          path: publicUrl,
          url: publicUrl,
          filename: relativePath,
          public_id: relativePath,
          size: buffer.length,
          mimetype: file.mimetype,
        });
      } catch (err) {
        cb(err);
      }
    });
  }

  _removeFile(req, file, cb) {
    if (file.filename) {
      deleteFromBunny(file.filename)
        .then(() => cb(null))
        .catch(cb);
    } else {
      cb(null);
    }
  }
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|webp|avif|gif|svg)$/i;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.test(ext) || file.mimetype?.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (.jpeg, .jpg, .png, .webp, .avif, .gif, .svg) are allowed"), false);
  }
};

export const upload = multer({
  storage: new BunnyStorageEngine(),
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

export default upload;
