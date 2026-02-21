import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SimulatorQuiz() {
    const navigate = useNavigate();
    const [scenario, setScenario] = useState("");
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/scenario/generate?mode=ai`)
            .then(res => { setScenario(res.data.scenario); setLoading(false); });
    }, []);

    const handleSubmit = async () => {
        if (userInput.trim().length < 15) return alert("System requires more behavioral detail.");
        setIsAnalyzing(true);
        try {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai-support/grade-simulation`,
        {
            scenario: scenario,
            userAction: userInput
        }
    );
            setAnalysisResult(res.data);
        } catch (err) { alert("AI sync error."); }
        setIsAnalyzing(false);
    };

    const handleProceedToDashboard = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const submissionData = {
                userId,
                isAIResult: true,
                pAI: Math.round(analysisResult.scores.perseverance * 7),
                hAI: Math.round(analysisResult.scores.helpSeeking * 4.5),
                nAI: Math.round(analysisResult.scores.negativeAffect * 3.5)
            };

            await axios.post(
    `${process.env.REACT_APP_API_URL}/api/assessment/submit`,
    submissionData
);
            localStorage.setItem('hasHistory', 'true');
            navigate('/student-dashboard');
        } catch (err) {
            alert("Final data sync failed.");
        }
    };

    if (loading) return (
        /* LOADING STATE UPDATED TO LIGHT THEME */
        <div className="vh-100 bg-white d-flex align-items-center justify-content-center text-dark font-monospace">
            <span style={{ color: '#9D59EF', fontWeight: 'bold' }}>SYNCHRONISING_SITUATIONAL_VIGNETTE...</span>
        </div>
    );

    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK CHARCOAL */
        <div className="min-vh-100 bg-white text-dark py-5 px-3 text-start">
            <div className="container" style={{ maxWidth: '800px' }}>
                {!analysisResult ? (
                    /* CARD UPDATED TO LIGHT SAAS LOOK */
                    <div className="aras-card shadow-sm" style={{ border: '1px solid #e4e4e7', background: '#ffffff', borderRadius: '24px', padding: '40px' }}>
                        {/* ACCENT COLOR CHANGED TO PURPLE */}
                        <h6 className="fw-bold mb-4" style={{ color: '#9D59EF', letterSpacing: '2px' }}>SITUATIONAL DISCOVERY</h6>
                        <h2 className="fw-bold mb-5 lh-base text-dark">"{scenario}"</h2>
                        
                        <label className="small fw-bold mb-3 opacity-50 uppercase ls-widest text-dark">Input Strategy Response:</label>
                        <textarea 
                            className="form-control mb-4 p-4 text-dark" 
                            rows="6" 
                            placeholder="Describe your reaction plan..." 
                            style={{ background: '#fbfbfe', border: '1px solid #e4e4e7', borderRadius: '15px', fontSize: '1.1rem' }} 
                            onChange={(e) => setUserInput(e.target.value)} 
                        />
                        
                        {/* PRIMARY BUTTON IS NOW PURPLE */}
                        <button className="btn btn-neon w-100 py-3 fw-bold shadow-sm" onClick={handleSubmit} disabled={isAnalyzing}>
                            {isAnalyzing ? "SYSTEM ANALYSING..." : "COMMIT RESPONSE FOR ANALYSIS"}
                        </button>
                    </div>
                ) : (
                    /* FINAL RESULT PANEL UPDATED TO PURPLE BACKGROUND */
                    <div className="aras-card border-0 shadow-lg p-5" style={{ background: '#9D59EF', borderRadius: '40px' }}>
                        <h6 className="fw-bold text-white opacity-75 mb-3 uppercase ls-wide">State Analysis Ready</h6>
                        <h1 className="display-4 fw-bold text-white mb-1">{analysisResult.mentalState?.toUpperCase()}</h1>
                        <p className="text-white fw-bold small opacity-75 mb-5 uppercase">Cognitive State Identification</p>
                        
                        <div className="bg-white text-dark p-4 rounded-4 mb-5 shadow-sm">
                            <h6 className="fw-bold mb-2" style={{ color: '#9D59EF' }}>AI PSYCHOLOGICAL FEEDBACK:</h6>
                            <p className="m-0 lh-lg" style={{ fontSize: '1.05rem', color: '#18181b' }}>{analysisResult.feedback}</p>
                        </div>
                        
                        {/* DARK BUTTON FOR CONTRAST ON PURPLE */}
                        <button className="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow-xl text-white" style={{ background: '#18181b', border: 'none' }} onClick={handleProceedToDashboard}>
                            CONFIRM & PROCEED TO CORE ANALYSIS
                        </button>
                        
                        <button className="btn btn-link text-white text-decoration-none small fw-bold w-100 mt-3" onClick={() => window.location.reload()}>RELOAD PROTOCOL</button>
                    </div>
                )}
            </div>
        </div>
    );
}
