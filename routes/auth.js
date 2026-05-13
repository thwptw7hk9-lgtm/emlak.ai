import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// Kullanıcı Şeması (Database Modeli)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    twoFactorSecret: { type: String, default: "" }, // 2FA için hazırlık
    isTwoFactorEnabled: { type: Boolean, default: false }
});

const User = mongoose.model("User", UserSchema);

// --- KAYIT OL (REGISTER) ---
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kullanıcı var mı kontrol et
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Bu e-posta zaten kayıtlı." });

        // Şifreyi şifrele (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "Kullanıcı başarıyla oluşturuldu." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GİRİŞ YAP (LOGIN) ---
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Kullanıcı bulunamadı." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Hatalı şifre." });

        // JWT Token Oluştur
        const token = jwt.sign({ id: user._id }, "gizli_anahtar_buraya", { expiresIn: "1h" });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;