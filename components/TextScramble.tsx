"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = "!<>-_\\/[]{}—=+*^?#░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌";
const PHRASES = [
  "full stack developer",
  "ai learner",
  "vibe coder",
  "creative thinking"
];

export default function TextScramble() {
  const [text, setText] = useState("INTERACTION REDEFINED");
  const [phraseIdx, setPhraseIdx] = useState(-1);
  const scrambleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCycleRef = useRef<NodeJS.Timeout | null>(null);
  const currentTextRef = useRef(text);

  useEffect(() => {
    currentTextRef.current = text;
  }, [text]);

  const scramble = useCallback((newText: string) => {
    if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
    
    let iter = 0;
    const len = Math.max(currentTextRef.current.length, newText.length);
    
    scrambleTimerRef.current = setInterval(() => {
      const scrambled = newText
        .split("")
        .map((ch, i) => {
          if (i < iter) return newText[i];
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      
      setText(scrambled);
      
      if (iter >= len + 4) {
        if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
      }
      iter += 0.8; 
    }, 40);
  }, []);

  const triggerNext = useCallback(() => {
    setPhraseIdx(prev => {
      const nextIdx = (prev + 1) % PHRASES.length;
      scramble(PHRASES[nextIdx]);
      return nextIdx;
    });
  }, [scramble]);

  // Start auto-cycle
  useEffect(() => {
    autoCycleRef.current = setInterval(triggerNext, 3000);
    return () => {
      if (autoCycleRef.current) clearInterval(autoCycleRef.current);
      if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
    };
  }, [triggerNext]);

  const handleMouseEnter = () => {
    triggerNext();
    // Reset the auto-cycle timer so it doesn't jump immediately after hover
    if (autoCycleRef.current) {
      clearInterval(autoCycleRef.current);
      autoCycleRef.current = setInterval(triggerNext, 3000);
    }
  };

  // Initial scramble on mount
  useEffect(() => {
    scramble("INTERACTION REDEFINED");
  }, []);

  return (
    <section className="min-h-[60vh] bg-[#080808] flex flex-col items-center justify-center px-6 py-32 border-t border-[#222] relative overflow-hidden text-center">
        
        {/* Subtle background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="font-unbounded text-[15vw] font-black whitespace-nowrap tracking-tighter uppercase">REDEFINED</span>
        </div>

        <div className="z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
            <div className="mb-12">
                <span className="inline-block px-5 py-2 rounded-full border border-white/5 bg-white/5 text-accent font-mono text-[9px] uppercase tracking-[5px]">
                    Interaction Protocol
                </span>
            </div>
            
            <h2 
                onMouseEnter={handleMouseEnter}
                className="font-unbounded text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white hover:text-accent transition-colors duration-500 cursor-none max-w-6xl leading-[0.9] tracking-tighter selection:bg-accent selection:text-black uppercase"
            >
                {text}
            </h2>
            
            <p className="mt-16 font-mono text-[10px] text-white/20 uppercase tracking-[8px] animate-pulse">
                [ Protocol: Auto-Scramble Active ]
            </p>
        </div>

        {/* Dynamic Blobs for Atmosphere */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
    </section>
  );
}
