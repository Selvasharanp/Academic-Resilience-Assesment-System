import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Roadmap() {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRoadmap = async () => {
            if (!userId) return;
            
            try {
                const resRes = await axios.get(`http://localhost:5000/api/assessment/user-result/${userId}`);
                const roadRes = await axios.post('http://localhost:5000/api/ai-support/generate-roadmap', { scores: resRes.data });
                
                if (roadRes.data.steps) {
                    setSteps(roadRes.data.steps);
                }
                setLoading(false);
            } catch (err) { 
                console.error("AI Parse Error:", err);
                setLoading(false); 
            }
        };
        fetchRoadmap();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    if (loading) return (
        <div className="vh-100 bg-white d-flex flex-column align-items-center justify-content-center text-dark">
            <div className="spinner-grow" style={{ color: '#9D59EF' }} role="status"></div>
            <p className="fw-bold ls-widest mt-4 uppercase" style={{ color: '#9D59EF' }}>ARCHITECTING MASTER PLAN...</p>
        </div>
    );

    return (
        <div className="min-vh-100 bg-white text-dark py-5 px-3">
            <div className="container py-5 text-start">
                
                <div className="mb-5">
                    <span className="badge mb-3 px-3 py-1 fw-bold" style={{ background: '#f5f0ff', color: '#9D59EF', borderRadius: '50px', fontSize: '0.7rem' }}>
                        INDIVIDUAL_GROWTH_PLAN_v3.0
                    </span>
                    <h1 className="display-4 fw-bold text-dark mb-2">AI Strategy Roadmap.</h1>
                    <p style={{ color: '#71717a' }} className="fs-5">Optimized intervention framework powered by situational analysis.</p>
                </div>

                <div className="mx-auto mt-5" style={{ maxWidth: '800px' }}>
                    {steps.map((item, i) => (
                        <div key={i} className="d-flex mb-5 position-relative">
                            <div 
                                className="flex-shrink-0 d-flex align-items-center justify-content-center shadow" 
                                style={{ 
                                    width: '56px', height: '56px', 
                                    background: '#9D59EF', color: '#fff', 
                                    borderRadius: '50%', zIndex: 2, 
                                    fontSize: '1.4rem', fontWeight: '900' 
                                }}
                            >
                                {i + 1}
                            </div>

                            <div className="ms-4 p-4 shadow-sm w-100" 
                                 style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e4e7' }}>
                                <h4 className="fw-bold mb-3 text-uppercase" style={{ color: '#9D59EF', letterSpacing: '1px' }}>
                                    {item.title}
                                </h4>
                                <p className="m-0 fs-6 lh-base text-dark opacity-75 fw-normal">
                                    {item.description}
                                </p>
                            </div>

                            {i < steps.length - 1 && (
                                <div 
                                    className="position-absolute" 
                                    style={{ 
                                        left: '27px', top: '56px', 
                                        width: '2px', height: '80px', 
                                        background: 'linear-gradient(180deg, #9D59EF 0%, rgba(157, 89, 239, 0) 100%)' 
                                    }}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-5 opacity-25">
                    <p className="small text-uppercase ls-widest text-dark fw-bold">
                        Cognitive Evaluation Complete • End-to-End Encrypted Analysis
                    </p>
                </div>
            </div>
        </div>
    );
}