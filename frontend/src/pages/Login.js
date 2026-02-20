import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userName', res.data.name);
            
            const historyRes = await axios.get(`http://localhost:5000/api/assessment/user-history/${res.data.userId}`);
            const userHasHistory = historyRes.data.length > 0;
            localStorage.setItem('hasHistory', userHasHistory ? 'true' : 'false');

            setLoading(false);

            if (!userHasHistory) {
                navigate('/welcome');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) { 
            setLoading(false);
            alert("Authorization Failure: Check your identity or access key."); 
        }
    };

    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK CHARCOAL */
        <div className="min-vh-100 bg-white text-dark d-flex align-items-center justify-content-center px-3">
            <div style={{ maxWidth: '420px', width: '100%' }}>
                
                {/* Minimal Header */}
                <div className="mb-5 text-start">
                    <h1 className="display-4 fw-bold mb-2 ls-tight text-dark" style={{ letterSpacing: '-2px' }}>
                        Sign In<span style={{ color: '#9D59EF' }}>.</span>
                    </h1>
                    <p className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        Resume your diagnostic resilience session.
                    </p>
                </div>

                {/* Main Auth Card - LIGHT VERSION */}
                <div className="p-4 rounded-4 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7' }}>
                    <form onSubmit={handleLogin}>
                        
                        {/* Email / Identity Input */}
                        <div className="mb-4 text-start">
                            <label className="fw-bold small mb-2 d-block text-dark opacity-75 uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                className="form-control py-3 text-dark shadow-none" 
                                placeholder="name@university.edu"
                                style={{ 
                                    background: '#fbfbfe', // Soft off-white
                                    border: '1px solid #e4e4e7', 
                                    borderRadius: '10px', 
                                    fontSize: '1rem' 
                                }}
                                onChange={(e)=>setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        {/* Password / Access Key Input */}
                        <div className="mb-5 text-start">
                            <label className="fw-bold small mb-2 d-block text-dark opacity-75 uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                Enter Password
                            </label>
                            <input 
                                type="password" 
                                className="form-control py-3 text-dark shadow-none" 
                                placeholder="••••••••"
                                style={{ 
                                    background: '#fbfbfe', 
                                    border: '1px solid #e4e4e7', 
                                    borderRadius: '10px', 
                                    fontSize: '1rem' 
                                }}
                                onChange={(e)=>setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        {/* THE NOTION PURPLE PRIMARY BUTTON */}
                        <button 
                            className="btn w-100 py-3 fw-bold rounded-pill shadow transition-all" 
                            style={{ 
                                background: '#9D59EF', 
                                color: '#ffffff', 
                                letterSpacing: '0.5px',
                                fontSize: '0.95rem',
                                border: 'none'
                            }} 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner-border spinner-border-sm text-white"></div>
                            ) : "AUTHORIZE ACCESS"}
                        </button>
                    </form>
                    
                    {/* Bottom Nav Link */}
                    <div className="mt-4 text-center">
                        <Link to="/signup" className="text-muted small text-decoration-none fw-bold" style={{ fontSize: '0.8rem' }}>
                            {/* ACCENT COLOR CHANGED TO PURPLE */}
                            NEW USER? <span style={{ color: '#9D59EF' }}>CREATE PROFILE</span>
                        </Link>
                    </div>
                </div>

                {/* System Footer Tag */}
                <div className="mt-5 text-center opacity-25">
                    <p className="small ls-widest text-uppercase fw-bold text-dark" style={{ fontSize: '0.6rem' }}>
                        Secured Access Protocol // ARAS_v2.4
                    </p>
                </div>

            </div>
        </div>
    );
}