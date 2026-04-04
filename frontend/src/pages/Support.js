import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const FALLBACK_RESOURCES = [
    {
        id: '988',
        title: '988 Suicide & Crisis Lifeline',
        phone: '988',
        description: 'Call or text 988 in the U.S. for immediate mental health crisis support, 24/7.',
        source: 'https://988lifeline.org/'
    },
    {
        id: 'crisis-text-line',
        title: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: 'Text with a live crisis counselor in the U.S. at any hour.',
        source: 'https://www.crisistextline.org/'
    },
    {
        id: 'samhsa',
        title: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        description: 'Treatment referral and support for mental health or substance use concerns, available 24/7.',
        source: 'https://www.samhsa.gov/find-help/national-helpline'
    }
];

export default function Support() {
    const { t } = useLanguage();
    const [resources, setResources] = useState(FALLBACK_RESOURCES);
    const [note, setNote] = useState(t('supportPage.fallbackNote'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupport = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai-support/support-resources`);
                setResources(res.data.helplines || []);
                setNote(res.data.emergencyNote || '');
            } catch (err) {
                setResources(FALLBACK_RESOURCES);
                setNote(t('supportPage.fallbackNote'));
            } finally {
                setLoading(false);
            }
        };

        fetchSupport();
    }, [t]);

    if (loading) {
        return (
            <div className="vh-100 bg-white d-flex align-items-center justify-content-center text-dark">
                <div className="spinner-border" style={{ color: '#9D59EF' }}></div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-white text-dark py-5">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2 text-uppercase" style={{ color: '#9D59EF', letterSpacing: '1.5px', fontSize: '0.75rem' }}>
                                {t('supportPage.eyebrow')}
                            </h6>
                            <h1 className="display-4 fw-bold mb-3">{t('supportPage.title')}</h1>
                            <p className="fs-5" style={{ color: '#71717a', maxWidth: '760px' }}>
                                {t('supportPage.subtitle')}
                            </p>
                        </div>

                        <div className="p-4 rounded-4 shadow-sm mb-4" style={{ background: '#fff7ed', border: '1px solid #fdba74' }}>
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', background: '#ffffff', color: '#ea580c' }}>
                                    <i className="bi bi-telephone-forward-fill fs-5"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-2">{t('supportPage.immediateDanger')}</h5>
                                    <p className="mb-0" style={{ color: '#7c2d12' }}>
                                        {note || t('supportPage.fallbackNote')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {resources.map((resource) => (
                                <div key={resource.id} className="col-12 col-md-6 col-xl-4">
                                    <div className="aras-card h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <span className="badge rounded-pill px-3 py-2" style={{ background: '#f5f0ff', color: '#9D59EF' }}>
                                                {t('common.verified')}
                                            </span>
                                            <i className="bi bi-heart-pulse-fill" style={{ color: '#9D59EF' }}></i>
                                        </div>
                                        <h4 className="fw-bold mb-3">{resource.title}</h4>
                                        <div className="mb-3 fs-4 fw-bold" style={{ color: '#9D59EF' }}>{resource.phone}</div>
                                        <p style={{ color: '#71717a', lineHeight: '1.7' }}>{resource.description}</p>
                                        <a
                                            className="btn btn-outline-neon mt-2"
                                            href={resource.source}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t('supportPage.source')}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-4 shadow-sm mt-4" style={{ background: '#fbfbfe', border: '1px solid #e4e4e7' }}>
                            <h5 className="fw-bold mb-3">{t('supportPage.whenToUse')}</h5>
                            <p className="mb-0" style={{ color: '#71717a', lineHeight: '1.8' }}>
                                {t('supportPage.whenToUseText')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
