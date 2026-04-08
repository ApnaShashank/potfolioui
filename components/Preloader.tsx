"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLDivElement>(null);
  const namasteRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) return;

    const nameChars = nameRef.current?.querySelectorAll('.char');
    const roleChars = roleRef.current?.querySelectorAll('.role-char');

    if (!nameChars || !roleChars) return;

    const tl = gsap.timeline();

    // Initial State
    gsap.set([helloRef.current, namasteRef.current, identityRef.current], { opacity: 0, y: 40, filter: "blur(10px)" });
    gsap.set(nameChars, { opacity: 0, y: 15 });
    gsap.set(roleChars, { opacity: 0 });
    gsap.set([topHalfRef.current, bottomHalfRef.current], { yPercent: 0 });

    // 1. HELLO (Cursive / Artistic)
    tl.to(helloRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
      delay: 0.5
    })
    .to(helloRef.current, {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      duration: 0.6,
      delay: 0.6,
      ease: "power2.in"
    })

    // 2. नमस्ते
    .to(namasteRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out"
    })
    .to(namasteRef.current, {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      duration: 0.6,
      delay: 0.6,
      ease: "power2.in"
    })

    // 3. Identity (I am + Signature Name)
    .to(identityRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.1
    })
    .to(nameChars, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out"
    })

    // 4. Role (Space Grotesk - Typing Effect)
    .to(roleChars, {
        opacity: 1,
        duration: 0.01,
        stagger: 0.04,
        ease: "none",
        onComplete: () => {
          // CINEMATIC CURTAIN SPLIT REVEAL
          const revealTl = gsap.timeline({
            onComplete: () => setComplete(true)
          });

          // Text vanishes first nicely
          revealTl.to([identityRef.current, roleChars], {
            opacity: 0,
            y: -20,
            stagger: 0.02,
            duration: 0.5,
            ease: "power2.in"
          })
          // The Two Halves Split apart
          .to(topHalfRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut"
          }, "-=0.2")
          .to(bottomHalfRef.current, {
            yPercent: 100,
            duration: 1.2,
            ease: "expo.inOut"
          }, "<");
        }
    }, "+=0.1");

    return () => {
      tl.kill();
    };
  }, [complete]);

  if (complete) return null;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none">
      
      {/* BACKGROUND HALVES (Screen Split) */}
      <div 
        ref={topHalfRef} 
        className="absolute top-0 left-0 w-full h-[51%] bg-[#030303] border-b border-white/5 z-0"
      ></div>
      <div 
        ref={bottomHalfRef} 
        className="absolute bottom-0 left-0 w-full h-[51%] bg-[#030303] z-0"
      ></div>

      <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 z-10">
        
        {/* Stage 1: HELLO (Cursive / Signature Style) */}
        <div ref={helloRef} className="absolute font-signature text-5xl md:text-[10rem] text-white tracking-normal translate-y-[-50%] opacity-0">
          Hello
        </div>

        {/* Stage 2: नमस्ते (Kalam / Artistic Style) */}
        <div ref={namasteRef} className="absolute font-hindi text-6xl md:text-[12rem] text-accent font-bold opacity-0">
          नमस्ते
        </div>

        {/* Stage 3: I am + Name */}
        <div ref={identityRef} className="flex flex-col items-center justify-center w-full opacity-0">
            <span className="font-space text-[10px] md:text-xl text-white/40 uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4">I am</span>
            <div ref={nameRef} className="font-signature text-4xl sm:text-5xl md:text-[11rem] text-accent flex flex-wrap justify-center gap-x-1 md:gap-x-4">
                {"Shashank Gupta".split("").map((char, index) => (
                    <span key={index} className="char inline-block opacity-0" style={{ minWidth: char === " " ? "0.2em" : "auto" }}>
                        {char}
                    </span>
                ))}
            </div>
            
            {/* Stage 4: Full Stack Developer (Space Grotesk) */}
            <div ref={roleRef} className="mt-4 md:mt-10 font-space font-bold text-[10px] md:text-2xl text-white tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-70">
                {"Full Stack Developer".split("").map((char, index) => (
                    <span key={index} className="role-char inline-block opacity-0" style={{ minWidth: char === " " ? "0.2em" : "auto" }}>
                        {char}
                    </span>
                ))}
            </div>
        </div>

      </div>

      {/* Cinematic Grid Lines Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#ccff00_1px,transparent_1px)] [background-size:40px_40px] z-20"></div>
    </div>
  );
}
