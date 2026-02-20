const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

router.post('/submit', async (req, res) => {
    try {
        const { userId, answers, pAI, hAI, nAI, isAIResult } = req.body;

        let p = 0, h = 0, n = 0;

        if (isAIResult) {
            // Case A: Handling pre-normalized AI scores
            p = pAI;
            h = hAI;
            n = nAI;
        } else {
            // Case B: Handling Standard 30 Question Array
            const pItems = [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 15, 16, 17, 30];
            const hItems = [18, 20, 21, 22, 24, 25, 26, 27, 29];
            const nItems = [6, 7, 12, 14, 19, 23, 28];

            let pRaw = 0, hRaw = 0, nRaw = 0;
            let pCnt = 0, hCnt = 0, nCnt = 0;

            answers.forEach(a => {
                let val = parseInt(a.val);
                const category = a.category || (pItems.includes(a.qId) ? 'perseverance' : hItems.includes(a.qId) ? 'helpSeeking' : 'negativeAffect');
                if (category === 'perseverance') { pRaw += val; pCnt++; }
                else if (category === 'helpSeeking') { hRaw += val; hCnt++; }
                else if (category === 'negativeAffect') { nRaw += (a.qId !== undefined && nItems.includes(a.qId) ? (6 - val) : val); nCnt++; }
            });

            p = pCnt > 0 ? Math.round((pRaw / pCnt) * 14) : 0;
            h = hCnt > 0 ? Math.round((hRaw / hCnt) * 9) : 0;
            n = nCnt > 0 ? Math.round((nRaw / nCnt) * 7) : 0;
        }

        const currentTotal = p + h + n;

        // Progress Tracking Logic (remains exactly as before)
        const previousTest = await Assessment.findOne({ student: userId }).sort({ date: -1 });
        let improvement = 0;
        let feedback = "Initial baseline established.";

        if (previousTest) {
            improvement = ((currentTotal - previousTest.totalScore) / (previousTest.totalScore || 1)) * 100;
            feedback = improvement >= 0 
                ? `Progress of ${improvement.toFixed(1)}% detected.` 
                : `Deviation of ${Math.abs(improvement).toFixed(1)}% identified.`;
        }

        const report = new Assessment({
            student: userId,
            perseverance: p,
            helpSeeking: h,
            negativeAffect: n,
            totalScore: currentTotal,
            date: new Date() 
        });

        await report.save();
        
        res.status(201).json({ 
            result: report, 
            progress: { improvement: improvement.toFixed(1), feedback: feedback } 
        });
    } catch (err) {
        res.status(500).json({ error: "Sync failed" });
    }
});

// (Keep User-History, User-Result, and Global-Stats routes below unchanged)
router.get('/global-stats', async (req, res) => {
    try {
        const stats = await Assessment.aggregate([{ $group: { _id: null, avgPerseverance: { $avg: "$perseverance" }, avgHelpSeeking: { $avg: "$helpSeeking" }, avgNegativeAffect: { $avg: "$negativeAffect" }, avgTotal: { $avg: "$totalScore" }, totalStudents: { $sum: 1 } } }]);
        res.json(stats[0] || { avgPerseverance: 40, avgHelpSeeking: 30, avgNegativeAffect: 20, avgTotal: 90, totalStudents: 0 });
    } catch (err) { res.status(500).json({ error: "Error" }); }
});
router.get('/user-history/:userId', async (req, res) => {
    try { res.json(await Assessment.find({ student: req.params.userId }).sort({ date: 1 })); } 
    catch (err) { res.status(500).json(err); }
});
router.get('/user-result/:userId', async (req, res) => {
    try { res.json(await Assessment.findOne({ student: req.params.userId }).sort({ date: -1 })); } 
    catch (err) { res.status(500).json(err); }
});

module.exports = router;