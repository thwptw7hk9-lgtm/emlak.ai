import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// Veri okuma fonksiyonu (Hata denetimli)
const loadProperties = () => {
    try {
        const raw = fs.readFileSync(path.join(__dirname, "data/properties.json"), "utf8");
        return JSON.parse(raw);
    } catch (e) {
        console.error("Kritik Hata: Veritabanı dosyası okunamadı.");
        return [];
    }
};

// --- Yönlendirmeler ---

app.get("/", (req, res) => {
    const properties = loadProperties();
    res.render("index", { properties });
});

app.get("/property/:id", (req, res) => {
    const properties = loadProperties();
    const property = properties.find(p => p.id == req.params.id);
    if (!property) return res.status(404).render("404");
    res.render("detail", { property });
});

app.get("/ai-analyzer", (req, res) => res.render("analyzer"));
app.get("/auth", (req, res) => res.render("auth"));

app.listen(PORT, () => console.log(`[OK] Kurumsal sistem yayında: http://localhost:${PORT}`));