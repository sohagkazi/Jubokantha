"use client"

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '../../public/locales/en.json';

interface TranslateProps {
  children: React.ReactNode;
}

export function Translate({ children }: TranslateProps) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  // We assume children is a simple string for this basic translation wrapper.
  const originalText = typeof children === 'string' ? children : null;

  useEffect(() => {
    if (language === 'bn' || !originalText) {
      setTranslatedText(null);
      return;
    }

    if (language === 'en' && originalText) {
      const translated = (enTranslations as Record<string, string>)[originalText];
      if (translated) {
        setTranslatedText(translated);
      }
    }
  }, [language, originalText]);

  if (language === 'bn' || !originalText) {
    return <>{children}</>;
  }

  return <>{translatedText || originalText}</>;
}

export function useTranslateText(text: string) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    if (language === 'bn' || !text) {
      setTranslatedText(text);
      return;
    }

    if (language === 'en' && text) {
      const translated = (enTranslations as Record<string, string>)[text];
      if (translated) {
        setTranslatedText(translated);
      }
    }
  }, [language, text]);

  return translatedText;
}
