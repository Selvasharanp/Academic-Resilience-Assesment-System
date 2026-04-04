import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ compact = false }) {
    const { language, setLanguage, supportedLanguages, t } = useLanguage();

    return (
        <div className={`d-flex align-items-center gap-2 ${compact ? '' : 'flex-wrap'}`}>
            {!compact && (
                <span className="small fw-bold text-uppercase" style={{ color: '#71717a', letterSpacing: '1px' }}>
                    {t('common.language')}
                </span>
            )}
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select form-select-sm shadow-none"
                style={{
                    width: compact ? '110px' : '140px',
                    borderRadius: '999px',
                    border: '1px solid #e4e4e7',
                    backgroundColor: '#ffffff',
                    color: '#18181b'
                }}
            >
                {supportedLanguages.map((item) => (
                    <option key={item.code} value={item.code}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
