const mongoose = require('mongoose');

const QuestionBankSchema = new mongoose.Schema({
    scenario: { type: String, default: "" }, // Used for AI mode
    text: { type: String, required: true },  // The question itself
    category: { type: String, enum: ['perseverance', 'helpSeeking', 'negativeAffect'] },
    isReverse: { type: Boolean, default: false },
    isAI: { type: Boolean, default: false } // false for 30 Standard, true for 3 Simulator
});

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);