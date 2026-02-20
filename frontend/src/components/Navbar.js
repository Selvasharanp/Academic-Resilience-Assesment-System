import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    
    // Check if the user has completed at least one test
    const hasHistory = localStorage.getItem('hasHistory') === 'true';

    const navLinks = [
        { name: 'Analysis', path: '/student-dashboard' },
        { name: 'Roadmap', path: '/roadmap' },
        { name: 'Benchmarks', path: '/benchmarks' },
        { name: 'History', path: '/history' }
    ];

    const logout = () => { 
        localStorage.clear(); 
        navigate('/login'); 
    };

    return (
        /* BACKGROUND CHANGED TO WHITE, BORDER TO SOFT GRAY */
        <nav className="navbar navbar-expand-lg border-bottom border-zinc-200 py-3 bg-white sticky-top shadow-sm">
            <div className="container">
                <Link 
                    className="navbar-brand fw-bold text-dark fs-4" 
                    to={hasHistory ? "/student-dashboard" : "/welcome"}
                    style={{ letterSpacing: '-0.5px' }}
                >
                    {/* SYSTEM TEXT COLOR CHANGED TO PURPLE */}
                    RESILIENCE<span style={{ color: '#9D59EF', marginLeft: '2px' }}>SYSTEM</span>
                </Link>

                {/* THE RESPONSIVE BURGER BUTTON - COLOR CHANGED TO DARK */}
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#saasNavbar">
                    <i className="bi bi-list text-dark fs-1"></i>
                </button>

                <div className="collapse navbar-collapse" id="saasNavbar">
                    {token && (
                        <>
                            <ul className="navbar-nav mx-auto gap-lg-4 mt-3 mt-lg-0">
                                {hasHistory && navLinks.map(link => (
                                    <li key={link.path}>
                                        <Link 
                                            className={`nav-link fw-bold px-0 ${location.pathname === link.path ? 'active' : ''}`} 
                                            to={link.path} 
                                            style={{ 
                                                fontSize: '0.75rem', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '1.2px',
                                                /* ACTIVE COLOR CHANGED TO PURPLE, INACTIVE TO GRAY */
                                                color: location.pathname === link.path ? '#9D59EF' : '#71717a',
                                                borderBottom: location.pathname === link.path ? '2px solid #9D59EF' : 'none'
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0">
                                {hasHistory && (
                                    /* BUTTON STYLE NOW HANDLED BY btn-neon PURPLE VERSION IN APP.CSS */
                                    <button className="btn btn-neon btn-sm px-4 fw-bold shadow-sm" onClick={() => navigate('/welcome')}>
                                        Retake Test
                                    </button>
                                )}
                                <button className="btn btn-link text-muted text-decoration-none small fw-bold" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}