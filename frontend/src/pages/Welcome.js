import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || "Student";
    const fullText = `Hello, ${userName}.`;
    
    // TYPING ANIMATION LOGIC
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplayedText(""); // Clear text every time component loads
        
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100); 

        return () => clearInterval(typingInterval); 
    }, [fullText]);

    const handleStart = (type) => {
        localStorage.setItem('assessmentType', type);
        if(type === 'ai') navigate('/simulator-quiz');
        else navigate('/quiz');
    };

    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK CHARCOAL */
        <div className="container-fluid min-vh-100 bg-white text-dark d-flex align-items-center justify-content-center py-5">
            
            <div className="text-center" style={{ maxWidth: '850px' }}>
                
                {/* Heading with Typewriter Animation - COLOR IS DARK */}
                <h1 className="display-2 fw-bold mb-3 ls-tight text-dark" style={{ minHeight: '1.2em' }}>
                    {displayedText}
                </h1>

                <p className="lead mb-5 mx-auto" style={{ color: '#71717a', maxWidth: '600px', fontWeight: '400' }}>
                    {/* ACCENT COLOR CHANGED TO NOTION PURPLE */}
                    Select a methodology to analyze your academic resilience. Choose <span style={{ color: '#9D59EF', fontWeight: 'bold' }}>AI Discovery</span> for real-time situational insights.
                </p>

                <div className="row g-4 px-3">
                    {/* Path 1: Standard Assessment */}
                    <div className="col-md-6">
                        <div className="aras-card h-100 text-center d-flex flex-column shadow-sm" 
                             style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '40px' }}>
                            <div className="mb-4">
                                <h4 className="fw-bold mb-3 text-dark">Standard ARS-30</h4>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    The scientific baseline. 30 response items measuring foundational perseverance and help-seeking strategies.
                                </p>
                            </div>
                            <button 
                                onClick={() => handleStart('standard')} 
                                className="btn btn-outline-neon w-100 mt-auto py-3 fw-bold"
                            >
                                Start Standard
                            </button>
                        </div>
                    </div>

                    {/* Path 2: AI Dynamic Scenarios */}
                    <div className="col-md-6">
                        <div className="aras-card h-100 text-center d-flex flex-column shadow-sm" 
                             style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '40px' }}>
                            <div className="mb-4">
                                {/* BADGE COLORS UPDATED */}
                                <div className="d-inline-block mb-3 px-2 py-1 rounded fw-bold" style={{ fontSize: '0.6rem', background: '#f5f0ff', color: '#9D59EF' }}>
                                    RECOMMENDED
                                </div>
                                <h4 className="fw-bold mb-3 text-dark">AI Discovery</h4>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    3 dynamic academic crisis scenarios generated in real-time. Analyzes situational logic and immediate problem-solving.
                                </p>
                            </div>
                            <button 
                                onClick={() => handleStart('ai')} 
                                className="btn btn-neon w-100 mt-auto py-3 fw-bold shadow"
                            >
                                Start AI Challenge
                            </button>
                        </div>
                    </div>
                </div>

                {/* Minimalist Footer */}
                <div className="mt-5 pt-4 opacity-50">
                    <p className="small ls-widest text-uppercase" style={{ fontSize: '0.6rem', color: '#18181b', letterSpacing: '2px' }}>
                        SCROLL FOR MORE • SECURE SESSION
                    </p>
                </div>
            </div>
        </div>
    );
}