import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { text, texts, targetLang } = await request.json();

    if ((!text && !texts) || !targetLang) {
      return NextResponse.json({ error: 'Text(s) and targetLang are required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    let isBatch = Array.isArray(texts) && texts.length > 0;
    
    let prompt = "";
    if (isBatch) {
      prompt = `Translate the following JSON array of strings into English. Maintain the exact same array length and order. Output ONLY a valid JSON array of strings without any markdown, explanations, THOUGHT blocks, or extra text. Input: ${JSON.stringify(texts)}`;
      if (targetLang === 'bn') {
        prompt = `Translate the following JSON array of strings into Bengali. Maintain the exact same array length and order. Output ONLY a valid JSON array of strings without any markdown, explanations, THOUGHT blocks, or extra text. Input: ${JSON.stringify(texts)}`;
      }
    } else {
      prompt = `Translate the following text into English. Provide ONLY the translated text without any explanation, quotes, or formatting. Text: "${text}"`;
      if (targetLang === 'bn') {
        prompt = `Translate the following text into Bengali. Provide ONLY the translated text without any explanation, quotes, or formatting. Text: "${text}"`;
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: isBatch 
          ? "You are a batch translation API. Output ONLY a valid JSON array of strings. No markdown, no THOUGHT blocks."
          : "You are a direct translation API. You must output ONLY the final translated string. Never include any explanations, THOUGHT blocks, notes, or quotes.",
        temperature: 0.1,
      }
    });

    let rawOutput = response.text?.trim() || "";
    
    if (isBatch) {
      // Robust JSON extraction to ignore THOUGHT blocks or markdown
      const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        rawOutput = jsonMatch[0];
      }
      try {
        const translations = JSON.parse(rawOutput);
        return NextResponse.json({ translations });
      } catch (e) {
        console.error("Failed to parse batch JSON", rawOutput);
        // Fallback: return originals if parsing fails
        return NextResponse.json({ translations: texts });
      }
    } else {
      let translatedText = rawOutput || text;
      // Fallback cleanup: If the model still includes a THOUGHT block, try to remove it
      if (translatedText.includes('THOUGHT:')) {
        const parts = translatedText.split('\n');
        translatedText = parts[parts.length - 1].trim();
      }
      return NextResponse.json({ translatedText });
    }

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate', details: error?.message || String(error) }, { status: 500 });
  }
}
