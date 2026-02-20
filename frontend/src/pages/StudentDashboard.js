import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function StudentDashboard() {
    const [latest, setLatest] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([{ sender: 'ai', text: "Systems online. I am your resilience guide. How can I help you today?" }]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/assessment/user-result/${userId}`).then(res => setLatest(res.data));
    }, [userId]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleChat = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        const newMsgs = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMsgs);
        setUserInput("");
        setIsChatLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai-support/chat', { message: userInput });
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch { 
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm experiencing a high load. Please continue focusing on your resilience goals." }]); 
        }
        setIsChatLoading(false);
    };

    if (!latest) return (
        /* LOADING SPINNER CHANGED TO PURPLE */
        <div className="vh-100 bg-white d-flex align-items-center justify-content-center text-dark">
            <div className="spinner-border" style={{ color: '#9D59EF' }}></div>
        </div>
    );

    return (
        /* MAIN BACKGROUND CHANGED TO LIGHT GRAY/WHITE */
        <div className="min-vh-100 bg-white text-dark py-5">
            <div className="container py-4 text-start">
                
                {/* Header Section */}
                <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                    <div>
                        {/* TEXT ACCENT CHANGED TO PURPLE */}
                        <h6 className="fw-bold mb-2 uppercase ls-widest" style={{ color: '#9D59EF', fontSize: '0.75rem' }}>Analytical Overview</h6>
                        <h1 className="display-4 fw-bold text-dark m-0" style={{ letterSpacing: '-2px' }}>Performance Dashboard.</h1>
                        <p className="fs-5 mt-2" style={{ color: '#71717a' }}>Diagnostic Profile: <span style={{ color: '#9D59EF', fontWeight: 'bold' }}>{userName}</span></p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left: Radar Analytics */}
                    <div className="col-12 col-lg-8">
                        <div className="aras-card shadow-sm h-100" style={{ background: '#ffffff', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid #e4e4e7' }}>
                            <div className="d-flex justify-content-between mb-5">
                                <h5 className="fw-bold text-dark m-0 uppercase ls-wide">Dimension Balance</h5>
                                <span className="badge px-3 py-1 fw-bold d-none d-sm-inline-block" style={{ border: '1px solid #9D59EF', color: '#9D59EF', borderRadius: '50px', fontSize: '0.6rem' }}>LIVE_DATA_v4.0</span>
                            </div>
                            <div style={{ height: '400px', width: '100%' }}>
                                <Radar data={{
                                    labels: ['PERSEVERANCE', 'HELP-SEEKING', 'EMOTIONAL REG.'],
                                    datasets: [{ 
                                        data: [latest.perseverance, latest.helpSeeking, latest.negativeAffect], 
                                        /* COLORS UPDATED TO PURPLE */
                                        backgroundColor: 'rgba(157, 89, 239, 0.1)', 
                                        borderColor: '#9D59EF', 
                                        borderWidth: 3,
                                        pointBackgroundColor: '#9D59EF',
                                        pointRadius: 5
                                    }]
                                }} options={{ 
                                    scales: { r: { grid: { color: '#e4e4e7' }, angleLines: { color: '#e4e4e7' }, pointLabels: { color: '#18181b', font: { size: 10, weight: 'bold' } }, ticks: { display: false }, suggestedMax: 50 } }, 
                                    plugins: { legend: { display: false } }, maintainAspectRatio: false 
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Primary Indices */}
                    <div className="col-12 col-lg-4">
                        <div className="row g-4">
                            {/* SCORE CARD: CHANGED TO PURPLE BACKGROUND */}
                            <div className="col-12">
                                <div className="text-center rounded-4 shadow-sm border-0" style={{ background: '#9D59EF', padding: 'clamp(30px, 5vw, 45px)' }}>
                                    <h6 className="fw-bold mb-3 ls-widest text-white opacity-75 uppercase" style={{ fontSize: '0.7rem' }}>OVERALL RESILIENCE INDEX</h6>
                                    <h1 className="display-1 fw-bold text-white" style={{ letterSpacing: '-5px', lineHeight: '1' }}>{latest.totalScore}</h1>
                                    <div className="mt-4 pt-4 border-top border-white border-opacity-20">
                                        <p className="text-white fw-bold small uppercase m-0 ls-tight">Subject Capacity: <span className="opacity-75">{latest.totalScore > 90 ? 'OPTIMAL' : 'DEVELOPING'}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* INSIGHTS BOX */}
                            <div className="col-12">
                                <div className="p-4 rounded-4 shadow-sm border-0 h-100" style={{ background: '#fbfbfe', border: '1px solid #e4e4e7' }}>
                                    <div className="d-flex align-items-center mb-3 text-start">
                                        {/* ICON COLOR CHANGED TO PURPLE */}
                                        <i className="bi bi-cpu-fill fs-4 me-3" style={{ color: '#9D59EF' }}></i>
                                        <h6 className="fw-bold text-dark mb-0 uppercase ls-wide small">AI Intelligence Sync</h6>
                                    </div>
                                    <p className="lh-lg text-muted m-0 text-start" style={{ fontSize: '0.85rem' }}>
                                        Based on your high index in <span className="text-dark fw-bold">PERSEVERANCE</span>, you show exceptional stamina. AI suggests navigating to the **ROADMAP** tab to optimize your help-seeking strategy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FIXED NOTION-STYLE CHATBOT --- */}
            <div className="position-fixed bottom-0 end-0 m-2 m-md-4 d-flex flex-column align-items-end" style={{ zIndex: 6000 }}>
                {showChat && (
                    <div className="card border-0 mb-3 shadow-lg rounded-4 overflow-hidden" 
                         style={{ width: 'min(380px, 95vw)', background: '#ffffff', border: '1px solid #e4e4e7' }}>
                        
                        {/* HEADER CHANGED TO PURPLE */}
                        <div className="p-3 text-white fw-bold small d-flex justify-content-between align-items-center" style={{ background: '#9D59EF' }}>
                            <span className="ls-widest uppercase">Assistant_AI</span> 
                            <button className="btn-close btn-close-white" onClick={()=>setShowChat(false)}></button>
                        </div>

                        <div className="p-3 overflow-auto d-flex flex-column" style={{ height: '350px', background: '#fbfbfe' }}>
                            {messages.map((m, i) => (
                                <div key={i} className={`mb-3 ${m.sender === 'user' ? 'text-end' : 'text-start'}`}>
                                    <div 
                                        className="d-inline-block px-3 py-2 rounded-4 small shadow-sm"
                                        style={{ 
                                            /* COLORS ADJUSTED FOR LIGHT THEME */
                                            background: m.sender === 'user' ? '#9D59EF' : '#ffffff',
                                            color: m.sender === 'user' ? '#fff' : '#18181b',
                                            border: m.sender === 'user' ? 'none' : '1px solid #e4e4e7',
                                            lineHeight: '1.5',
                                            maxWidth: '90%'
                                        }}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && <div className="text-start small fw-bold" style={{ color: '#9D59EF' }}>CONSULTING...</div>}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleChat} className="p-3 border-top bg-white d-flex gap-2">
                            <input 
                                type="text" 
                                className="form-control border-0 bg-light rounded-pill px-4 shadow-none small" 
                                value={userInput} 
                                onChange={e=>setUserInput(e.target.value)} 
                                placeholder="Share your stress..." 
                                style={{ background: '#f4f4f5', fontSize: '0.85rem' }}
                            />
                            {/* SEND BUTTON CHANGED TO PURPLE */}
                            <button className="btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" type="submit" 
                                    style={{ background: '#9D59EF', color: '#fff', width: '40px', height: '40px', border:'none' }}>
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </form>
                    </div>
                )}
                
                {/* FLOATING ACTION BUTTON UPDATED TO PURPLE */}
                <div 
                    className="p-1 rounded-pill shadow-lg d-flex align-items-center transition-all px-2 px-md-3" 
                    style={{ background: '#9D59EF', cursor: 'pointer', height: '60px' }} 
                    onClick={() => setShowChat(!showChat)}
                >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                         <i className="bi bi-magic fs-5" style={{ color: '#9D59EF' }}></i>
                    </div>
                    <span className="text-white fw-bold ms-2 ms-md-3 d-none d-sm-block" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>AI MENTOR</span>
                </div>
            </div>
        </div>
    );
}