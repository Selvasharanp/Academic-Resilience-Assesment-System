const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : "",
  baseURL: "https://models.inference.ai.azure.com" 
});

// 1. CHAT WITH AI COACH
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional academic resilience coach. Provide a short, empathetic 2-sentence response." },
                { role: "user", content: message }
            ],
            model: "gpt-4o-mini",
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (err) {
        console.error("❌ Chat Error:", err.message);
        res.status(500).json({ reply: "I'm listening. Take a deep breath—academic setbacks are just stepping stones to success." });
    }
});

// 2. GRADE SIMULATION RESPONSE (Updated to return dimension scores)
router.post('/grade-simulation', async (req, res) => {
    try {
        const { scenario, userAction } = req.body;
        const prompt = `Act as an expert academic psychologist. 
        Scenario provided: "${scenario}"
        Student's plan: "${userAction}"
        
        Analyze the response. Return ONLY valid JSON in this format:
        {
          "mentalState": "string",
          "feedback": "1 sentence feedback",
          "scores": {
            "perseverance": number_out_of_10,
            "helpSeeking": number_out_of_10,
            "negativeAffect": number_out_of_10
          },
          "totalScore": total_out_of_10,
          "status": "Elite/High/Medium/Low"
        }`;

        const response = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(response.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ feedback: "AI Analysis currently calibrating." });
    }
});

// 3. GENERATE ROADMAP
router.post('/generate-roadmap', async (req, res) => {
    try {
        const { scores } = req.body;
        const prompt = `Act as a Senior Academic Success Coach. 
        Student Metrics: Perseverance ${scores.perseverance}/70, Help-Seeking ${scores.helpSeeking}/45, Emotional Control ${scores.negativeAffect}/35.
        Create a 5-step master intervention plan.
        RETURN ONLY A JSON OBJECT in this exact format:
        { "steps": [ { "title": "Module Title", "description": "Detailed 2-sentence advice" } ] }`;

        const response = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(response.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ steps: [{ title: "Emergency Protocol", description: "Standard recovery plan active." }] });
    }
});

module.exports = router;