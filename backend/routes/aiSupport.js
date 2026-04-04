const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : "",
  baseURL: "https://models.inference.ai.azure.com"
});

const SUPPORT_RESOURCES = [
  {
    id: '988',
    title: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'Call or text 988 in the U.S. for immediate mental health crisis support, 24/7.',
    source: 'https://988lifeline.org/'
  },
  {
    id: 'crisis-text-line',
    title: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Text with a live crisis counselor in the U.S. at any hour.',
    source: 'https://www.crisistextline.org/'
  },
  {
    id: 'samhsa',
    title: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral and support for mental health or substance use concerns, available 24/7.',
    source: 'https://www.samhsa.gov/find-help/national-helpline'
  }
];

const HIGH_RISK_PATTERNS = [
  /suicide/i,
  /kill myself/i,
  /end my life/i,
  /self-harm/i,
  /hurt myself/i,
  /i want to die/i,
  /hopeless/i,
  /panic attack/i,
  /can't go on/i,
  /severely depressed/i
];

function getSupportLevel(message = '') {
  return HIGH_RISK_PATTERNS.some((pattern) => pattern.test(message)) ? 'urgent' : 'standard';
}

function buildFallbackReply(level) {
  if (level === 'urgent') {
    return "I'm really sorry you're carrying this right now. Please contact the emergency support options on screen now and reach out to a trusted person near you immediately.";
  }

  return "I'm listening. Take one small step at a time, and remember that academic setbacks can be worked through with support and a clear plan.";
}

router.get('/support-resources', async (req, res) => {
  res.json({
    country: 'United States',
    emergencyNote: 'If someone is in immediate danger or has a medical emergency, call 911 right away.',
    helplines: SUPPORT_RESOURCES
  });
});

// 1. CHAT WITH AI COACH
router.post('/chat', async (req, res) => {
  const message = req.body?.message || '';
  const supportLevel = getSupportLevel(message);

  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: supportLevel === 'urgent'
            ? 'You are a compassionate academic resilience coach. Reply in exactly 2 short sentences, encourage immediate human support, and keep the tone calm and direct.'
            : 'You are a professional academic resilience coach. Provide a short, empathetic 2-sentence response.'
        },
        { role: 'user', content: message }
      ],
      model: 'gpt-4o-mini'
    });

    res.json({
      reply: response.choices[0].message.content,
      supportLevel,
      helplines: supportLevel === 'urgent' ? SUPPORT_RESOURCES : []
    });
  } catch (err) {
    console.error('Chat Error:', err.message);
    res.status(500).json({
      reply: buildFallbackReply(supportLevel),
      supportLevel,
      helplines: supportLevel === 'urgent' ? SUPPORT_RESOURCES : []
    });
  }
});

// 2. GRADE SIMULATION RESPONSE
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
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' }
    });

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ feedback: 'AI Analysis currently calibrating.' });
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
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' }
    });

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ steps: [{ title: 'Emergency Protocol', description: 'Standard recovery plan active.' }] });
  }
});

module.exports = router;
