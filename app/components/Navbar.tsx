"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        if (!isScrolled) setIsScrolled(true);
      } else {
        if (isScrolled) setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isScrolled || !navRef.current) return;
      const nav = navRef.current;
      const cx = window.innerWidth / 2;
      const cy = 100; // Pivot near top

      // Subtle tilt
      const rx = (e.clientY - cy) * 0.02;
      const ry = (e.clientX - cx) * 0.02;

      // Constrain
      const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

      nav.style.transform = `translateX(-50%) perspective(1000px) rotateX(${-clamp(rx, -10, 10)}deg) rotateY(${clamp(ry, -10, 10)}deg)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isScrolled]);

  // Hacker Text Effect
  useEffect(() => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const links = document.querySelectorAll<HTMLElement>('[data-text]');
    
    // Store intervals to clear them
    const intervals = new Map<HTMLElement, NodeJS.Timeout>();

    const onMouseEnter = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        let iter = 0;
        const original = target.dataset.text || "";
        
        if (intervals.has(target)) clearInterval(intervals.get(target)!);

        const interval = setInterval(() => {
            target.innerText = original.split("")
                .map((l, i) => {
                    if (i < iter) return original[i];
                    return alpha[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iter >= original.length) {
                clearInterval(interval);
                target.innerText = original;
            }
            iter += 1 / 3;
        }, 30);
        
        intervals.set(target, interval);
    };

    const onMouseLeave = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (intervals.has(target)) clearInterval(intervals.get(target)!);
        target.innerText = target.dataset.text || "";
    };

    links.forEach(link => {
        link.addEventListener('mouseenter', onMouseEnter);
        link.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
        links.forEach(link => {
            link.removeEventListener('mouseenter', onMouseEnter);
            link.removeEventListener('mouseleave', onMouseLeave);
            if (intervals.has(link)) clearInterval(intervals.get(link)!);
        });
    };
  }, []);

  return (
    <>
      <nav 
        ref={navRef}
        className={`brutal-nav ${isScrolled ? 'scrolled' : ''}`}
        style={!isScrolled ? { transform: 'none' } : undefined}
      >
        <a href="#home" className="nav-logo magnetic">APNASHASHANK</a>
        
        <ul className="nav-menu">
            <li><a href="#archive" className="nav-link magnetic" data-text="WORK">WORK</a></li>
            <li><a href="#about" className="nav-link magnetic" data-text="ABOUT">ABOUT</a></li>
            <li><a href="#services" className="nav-link magnetic" data-text="SERVICES">SERVICES</a></li>
        </ul>
        
        <a href="mailto:shashank8808108802@gmail.com" className="cta-btn magnetic hidden md:block"><span>LET'S TALK</span></a>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center z-50">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 magnetic relative z-[100]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 bg-brutal-bg z-[90] transition-transform duration-700 pt-32 px-10 border-b border-white/10 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-6">
            <li><a href="#archive" onClick={() => setMobileMenuOpen(false)} className="font-space font-black text-4xl tracking-tighter hover:text-accent transition-colors text-white uppercase">Work</a></li>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)} className="font-space font-black text-4xl tracking-tighter hover:text-accent transition-colors text-white uppercase">About</a></li>
            <li><a href="#services" onClick={() => setMobileMenuOpen(false)} className="font-space font-black text-4xl tracking-tighter hover:text-accent transition-colors text-white uppercase">Services</a></li>
          </ul>
          <div className="mt-8 pt-8 border-t border-white/10">
             <a href="mailto:shashank8808108802@gmail.com" className="w-full py-5 bg-accent text-black rounded-xl font-space font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-transform active:scale-95">
              LET'S TALK
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
