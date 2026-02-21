import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/register`,
    formData
);
            setLoading(false);
            navigate('/login');
        } catch (err) { 
            setLoading(false);
            alert("Protocol Failure: Email already exists."); 
        }
    };

    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK */
        <div className="min-vh-100 bg-white text-dark d-flex align-items-center justify-content-center px-3">
            <div style={{ maxWidth: '420px', width: '100%' }}>
                
                {/* Minimal Header */}
                <div className="mb-5 text-start">
                    <h1 className="display-4 fw-bold mb-2 ls-tight text-dark" style={{ letterSpacing: '-2px' }}>
                        {/* COLOR CHANGED TO NOTION PURPLE */}
                        Create Profile<span style={{ color: '#9D59EF' }}>.</span>
                    </h1>
                    <p className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        Initialise your Academic Resilience session.
                    </p>
                </div>

                {/* Ultra-Clean Card - LIGHT VERSION */}
                <div className="p-4 rounded-4 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7' }}>
                    <form onSubmit={handleSubmit}>
                        
                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="fw-bold small mb-2 d-block text-dark opacity-75 uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                className="form-control py-3 shadow-none text-dark" 
                                placeholder="e.g. John Doe"
                                style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', fontSize: '1rem' }}
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="fw-bold small mb-2 d-block text-dark opacity-75 uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                Email
                            </label>
                            <input 
                                type="email" 
                                className="form-control py-3 shadow-none text-dark" 
                                placeholder="name@university.edu"
                                style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', fontSize: '1rem' }}
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        {/* Password Field */}
                        <div className="mb-5">
                            <label className="fw-bold small mb-2 d-block text-dark opacity-75 uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                Create Password
                            </label>
                            <input 
                                type="password" 
                                className="form-control py-3 shadow-none text-dark" 
                                placeholder="••••••••"
                                style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', fontSize: '1rem' }}
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
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
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : "ESTABLISH PROFILE"}
                        </button>
                    </form>
                    
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-muted small text-decoration-none fw-bold" style={{ fontSize: '0.8rem' }}>
                            {/* ACCENT COLOR CHANGED TO PURPLE */}
                            ALREADY REGISTERED? <span style={{ color: '#9D59EF' }}>SIGN IN</span>
                        </Link>
                    </div>
                </div>

                {/* Minimal Footer */}
                <div className="mt-5 text-center opacity-25">
                    <p className="small ls-widest text-uppercase fw-bold text-dark" style={{ fontSize: '0.6rem' }}>
                        Psychometric Standard ARS-30 // RSA Secured
                    </p>
                </div>

            </div>
        </div>
    );
}