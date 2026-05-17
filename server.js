const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const AI_API_KEY = "sk-4902dfe35ef249af90c8c2728b3c6bf1";
const AI_MODEL = "claude-opus-4-7";
const AI_API_URL = "https://apiv3.netiva.com.tr/v1/chat/completions";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "AI isteği başarısız",
        detail: rawText
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(500).json({
        error: "JSON parse hatası",
        detail: rawText
      });
    }

    const text = data?.choices?.[0]?.message?.content || "Yanıt alınamadı.";
    res.json({ text });
  } catch (err) {
    res.status(500).json({
      error: "Sunucu hatası",
      detail: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Çalışıyor: http://localhost:${PORT}`);
});
