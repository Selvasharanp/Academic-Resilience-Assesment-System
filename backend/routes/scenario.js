const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : "",
  baseURL: "https://models.inference.ai.azure.com"
});

router.get('/generate', async (req, res) => {
    // Detect the mode from the frontend request
    const isAIMode = req.query.mode === 'ai';

    try {
        let prompt = "";

        if (isAIMode) {
            // PROMPT FOR AI DISCOVERY (The text-input challenge)
            prompt = `Act as an Educational Psychologist. Write a small sentence intense academic crisis.The sentence should not be too long or too short.the sentence should not exceed 30 words.End exactly with the question: 'How would you react to this setback?'`;
            
            const response = await client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini",
            });

            return res.json({ scenario: response.choices[0].message.content });
        } else {
            // PROMPT FOR STANDARD ARS-30 (The 6-situation 1-5 scale test)
            // UPDATED: Added strict instructions for variety and uniqueness across all 30 items
            prompt = `Act as an Educational Psychologist. Create a structured Academic Resilience Assessment.
            1. Generate exactly 6 UNIQUE and different academic crises.It should be very unique.The question should be very unique from basic questions (e.g., data loss, scholarship issues, interpersonal conflict, grade disputes, health setbacks, and burnout).
            2. For EACH crisis, generate exactly 5 behavioral reaction questions (e.g., 'I would [action]').
            3. MANDATORY: Every single question in the entire set of 30 must be UNIQUE. Do not repeat "I would work harder" or "I would seek help" across different scenarios. Vary the phrasing and specific actions (e.g., 'I would re-evaluate my schedule', 'I would contact a subject librarian', 'I would use breathing techniques to stay calm').
            4. Assign each question a category: 'perseverance', 'helpSeeking', or 'negativeAffect'.
            5. For 'negativeAffect' items, set 'isReverse' to true.

            OUTPUT ONLY VALID JSON:
            {
              "situations": [
                {
                  "scenario": "description of the crisis",
                  "questions": [{"id": 1, "text": "reaction", "category": "string", "isReverse": boolean}]
                }
              ]
            }`;

            const response = await client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini",
                response_format: { type: "json_object" }
            });

            return res.json(JSON.parse(response.choices[0].message.content));
        }

    } catch (err) {
        console.error("❌ AI Route Error:", err.message);
        // Robust fallback so both paths still work if AI is down
        if (isAIMode) {
            res.json({ scenario: "Your final project files were corrupted and you have no backup with 48 hours left to the deadline. How would you react?" });
        } else {
            res.json({ situations: Array(6).fill({ 
                scenario: "A significant academic challenge has occurred.", 
                questions: Array(5).fill({ text: "I would maintain my efforts despite the difficulty.", category: 'perseverance', isReverse: false }) 
            })});
        }
    }
});

module.exports = router;