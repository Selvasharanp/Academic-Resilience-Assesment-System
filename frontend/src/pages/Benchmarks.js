import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export default function Benchmarks() {
    const { t } = useLanguage();
    const [latest, setLatest] = useState(null);
    const [global, setGlobal] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const fetchBenchmarkData = async () => {
            try {
                const resLatest = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/user-result/${userId}`);
                const resGlobal = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/global-stats`);
                setLatest(resLatest.data);
                setGlobal(resGlobal.data);
                setLoading(false);
            } catch (err) {
                console.error("Benchmark sync error");
                setLoading(false);
            }
        };
        fetchBenchmarkData();
    }, []);
    if (loading) return (
        /* LOADING STATE UPDATED TO LIGHT THEME */
        <div className="vh-100 bg-white d-flex flex-column align-items-center justify-content-center text-dark font-monospace">
             <div className="spinner-border mb-4" style={{ color: '#9D59EF' }} role="status"></div>
             <span style={{ color: '#9D59EF', fontWeight: 'bold' }}>{t('benchmarksPage.loading')}</span>
        </div>
    );
    if (!latest) return null;
    return (
        /* BACKGROUND CHANGED TO WHITE, TEXT TO DARK CHARCOAL */
        <div className="min-vh-100 bg-white text-dark py-5 px-3">
            <div className="container py-5 text-start">                
                {/* Header Area */}
                <div className="mb-5">
                    <span className="badge mb-3 px-3 py-1 fw-bold" style={{ background: '#f5f0ff', color: '#9D59EF', borderRadius: '50px', fontSize: '0.7rem', letterSpacing: '1px' }}>
                        {t('benchmarksPage.badge')}
                    </span>
                    <h1 className="display-4 fw-bold text-dark mb-2">{t('benchmarksPage.title')}</h1>
                    <p style={{ color: '#71717a' }} className="fs-5">{t('benchmarksPage.subtitle')}</p>
                </div>
                {/* Benchmark Chart Card - LIGHT SAAS LOOK */}
                <div className="aras-card border-0 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7', padding: '40px', borderRadius: '24px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h5 className="fw-bold text-dark m-0">{t('benchmarksPage.chartTitle')}</h5>
                        <div className="d-flex gap-3">
                            <div className="d-flex align-items-center">
                                {/* LEGEND ICON COLOR CHANGED TO PURPLE */}
                                <div style={{ width: '12px', height: '12px', background: '#9D59EF', borderRadius: '2px', marginRight: '8px' }}></div>
                                <span className="small fw-bold uppercase ls-wide text-muted" style={{ fontSize: '0.6rem' }}>{t('common.you')}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <div style={{ width: '12px', height: '12px', background: '#e4e4e7', borderRadius: '2px', marginRight: '8px' }}></div>
                                <span className="small fw-bold uppercase ls-wide text-muted" style={{ fontSize: '0.6rem' }}>{t('common.globalAvg')}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '450px' }}>
                        <Bar data={{
                            labels: ['PERSEVERANCE', 'HELP-SEEKING', 'EMOTIONAL REG.'],
                            datasets: [
                                { 
                                    label: t('common.you').toUpperCase(), 
                                    data: [latest.perseverance, latest.helpSeeking, latest.negativeAffect], 
                                    /* BAR COLOR CHANGED TO PURPLE */
                                    backgroundColor: '#9D59EF', 
                                    borderRadius: 6,
                                    barThickness: 45
                                },
                                { 
                                    label: t('benchmarksPage.average'),
                                    data: [global?.avgPerseverance || 40, global?.avgHelpSeeking || 30, global?.avgNegativeAffect || 20], 
                                    backgroundColor: '#f4f4f5', // Light Zinc for contrast
                                    borderRadius: 6,
                                    barThickness: 45
                                }
                            ]
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
                                    suggestedMax: 50, 
                                    ticks: { color: '#71717a', font: { size: 10 } } 
                                } 
                            } 
                        }} />
                    </div>
                </div>
                {/* Bottom Insight Box */}
                <div className="mt-5 p-4 rounded-4 shadow-sm" style={{ background: '#f5f0ff', border: '1px solid rgba(157, 89, 239, 0.2)' }}>
                    <p className="m-0 small lh-lg text-dark fw-medium">
                        <i className="bi bi-info-circle-fill me-2" style={{ color: '#9D59EF' }}></i>
                        <strong>{t('benchmarksPage.insightLabel')}</strong> {t('benchmarksPage.insightText')}
                    </p>
                </div>
            </div>
        </div>
    );
}
