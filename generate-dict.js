const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const rawTexts = require('./extracted.json'); // We will write the cleaned array to this
const cleanTexts = rawTexts.map(t => {
  // Clean up dirty regex captures
  let cleaned = t.replace(/^.*title:\s*['"]/, '');
  cleaned = cleaned.replace(/^.*label:\s*['"]/, '');
  cleaned = cleaned.trim();
  return cleaned;
}).filter(t => t && t.length > 0 && /[\u0980-\u09FF]/.test(t));

const uniqueTexts = Array.from(new Set(cleanTexts));

async function generate() {
  console.log(`Translating ${uniqueTexts.length} strings...`);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Split into chunks of 30 to avoid overwhelming the prompt
  const dict = {};
  const chunkSize = 30;
  
  for (let i = 0; i < uniqueTexts.length; i += chunkSize) {
    const chunk = uniqueTexts.slice(i, i + chunkSize);
    const prompt = `Translate the following JSON array of Bengali strings into English. Maintain the exact same array length and order. Output ONLY a valid JSON array of strings without any markdown, explanations, THOUGHT blocks, or extra text. Input: ${JSON.stringify(chunk)}`;
    
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a batch translation API. Output ONLY a valid JSON array of strings. No markdown, no THOUGHT blocks.',
          temperature: 0.1
        }
      });
      
      let rawOutput = res.text.trim();
      const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) rawOutput = jsonMatch[0];
      
      const translations = JSON.parse(rawOutput);
      
      chunk.forEach((text, index) => {
        dict[text] = translations[index] || text;
      });
      console.log(`Chunk ${i/chunkSize + 1} done.`);
    } catch (e) {
      console.error(`Error in chunk ${i/chunkSize + 1}:`, e);
      chunk.forEach((text) => dict[text] = text);
    }
  }
  
  fs.mkdirSync('./public/locales', { recursive: true });
  fs.writeFileSync('./public/locales/en.json', JSON.stringify(dict, null, 2));
  console.log('Successfully wrote en.json');
}

generate().catch(console.error);
