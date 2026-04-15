import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 150,
        messages: [
          { role: "system", content: "Answer interview questions briefly (max 4 sentences)." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    res.json({
      answer: data.choices?.[0]?.message?.content || "No answer"
    });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(10000, () => console.log("Server running"));
