import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
const app = express();

// Ensure the environment variable is set or use a default fallback
const uploadsDir = path.join(`${process.env.ROOM_PATH}`);
app.use('uploads',express.static(uploadsDir))
console.log(uploadsDir,"uploads")

// Create the uploads directory if it does not exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Ensure qcId is defined before usage
    const qcId = req.qcId || 'defaultId';
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

// Configure Multer
const uploadRooms = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 25 }, // 25MB limit
});

// Middleware to handle multiple file uploads
const uploadMultipleRooms = (req, res, next) => {
  uploadRooms.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

export default uploadMultipleRooms;
