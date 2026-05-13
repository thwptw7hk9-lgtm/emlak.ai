import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// Veritabanını Oku (JSON)
const getDB = () => {
    try {
        const data = fs.readFileSync("./data/properties.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Veritabanı okuma hatası:", err);
        return [];
    }
};

// --- ROUTES ---

// 1. Anasayfa (İlan Listesi)
app.get("/", (req, res) => {
    const properties = getDB();
    res.render("index", { properties });
});

// 2. İlan Detay Sayfası (Yeni!)
app.get("/property/:id", (req, res) => {
    const properties = getDB();
    const property = properties.find(p => p.id == req.params.id);
    
    if (!property) {
        return res.status(404).send("İlan bulunamadı.");
    }
    
    res.render("detail", { property });
});

// 3. AI Analiz Merkezi
app.get("/ai-analyzer", (req, res) => {
    res.render("analyzer"); // analyzer.ejs dosyasını oluşturmalısın
});

// 4. Auth (Giriş/Kaydol)
app.get("/auth", (req, res) => {
    res.render("auth"); // auth.ejs dosyasını oluşturmalısın
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`EmlakIQ PRO Sunucusu Çalışıyor: http://localhost:${PORT}`);
});