import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Resimlerin nereye ve hangi isimle kaydedileceği
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Yeni İlan Ekleme ve Fotoğraf Yükleme Endpoint'i
router.post("/add", upload.single("image"), (req, res) => {
  res.json({ 
    message: "İlan ve fotoğraf başarıyla yüklendi!",
    imageUrl: `/uploads/${req.file.filename}` 
  });
});

export default router;