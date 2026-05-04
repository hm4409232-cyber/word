/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Copy, Sparkles, Loader2 } from 'lucide-react';

// Initialize with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function App() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentences, setSentences] = useState<{ english: string[]; urdu: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSentences = async () => {
    if (!word.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 5 simple, clear English sentences and 5 Urdu sentences, each using the word: "${word}". Output in JSON format with fields "english" and "urdu", each being an array of 5 strings. Ensure Urdu sentences are grammatically correct.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 English sentences" },
              urdu: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 Urdu sentences" },
            },
            required: ["english", "urdu"],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      setSentences(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate sentences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#f5e9d9] text-[#4e342e] p-4 md:p-8 font-sans">
      <header className="border-b border-[#8d6e63]/30 pb-6 mb-8 flex justify-between items-center">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 italic font-serif">Linguistic Analysis v1.0</div>
      </header>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-12 tracking-tight text-center">
          Sentence Craft
        </h1>

        <div className="flex gap-3 mb-12">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a keyword..."
            className="flex-grow bg-white border border-[#8d6e63] px-6 py-4 text-xl font-serif italic focus:outline-none focus:ring-2 focus:ring-[#8d6e63]/20"
          />
          <button
            onClick={generateSentences}
            disabled={loading || !word.trim()}
            className="bg-[#c5a059] text-[#4e342e] px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#b08d48] transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Generate Sentences"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {sentences && (
          <div className="grid md:grid-cols-2 gap-px bg-[#8d6e63]/20 border border-[#8d6e63]/20">
            <section className="bg-[#f5e9d9] p-8 flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Section 01</span>
                  <h2 className="text-3xl font-serif italic">English Contexts</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(sentences.english.join('\n'))}
                  className="text-[10px] uppercase tracking-widest font-bold border border-[#8d6e63] px-3 py-1 hover:bg-[#8d6e63] hover:text-[#f5e9d9] transition-all"
                >
                  <Copy size={14} className="inline mr-1" /> Copy
                </button>
              </div>
              <ul className="space-y-4">
                {sentences.english.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-[#4e342e]/30 italic">0{i+1}.</span>
                    <p className="text-lg leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[#f5e9d9] border-t md:border-t-0 md:border-l border-[#8d6e63]/30 p-8 flex flex-col" dir="rtl">
              <div className="flex justify-between items-end mb-6">
                <button
                  onClick={() => copyToClipboard(sentences.urdu.join('\n'))}
                  className="text-[10px] uppercase tracking-widest font-bold border border-[#8d6e63] px-3 py-1 hover:bg-[#8d6e63] hover:text-[#f5e9d9] transition-all"
                >
                  <Copy size={14} className="inline ml-1" /> کاپی
                </button>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">سیکشن 02</span>
                  <h2 className="text-3xl font-serif italic">اردو جملے</h2>
                </div>
              </div>
              <ul className="space-y-4" dir="rtl">
                {sentences.urdu.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-[#4e342e]/30 italic">0{i+1}.</span>
                    <p className="text-xl leading-loose tracking-wide">{s}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
     <footer className="px-10 py-4 mt-12 border-t border-[#8d6e63]/30 flex justify-between items-center text-[9px] uppercase tracking-[0.4em] font-bold opacity-40">
        <div>Sentence Craft &copy; 2026</div>
        <div className="flex gap-4">
          <span>Language: EN / UR</span>
        </div>
      </footer>
    </div>
  );
}
