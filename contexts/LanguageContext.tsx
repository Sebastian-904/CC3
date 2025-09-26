import React, { createContext, ReactNode, useCallback } from 'react';
import { translations, TranslationKey } from '../lib/translations';

type Language = 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const language: Language = 'es';

    const setLanguage = () => {
        // El idioma está fijo en español, esta función no hace nada.
    };

    const t = useCallback((key: TranslationKey, fallback?: string) => {
        return translations[key] || fallback || key;
    }, []);

    const value = { language, setLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
