
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const dbPath = './data/properties.json';
const getDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Sayfalar
app.get("/", (req, res) => res.render('index', { properties: getDB() }));

// ANALİZ MOTORU (PRO SÜRÜM)
app.post("/api/analyze", async (req, res) => {
    const { id, customText } = req.body;
    const listings = getDB();
    const target = id ? listings.find(l => l.id == id) : customText;

    if (!target) return res.json({ error: "İlan bulunamadı." });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Sen EmlakIQ PRO Analizcisin. İlanın; + ve - yönlerini, yatırım riskini, kira getiri potansiyelini, bölge fiyatlarına göre uygunluk (Ideal/Pahalı/Fırsat) durumunu raporla. Yanıtın güven vermeli." },
                { role: "user", content: `Analiz et: ${JSON.stringify(target)}` }
            ],
            temperature: 0.3
        });
        res.json({ result: completion.choices[0].message.content });
    } catch (e) { res.status(500).json({ error: "AI Analiz hatası." }); }
});

// Auth Taslakları (Sonraki geliştirme için hazır)
app.post("/api/auth/register", (req, res) => res.json({ msg: "Kayıt sistemi backend kontrolünde hazırlanıyor." }));
app.post("/api/auth/2fa-setup", (req, res) => res.json({ msg: "2FA Güvenlik katmanı hazır." }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EmlakIQ PRO V3 Yayında: http://localhost:${PORT}`));
