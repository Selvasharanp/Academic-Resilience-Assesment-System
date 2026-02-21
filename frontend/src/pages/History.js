import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register the components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/user-history/${userId}`);
                setHistory(res.data);
                setLoading(false);
            } catch (err) {
                console.error("History retrieval error");
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        /* LOADING STATE UPDATED TO LIGHT THEME */
        <div className="vh-100 bg-white d-flex flex-column align-items-center justify-content-center text-dark">
            <div className="spinner-border mb-4" style={{ color: '#9D59EF' }} role="status"></div>
            <p className="fw-bold ls-widest text-uppercase small" style={{ color: '#9D59EF' }}>Retrieving Longitudinal Data...</p>
        </div>
    );

    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK CHARCOAL */
        <div className="min-vh-100 bg-white text-dark py-5 px-3">
            <div className="container py-5 text-start">
                
                {/* Section Header */}
                <div className="mb-5">
                    <h1 className="display-4 fw-bold text-dark mb-2">Resilience History.</h1>
                    <p style={{ color: '#71717a' }} className="fs-5">Tracking your adaptive behavioral growth across diagnostic cycles.</p>
                </div>

                {/* History Line Chart Card - LIGHT SAAS LOOK */}
                <div className="aras-card border-0 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7', padding: '40px', borderRadius: '24px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h5 className="fw-bold text-dark m-0">Score Evolution Path</h5>
                        <div className="px-3 py-1 rounded bg-light text-muted small fw-bold uppercase ls-wide" style={{ fontSize: '0.6rem', border: '1px solid #e4e4e7' }}>
                            TOTAL_TESTS: {history.length}
                        </div>
                    </div>

                    <div style={{ height: '450px' }}>
                        <Line data={{
                            labels: history.map((_, i) => `Cycle ${i + 1}`),
                            datasets: [{ 
                                label: 'Index Score', 
                                data: history.map(h => h.totalScore), 
                                /* LINE COLOR CHANGED TO PURPLE */
                                borderColor: '#9D59EF', 
                                borderWidth: 3,
                                tension: 0.4, 
                                fill: true, 
                                /* SUBTLE LAVENDER GLOW */
                                backgroundColor: 'rgba(157, 89, 239, 0.05)', 
                                pointBackgroundColor: '#ffffff',
                                pointBorderColor: '#9D59EF',
                                pointBorderWidth: 3,
                                pointRadius: 5,
                                pointHoverRadius: 8
                            }]
                        }} options={{ 
                            maintainAspectRatio: false, 
                            plugins: { 
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#ffffff',
                                    titleColor: '#18181b',
                                    bodyColor: '#18181b',
                                    padding: 12,
                                    borderColor: '#e4e4e7',
                                    borderWidth: 1,
                                    displayColors: false,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            },
                            scales: { 
                                x: { 
                                    grid: { display: false }, 
                                    ticks: { color: '#71717a', font: { size: 10, weight: 'bold' } } 
                                }, 
                                y: { 
                                    grid: { color: '#f4f4f5' }, 
                                    ticks: { color: '#71717a', font: { size: 10 } },
                                    suggestedMin: 0,
                                    suggestedMax: 150
                                } 
                            } 
                        }} />
                    </div>
                </div>

                {/* Bottom Context Info */}
                <div className="mt-5 p-4 rounded-4 shadow-sm" style={{ background: '#fbfbfe', border: '1px solid #e4e4e7' }}>
                    <div className="row align-items-center text-start">
                        <div className="col-md-8">
                            <p className="m-0 small lh-lg" style={{ color: '#71717a' }}>
                                <strong style={{ color: '#18181b' }}>Longitudinal Data:</strong> Your resilience trajectory is based on multiple data points. A rising curve indicates a successful integration of help-seeking and perseverance strategies into your academic routine.
                            </p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            {/* ACCENT COLOR CHANGED TO PURPLE */}
                            <span style={{ color: '#9D59EF', fontSize: '0.65rem' }} className="fw-bold text-uppercase ls-widest">
                                Dataset: Secure Behavioral Cloud
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}