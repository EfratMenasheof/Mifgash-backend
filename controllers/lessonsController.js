import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

export async function generateLesson(req, res) {
  const { language, topic } = req.body;

  const prompt = `
Create a short and fun ${language} language exchange lesson on the topic: ${topic}.
Please include:
1. A short title
2. 3–5 new vocabulary words with translations
3. A short dialogue (2 speakers)
4. A simple exercise for practice
Respond in ${language}.
`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();

    const output = Array.isArray(data)
      ? data[0]?.generated_text
      : data.generated_text || data.error || "No response";

    res.json({ lesson: output });

  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to generate lesson." });
  }
}
