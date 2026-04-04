import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supportedLanguages, translations } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'arasLanguage';

function getValueByPath(object, path) {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), object);
}

function interpolate(template, variables = {}) {
    return Object.entries(variables).reduce(
        (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
        template
    );
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, language);
    }, [language]);

    const value = useMemo(() => {
        const t = (path, variables) => {
            const current = getValueByPath(translations[language], path);
            const fallback = getValueByPath(translations.en, path);
            const resolved = current ?? fallback ?? path;

            return typeof resolved === 'string' ? interpolate(resolved, variables) : resolved;
        };

        return {
            language,
            setLanguage,
            t,
            supportedLanguages
        };
    }, [language]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
}
