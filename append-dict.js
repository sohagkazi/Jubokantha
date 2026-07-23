const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

async function updateDict() {
  const file = './public/locales/en.json';
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));

  const newTexts = [
    'আমাদের লক্ষ্য (Vision)',
    'সমাজের সুবিধা বঞ্চিত মানুষের জীবন যাত্রার মান উন্নয়ন করা।',
    'আমাদের উদ্দেশ্য (Mission)',
    'সমাজে নারীদেরকে তাদের নিজস্ব প্রচেষ্টার মাধ্যমে স্বাবলম্বী করার প্রচেষ্টা চালানো।',
    'দরিদ্র পরিবারের ছেলে-মেয়েদেরকে শিক্ষা গ্রহণে আগ্রহী করে তোলা এবং পরিবারের সদস্যদেরকে শিশুদের স্কুলে পাঠানোর ব্যাপারে সচেতন করা।',
    'এই লক্ষ্য এবং উদ্দেশ্যকে সামনে রেখে যুবকণ্ঠ সোসাইটি তার কার্যক্রম পরিচালনা করে চলেছে।'
  ];

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Translate the following JSON array of Bengali strings into English. Maintain the exact same array length and order. Output ONLY a valid JSON array of strings without any markdown, explanations, THOUGHT blocks, or extra text. Input: ${JSON.stringify(newTexts)}`;
  
  const res = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are a batch translation API. Output ONLY a valid JSON array of strings.',
      temperature: 0.1
    }
  });
  
  let rawOutput = res.text.trim();
  const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
  if (jsonMatch) rawOutput = jsonMatch[0];
  
  const translations = JSON.parse(rawOutput);
  
  newTexts.forEach((text, i) => {
    dict[text] = translations[i];
  });

  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
  console.log('Translations added successfully.');
}

updateDict().catch(console.error);
