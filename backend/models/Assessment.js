const mongoose = require('mongoose');
const AssessmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    perseverance: Number,      // Dimension 1
    helpSeeking: Number,       // Dimension 2
    negativeAffect: Number,    // Dimension 3 (Reverse coded)
    totalScore: Number,
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Assessment', AssessmentSchema);