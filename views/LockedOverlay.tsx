import React, { useEffect, useState } from 'react';
import { Lock, ArrowLeft, BrainCircuit } from 'lucide-react';
import { BlockSchedule, MockApp, AppView } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { formatTimeRemaining } from '../services/timeService';

interface LockedOverlayProps {
  app: MockApp | null;
  schedule: BlockSchedule;
  onExit: () => void;
  strictMode: boolean;
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({ app, schedule, onExit, strictMode }) => {
  const [quote, setQuote] = useState<string>(MOTIVATIONAL_QUOTES[0]);
  const [countdown, setCountdown] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Rotation logic for quotes or fetch new one
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // AI Quote Generation
    const fetchAIQuote = async () => {
      if (!process.env.API_KEY || !app) return;
      
      setIsThinking(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = app.category === 'Game' || app.category === 'Social' 
          ? 'gemini-3-flash-preview' // Faster
          : 'gemini-3-pro-preview'; // More reasoning for complex contexts

        const response = await ai.models.generateContent({
          model: model,
          contents: `Create a very short, punchy, aggressive motivational quote (max 15 words) in Portuguese telling someone to stop using ${app.name} and focus on their goals instead. Be strict.`,
        });
        
        if (response.text) {
          setQuote(response.text);
        }
      } catch (e) {
        console.error("AI Quote failed", e);
      } finally {
        setIsThinking(false);
      }
    };

    fetchAIQuote();

    // Countdown Timer
    const timer = setInterval(() => {
      setCountdown(formatTimeRemaining(schedule.endTime));
    }, 60000); // Update every minute
    setCountdown(formatTimeRemaining(schedule.endTime));

    return () => clearInterval(timer);
  }, [app, schedule.endTime]);

  const handleExit = () => {
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setIsExiting(true);
    setTimeout(() => {
      onExit();
    }, 800);
  };

  return (
    <div className={`fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'animate-in fade-in zoom-in duration-300'}`}>
      
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/30 animate-pulse">
        <Lock size={48} className="text-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">
        {app?.name} está bloqueado
      </h1>
      
      <p className="text-gray-400 mb-8">
        Disponível em <span className="text-white font-mono font-bold text-lg">{countdown}</span>
      </p>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl max-w-sm w-full mb-10 shadow-2xl relative overflow-hidden">
        {isThinking && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer" />
        )}
        <div className="flex justify-center mb-3 text-indigo-400">
           {isThinking ? <BrainCircuit className="animate-pulse" /> : <span className="text-4xl text-gray-700">"</span>}
        </div>
        <p className="text-lg font-medium text-gray-200 italic leading-relaxed">
          {quote}
        </p>
      </div>

      {!strictMode ? (
        <button 
          onClick={handleExit}
          disabled={isExiting}
          className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
            isExiting 
              ? 'bg-red-900/20 border-red-900/50 text-red-400 scale-95' 
              : 'text-gray-500 hover:text-white border-gray-800 hover:border-gray-600'
          }`}
        >
          <ArrowLeft size={18} className={isExiting ? 'opacity-50' : ''} />
          <span>{isExiting ? "Saindo..." : "Eu desisto, quero sair"}</span>
        </button>
      ) : (
        <div className="text-red-400 text-sm font-bold flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg">
          <Lock size={14} /> Modo Rígido Ativo: Sem saída.
        </div>
      )}
    </div>
  );
};