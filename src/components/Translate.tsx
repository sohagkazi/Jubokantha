"use client"

import React, { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '../../public/locales/en.json';

const cache: Record<string, string> = { ...enTranslations };
let pending: string[] = [];
let resolvers: Record<string, ((val: string) => void)[]> = {};
let timeout: any = null;

async function processBatch() {
  const textsToTranslate = [...pending];
  pending = [];
  const currentResolvers = { ...resolvers };
  resolvers = {};

  try {
    const res = await fetch(getApiUrl('/api/translate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: textsToTranslate, targetLang: 'en' })
    });
    const data = await res.json();
    const translations = data.translations || textsToTranslate;

    if (typeof window !== 'undefined') {
      try {
        const localCache = JSON.parse(localStorage.getItem('translation_cache') || '{}');
        textsToTranslate.forEach((text, i) => {
          const trans = translations[i] || text;
          cache[text] = trans;
          localCache[text] = trans;
        });
        localStorage.setItem('translation_cache', JSON.stringify(localCache));
      } catch (e) {
        console.error("Cache error", e);
      }
    }

    textsToTranslate.forEach((text, i) => {
      const translated = translations[i] || text;
      if (currentResolvers[text]) {
        currentResolvers[text].forEach(r => r(translated));
      }
    });
  } catch (err) {
    textsToTranslate.forEach(text => {
      if (currentResolvers[text]) {
        currentResolvers[text].forEach(r => r(text));
      }
    });
  }
}

export async function getTranslation(text: string, lang: string): Promise<string> {
  if (lang === 'bn' || !text) return text;
  if (cache[text]) return cache[text];
  
  if (typeof window !== 'undefined') {
    try {
      const localCache = localStorage.getItem('translation_cache');
      if (localCache) {
        const parsed = JSON.parse(localCache);
        if (parsed[text]) {
           cache[text] = parsed[text];
           return parsed[text];
        }
      }
    } catch (e) {}
  }

  return new Promise((resolve) => {
    if (!resolvers[text]) {
      resolvers[text] = [];
      pending.push(text);
    }
    resolvers[text].push(resolve);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(processBatch, 100);
  });
}

interface TranslateProps {
  children: React.ReactNode;
}

export function Translate({ children }: TranslateProps) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const originalText = typeof children === 'string' ? children : null;

  useEffect(() => {
    if (!originalText || language === 'bn') {
      setTranslatedText(null);
      return;
    }
    
    let isMounted = true;
    getTranslation(originalText, language).then(translated => {
      if (isMounted) setTranslatedText(translated);
    });
    
    return () => { isMounted = false; };
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
    if (!text || language === 'bn') {
      setTranslatedText(text);
      return;
    }

    let isMounted = true;
    getTranslation(text, language).then(translated => {
      if (isMounted) setTranslatedText(translated);
    });
    
    return () => { isMounted = false; };
  }, [language, text]);

  return translatedText;
}
