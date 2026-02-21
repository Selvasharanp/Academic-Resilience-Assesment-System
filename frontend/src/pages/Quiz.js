import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
    const navigate = useNavigate();
    const [situations, setSituations] = useState([]);
    const [sitIdx, setSitIdx] = useState(0);
    const [quesIdx, setQuesIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [summaryReport, setSummaryReport] = useState(null);

    useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/scenario/generate?mode=standard`)
        .then(res => { setSituations(res.data.situations); setLoading(false); });
}, []);

const handleNext = (val) => {
    const currentSit = situations[sitIdx];
    const currentQ = currentSit.questions[quesIdx];
    let score = currentQ.isReverse ? (6 - val) : val;
    const newAnswers = [...answers, { val: score, category: currentQ.category, qId: currentQ.id }];
    setAnswers(newAnswers);

    if (quesIdx < 4) setQuesIdx(quesIdx + 1);
    else if (sitIdx < 5) setIsPaused(true);
    else handleFinalSubmit(newAnswers);
};

const handleFinalSubmit = async (finalData) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/assessment/submit`,
            { 
                userId: localStorage.getItem('userId'), 
                answers: finalData 
            }
        );
        localStorage.setItem('hasHistory', 'true');
        setSummaryReport(res.data); 
    } catch (err) { 
        console.error(err); 
    }
};

    if (loading) return (
        <div className="vh-100 bg-white d-flex align-items-center justify-content-center text-dark font-monospace">
            <div className="spinner-border me-3" style={{ color: '#b690f1' }}></div>
            <span style={{ color: '#b690f1', fontWeight: 'bold' }}>INITIALISING_ARS30_PROTOCOL...</span>
        </div>
    );

    // --- FINAL REPORT SCREEN: FIXED VISIBILITY WITH PURPLE THEME ---
    if (summaryReport) return (
        <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center py-5 px-3">
            <div className="container" style={{ maxWidth: '550px' }}>
                <div 
                    className="text-center shadow-lg" 
                    style={{ 
                        /* FORCING PURPLE BACKGROUND AND REMOVING CONFLICTING CLASSES */
                        background: '#b690f1 !important',
                        backgroundColor: '#b690f1',      
                        borderRadius: '40px', 
                        padding: '60px',
                        boxShadow: '0 20px 50px rgba(182, 144, 241, 0.4)' 
                    }}
                >
                    {/* Header Label: Pure Black */}
                    <h6 className="fw-bold ls-widest uppercase mb-4" style={{ color: '#000', opacity: '0.6', fontSize: '0.75rem' }}>
                        Diagnostic Phase Complete
                    </h6>
                    
                    {/* THE SCORE: NOW SOLID BLACK AND VISIBLE */}
                    <h1 className="display-1 fw-bold text-black mb-1" style={{ color: '#000 !important', letterSpacing: '-5px' }}>
                        {summaryReport.result.totalScore}<small className="fs-3">/150</small>
                    </h1>
                    
                    <div className="mb-5 mt-2">
                        <span className="px-4 py-2 bg-black text-white rounded-pill fw-bold small shadow-sm">
                            {summaryReport.progress.improvement >= 0 
                                ? `↑ ${summaryReport.progress.improvement}% GROWTH` 
                                : `↓ ${Math.abs(summaryReport.progress.improvement)}% DEVIATION`}
                        </span>
                    </div>

                    {/* Feedback Box: High Contrast Black Text */}
                    <div className="text-start p-4 rounded-4 mb-5" style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <p className="small fw-bold mb-2 uppercase ls-wide" style={{ color: '#000', opacity: '0.6', fontSize: '0.65rem' }}>System Feedback:</p>
                        <p className="fw-bold lh-base m-0" style={{ color: '#000', fontSize: '1.05rem' }}>
                            "{summaryReport.progress.feedback}"
                        </p>
                    </div>
                    
                    <div className="d-grid gap-3 px-2">
                        <button 
                            className="btn py-3 fw-bold text-white rounded-pill shadow-xl" 
                            onClick={() => navigate('/student-dashboard')}
                            style={{ background: '#000', border: 'none', fontSize: '1rem' }}
                        >
                            GO TO ANALYSIS HUB
                        </button>
                        <button 
                            className="btn btn-link text-black text-decoration-none fw-bold small mt-1" 
                            onClick={() => window.location.reload()}
                        >
                            RETAKE ASSESSMENT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const currentSit = situations[sitIdx];
    const currentQ = currentSit?.questions[quesIdx];

    return (
        <div className="min-vh-100 bg-white text-dark py-5 px-3 text-start">
            <div className="container" style={{ maxWidth: '850px' }}>
                <div className="text-center mb-5 mt-4">
                    <p className="fw-bold small ls-widest text-uppercase" style={{ color: '#b690f1' }}>
                        SCENARIO {sitIdx + 1} OF 6 // ITEM {(sitIdx * 5) + quesIdx + 1} OF 30
                    </p>
                    <div className="progress-dark mt-3">
                        <div className="progress-bar-inner" style={{ width: `${(((sitIdx * 5) + quesIdx + 1) / 30) * 100}%`, background: '#b690f1' }}></div>
                    </div>
                </div>

                <div className="p-5 rounded-4 mb-4 text-start shadow-sm" style={{ background: '#fbfbfe', border: '1px solid rgba(182, 144, 241, 0.3)' }}>
                    <h2 className="display-6 fw-bold" style={{ color: '#18181b', lineHeight: '1.3' }}>"{currentSit?.scenario}"</h2>
                </div>

                <div className="aras-card border-0 shadow-sm text-center py-5" style={{ background: '#ffffff', border: '1px solid #e4e4e7' }}>
                    {!isPaused ? (
                        <>
                            <h3 className="mb-5 text-dark fw-medium">"{currentQ?.text}"</h3>
                            <div className="row g-3 px-md-5">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <div key={num} className="col">
                                        <button 
                                            onClick={() => handleNext(num)} 
                                            className="btn w-100 py-4 fs-3 fw-bold rounded-3 transition-all" 
                                            style={{ border: '2px solid #b690f1', color: '#b690f1', background: 'transparent' }}
                                            onMouseEnter={(e) => { e.target.style.background = '#b690f1'; e.target.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#b690f1'; }}
                                        >
                                            {num}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-5 text-center">
                            <h4 className="text-dark mb-5 opacity-75">Situation Protocol Complete.</h4>
                            <button className="btn btn-neon btn-lg px-5 py-3 fw-bold rounded-pill shadow" onClick={() => { setSitIdx(sitIdx + 1); setQuesIdx(0); setIsPaused(false); }}>
                                PROCEED TO NEXT PHASE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}