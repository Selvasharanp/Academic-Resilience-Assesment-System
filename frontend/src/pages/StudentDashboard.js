import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function StudentDashboard() {
    const { t } = useLanguage();
    const [latest, setLatest] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'ai', text: t('dashboard.introMessage') }
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const [isRequestingMic, setIsRequestingMic] = useState(false);
    const [supportResources, setSupportResources] = useState([]);
    const [supportLevel, setSupportLevel] = useState('standard');
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const supportsSpeechRecognition = typeof window !== 'undefined'
        && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    const supportsMicrophone = typeof navigator !== 'undefined'
        && navigator.mediaDevices
        && typeof navigator.mediaDevices.getUserMedia === 'function';

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/user-result/${userId}`);
                setLatest(res.data);
            } catch (err) {
                console.error('Error fetching analysis:', err);
            }
        };

        const fetchSupportResources = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai-support/support-resources`);
                setSupportResources(res.data.helplines || []);
            } catch (err) {
                console.error('Error fetching support resources:', err);
            }
        };

        if (userId) {
            fetchAnalysis();
        }

        fetchSupportResources();
    }, [userId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (latest && latest.totalScore <= 60 && supportResources.length > 0) {
            setSupportLevel('urgent');
        }
    }, [latest, supportResources]);

    useEffect(() => () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speakReply = (text) => {
        if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const sendMessage = async (text) => {
        if (!text.trim()) {
            return;
        }

        setSpeechError('');
        setMessages((prev) => [...prev, { sender: 'user', text }]);
        setUserInput('');
        setIsChatLoading(true);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai-support/chat`, { message: text });
            const reply = res.data.reply || t('dashboard.chatFallback');

            setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);

            if (res.data.supportLevel) {
                setSupportLevel(res.data.supportLevel);
            }

            if (Array.isArray(res.data.helplines) && res.data.helplines.length > 0) {
                setSupportResources(res.data.helplines);
            }

            speakReply(reply);
        } catch (err) {
            const fallback = t('dashboard.chatError');
            setMessages((prev) => [...prev, { sender: 'ai', text: fallback }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChat = async (e) => {
        e.preventDefault();
        await sendMessage(userInput);
    };

    const getSpeechErrorMessage = (event) => {
        switch (event?.error) {
            case 'not-allowed':
            case 'service-not-allowed':
                return t('dashboard.speechErrors.blocked');
            case 'audio-capture':
                return t('dashboard.speechErrors.noMic');
            case 'network':
                return t('dashboard.speechErrors.network');
            case 'no-speech':
                return t('dashboard.speechErrors.noSpeech');
            default:
                return t('dashboard.speechErrors.default');
        }
    };

    const requestMicrophoneAccess = async () => {
        if (!supportsMicrophone) {
            throw new Error('unsupported-microphone');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
    };

    const handleVoiceInput = async () => {
        if (!supportsSpeechRecognition) {
            setSpeechError(t('dashboard.speechErrors.unsupportedBrowser'));
            return;
        }

        if (!supportsMicrophone) {
            setSpeechError(t('dashboard.speechErrors.unsupportedMic'));
            return;
        }

        if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
            setSpeechError(t('dashboard.speechErrors.insecure'));
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setSpeechError('');
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
                setIsRequestingMic(false);
            };

            recognition.onerror = (event) => {
                setSpeechError(getSpeechErrorMessage(event));
                setIsListening(false);
                setIsRequestingMic(false);
            };

            recognition.onresult = async (event) => {
                const transcript = event.results?.[0]?.[0]?.transcript || '';
                setUserInput(transcript);
                await sendMessage(transcript);
            };

            recognitionRef.current = recognition;
        }

        if (isListening) {
            recognitionRef.current.stop();
            return;
        }

        setSpeechError('');
        setIsRequestingMic(true);

        try {
            await requestMicrophoneAccess();
            recognitionRef.current.start();
        } catch (err) {
            const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
            const unavailable = err?.name === 'NotFoundError' || err?.message === 'unsupported-microphone';

            if (denied) {
                setSpeechError(t('dashboard.speechErrors.denied'));
            } else if (unavailable) {
                setSpeechError(t('dashboard.speechErrors.unavailable'));
            } else {
                setSpeechError(t('dashboard.speechErrors.setupFailed'));
            }

            setIsListening(false);
            setIsRequestingMic(false);
        }
    };

    if (!latest) {
        return (
            <div className="vh-100 bg-white d-flex align-items-center justify-content-center text-dark">
                <div className="spinner-border" style={{ color: '#9D59EF' }}></div>
            </div>
        );
    }

    const shouldShowSupportCard = supportLevel === 'urgent' || latest.totalScore <= 60;

    return (
        <div className="min-vh-100 bg-white text-dark py-5">
            <div className="container py-4 text-start">
                <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                    <div>
                        <h6 className="fw-bold mb-2 uppercase ls-widest" style={{ color: '#9D59EF', fontSize: '0.75rem' }}>{t('dashboard.overview')}</h6>
                        <h1 className="display-4 fw-bold text-dark m-0" style={{ letterSpacing: '-2px' }}>{t('dashboard.title')}</h1>
                        <p className="fs-5 mt-2" style={{ color: '#71717a' }}>
                            {t('dashboard.profile')} <span style={{ color: '#9D59EF', fontWeight: 'bold' }}>{userName}</span>
                        </p>
                    </div>
                    <Link to="/support" className="btn btn-outline-neon fw-bold px-4 py-3">
                        {t('dashboard.emergencySupport')}
                    </Link>
                </div>

                {shouldShowSupportCard && (
                    <div className="p-4 rounded-4 shadow-sm mb-4" style={{ background: '#fff7ed', border: '1px solid #fdba74' }}>
                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                            <div>
                                <h5 className="fw-bold mb-2" style={{ color: '#9a3412' }}>{t('dashboard.supportTitle')}</h5>
                                <p className="m-0" style={{ color: '#7c2d12', lineHeight: '1.7' }}>
                                    {t('dashboard.supportText')}
                                </p>
                            </div>
                            <Link to="/support" className="btn btn-neon fw-bold px-4">
                                {t('dashboard.openHelplines')}
                            </Link>
                        </div>
                        <div className="row g-3 mt-2">
                            {supportResources.slice(0, 2).map((resource) => (
                                <div key={resource.id} className="col-12 col-md-6">
                                    <div className="p-3 rounded-4 bg-white h-100" style={{ border: '1px solid #fed7aa' }}>
                                        <div className="small fw-bold text-uppercase mb-2" style={{ color: '#c2410c', letterSpacing: '1px' }}>
                                            {resource.title}
                                        </div>
                                        <div className="fw-bold fs-5" style={{ color: '#9D59EF' }}>{resource.phone}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="aras-card shadow-sm h-100" style={{ background: '#ffffff', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid #e4e4e7' }}>
                            <div className="d-flex justify-content-between mb-5">
                                <h5 className="fw-bold text-dark m-0 uppercase ls-wide">{t('dashboard.dimensionBalance')}</h5>
                                <span className="badge px-3 py-1 fw-bold d-none d-sm-inline-block" style={{ border: '1px solid #9D59EF', color: '#9D59EF', borderRadius: '50px', fontSize: '0.6rem' }}>LIVE_DATA_v4.0</span>
                            </div>
                            <div style={{ height: '400px', width: '100%' }}>
                                <Radar
                                    data={{
                                        labels: [t('dashboard.dimensions.perseverance'), t('dashboard.dimensions.helpSeeking'), t('dashboard.dimensions.emotionalReg')],
                                        datasets: [{
                                            data: [latest.perseverance, latest.helpSeeking, latest.negativeAffect],
                                            backgroundColor: 'rgba(157, 89, 239, 0.1)',
                                            borderColor: '#9D59EF',
                                            borderWidth: 3,
                                            pointBackgroundColor: '#9D59EF',
                                            pointRadius: 5
                                        }]
                                    }}
                                    options={{
                                        scales: {
                                            r: {
                                                grid: { color: '#e4e4e7' },
                                                angleLines: { color: '#e4e4e7' },
                                                pointLabels: { color: '#18181b', font: { size: 10, weight: 'bold' } },
                                                ticks: { display: false },
                                                suggestedMax: 50
                                            }
                                        },
                                        plugins: { legend: { display: false } },
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="text-center rounded-4 shadow-sm border-0" style={{ background: '#9D59EF', padding: 'clamp(30px, 5vw, 45px)' }}>
                                    <h6 className="fw-bold mb-3 ls-widest text-white opacity-75 uppercase" style={{ fontSize: '0.7rem' }}>{t('dashboard.overallIndex')}</h6>
                                    <h1 className="display-1 fw-bold text-white" style={{ letterSpacing: '-5px', lineHeight: '1' }}>{latest.totalScore}</h1>
                                    <div className="mt-4 pt-4 border-top border-white border-opacity-20">
                                        <p className="text-white fw-bold small uppercase m-0 ls-tight">
                                            {t('dashboard.subjectCapacity')} <span className="opacity-75">{latest.totalScore > 90 ? t('dashboard.optimal') : t('dashboard.developing')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="p-4 rounded-4 shadow-sm border-0 h-100" style={{ background: '#fbfbfe', border: '1px solid #e4e4e7' }}>
                                    <div className="d-flex align-items-center mb-3 text-start">
                                        <i className="bi bi-cpu-fill fs-4 me-3" style={{ color: '#9D59EF' }}></i>
                                        <h6 className="fw-bold text-dark mb-0 uppercase ls-wide small">{t('dashboard.aiSync')}</h6>
                                    </div>
                                    <p className="lh-lg text-muted m-0 text-start" style={{ fontSize: '0.85rem' }}>
                                        {t('dashboard.aiSyncText')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="position-fixed bottom-0 end-0 m-2 m-md-4 d-flex flex-column align-items-end" style={{ zIndex: 6000 }}>
                {showChat && (
                    <div className="card border-0 mb-3 shadow-lg rounded-4 overflow-hidden" style={{ width: 'min(380px, 95vw)', background: '#ffffff', border: '1px solid #e4e4e7' }}>
                        <div className="p-3 text-white fw-bold small d-flex justify-content-between align-items-center" style={{ background: '#9D59EF' }}>
                            <span className="ls-widest uppercase">{t('dashboard.mentorTitle')}</span>
                            <button className="btn-close btn-close-white" onClick={() => setShowChat(false)}></button>
                        </div>

                        <div className="px-3 pt-3 pb-2 border-bottom bg-white">
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-neon d-flex align-items-center gap-2"
                                    onClick={handleVoiceInput}
                                >
                                    <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
                                    {isListening ? t('dashboard.listening') : isRequestingMic ? t('dashboard.starting') : t('dashboard.speak')}
                                </button>
                                <Link to="/support" className="btn btn-outline-neon d-flex align-items-center gap-2">
                                    <i className="bi bi-telephone-fill"></i>
                                    {t('dashboard.helplines')}
                                </Link>
                            </div>
                            {speechError && (
                                <div className="small mt-2" style={{ color: '#b91c1c' }}>{speechError}</div>
                            )}
                        </div>

                        <div className="p-3 overflow-auto d-flex flex-column" style={{ height: '350px', background: '#fbfbfe' }}>
                            {messages.map((m, i) => (
                                <div key={i} className={`mb-3 ${m.sender === 'user' ? 'text-end' : 'text-start'}`}>
                                    <div
                                        className="d-inline-block px-3 py-2 rounded-4 small shadow-sm"
                                        style={{
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
                            {isChatLoading && <div className="text-start small fw-bold" style={{ color: '#9D59EF' }}>{t('dashboard.consulting')}</div>}
                            {supportLevel === 'urgent' && supportResources.length > 0 && (
                                <div className="p-3 rounded-4 mt-2" style={{ background: '#fff7ed', border: '1px solid #fdba74' }}>
                                    <div className="fw-bold mb-2" style={{ color: '#9a3412' }}>{t('dashboard.urgentPrompt')}</div>
                                    {supportResources.slice(0, 2).map((resource) => (
                                        <div key={resource.id} className="small mb-2" style={{ color: '#7c2d12' }}>
                                            <strong>{resource.title}:</strong> {resource.phone}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleChat} className="p-3 border-top bg-white d-flex gap-2">
                            <input
                                type="text"
                                className="form-control border-0 bg-light rounded-pill px-4 shadow-none small"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t('dashboard.typePlaceholder')}
                                style={{ background: '#f4f4f5', fontSize: '0.85rem' }}
                            />
                            <button
                                className="btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                type="submit"
                                style={{ background: '#9D59EF', color: '#fff', width: '40px', height: '40px', border: 'none' }}
                            >
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </form>
                    </div>
                )}

                <div
                    className="p-1 rounded-pill shadow-lg d-flex align-items-center transition-all px-2 px-md-3"
                    style={{ background: '#9D59EF', cursor: 'pointer', height: '60px' }}
                    onClick={() => setShowChat(!showChat)}
                >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                        <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-magic'} fs-5`} style={{ color: '#9D59EF' }}></i>
                    </div>
                    <span className="text-white fw-bold ms-2 ms-md-3 d-none d-sm-block" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                        {isListening ? t('dashboard.listening').toUpperCase() : t('dashboard.mentorTitle').toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}
