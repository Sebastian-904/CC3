import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations } from '../lib/translations';

type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const storedLang = localStorage.getItem('appLanguage') as Language | null;
        return storedLang || 'es'; // Default to Spanish
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = useCallback((key: TranslationKey, fallback?: string) => {
        // This nested key access is a bit unsafe, but works for the current flat structure.
        // A more robust solution would use a getter function.
        const translationSet = translations[language] as Record<TranslationKey, string>;
        return translationSet[key] || fallback || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};