import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Welcome() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Student';
    const { t } = useLanguage();
    const aiTitle = t('welcome.aiTitle');
    const welcomeSubtitle = t('welcome.subtitle');
    const [subtitleStart, subtitleEnd] = welcomeSubtitle.includes(aiTitle)
        ? welcomeSubtitle.split(aiTitle)
        : [welcomeSubtitle, ''];
    const fullText = t('welcome.greeting', { name: userName });
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedText('');

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
        if (type === 'ai') navigate('/simulator-quiz');
        else navigate('/quiz');
    };

    return (
        <div className="container-fluid min-vh-100 bg-white text-dark d-flex align-items-center justify-content-center py-5">
            <div className="text-center" style={{ maxWidth: '850px' }}>
                <h1 className="display-2 fw-bold mb-3 ls-tight text-dark" style={{ minHeight: '1.2em' }}>
                    {displayedText}
                </h1>

                <p className="lead mb-5 mx-auto" style={{ color: '#71717a', maxWidth: '600px', fontWeight: '400' }}>
                    {subtitleStart}<span style={{ color: '#9D59EF', fontWeight: 'bold' }}>{aiTitle}</span>{subtitleEnd}
                </p>

                <div className="row g-4 px-3">
                    <div className="col-md-6">
                        <div className="aras-card h-100 text-center d-flex flex-column shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '40px' }}>
                            <div className="mb-4">
                                <h4 className="fw-bold mb-3 text-dark">{t('welcome.standardTitle')}</h4>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {t('welcome.standardDescription')}
                                </p>
                            </div>
                            <button onClick={() => handleStart('standard')} className="btn btn-outline-neon w-100 mt-auto py-3 fw-bold">
                                {t('welcome.standardAction')}
                            </button>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="aras-card h-100 text-center d-flex flex-column shadow-sm" style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '40px' }}>
                            <div className="mb-4">
                                <div className="d-inline-block mb-3 px-2 py-1 rounded fw-bold" style={{ fontSize: '0.6rem', background: '#f5f0ff', color: '#9D59EF' }}>
                                    {t('welcome.aiBadge')}
                                </div>
                                <h4 className="fw-bold mb-3 text-dark">{aiTitle}</h4>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {t('welcome.aiDescription')}
                                </p>
                            </div>
                            <button onClick={() => handleStart('ai')} className="btn btn-neon w-100 mt-auto py-3 fw-bold shadow">
                                {t('welcome.aiAction')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 opacity-50">
                    <p className="small ls-widest text-uppercase" style={{ fontSize: '0.6rem', color: '#18181b', letterSpacing: '2px' }}>
                        {t('welcome.footer')}
                    </p>
                </div>
            </div>
        </div>
    );
}
