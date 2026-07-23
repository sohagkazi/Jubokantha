const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const texts = ['আমাদের পথচলা', 'আমাদের মিশন'];
  const prompt = `Translate the following JSON array of strings into English. Maintain the exact same array length and order. Output ONLY a valid JSON array of strings without any markdown, explanations, THOUGHT blocks, or extra text. Input: ${JSON.stringify(texts)}`;
  const res = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are a batch translation API. Output ONLY a valid JSON array of strings. No markdown, no THOUGHT blocks.',
      temperature: 0.1
    }
  });
  console.log("Raw output:");
  console.log(res.text);

  let rawOutput = res.text.trim();
  const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    rawOutput = jsonMatch[0];
  }
  console.log("Extracted JSON:");
  console.log(rawOutput);
}
test().catch(console.error);
