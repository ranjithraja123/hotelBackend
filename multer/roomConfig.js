import multer from "multer";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; // FIX PATH

dotenv.config();

/**
 * Cloudinary Storage Configuration
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "rooms",
    resource_type: "image", // ✅ FIXED TYPO
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    public_id: `${file.originalname.split(".")[0]}-${Date.now()}`,
  }),
});

/**
 * Allow only image files
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/**
 * Multer Configuration
 */
const uploadRooms = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 25 }, // 25MB
});

/**
 * Middleware for multiple uploads
 */
const uploadMultipleRooms = (req, res, next) => {
  uploadRooms.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export default uploadMultipleRooms;
