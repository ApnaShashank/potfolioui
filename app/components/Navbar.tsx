"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#archive' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 py-2 ${scrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className={`relative flex items-center justify-between bg-tertiary-fixed/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500`}>
          
          {/* 1. Branding Segment — High Contrast */}
          <div className="flex items-center gap-3 px-6 py-2 border-r border-white/10 group cursor-pointer hover:bg-tertiary-fixed/10 transition-colors">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-black group-hover:rotate-12 transition-all shadow-[0_0_15px_rgba(163,255,18,0.3)]">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-headline font-black text-xl tracking-tighter text-white whitespace-nowrap">
              APNA<span className="text-tertiary-fixed opacity-100">SHASHANK</span>
            </span>
          </div>

          {/* 2. Middle Spacer (Instead of Links) */}
          <div className="hidden lg:flex flex-grow h-full items-center justify-center">
            <div className="w-full h-[1px] bg-white/5 mx-10"></div>
          </div>

          {/* 3. Static CTA Action Segment */}
          <div className="flex items-center px-4">
            <button className="relative h-10 px-6 bg-white/5 border border-white/20 rounded-full flex items-center justify-center gap-3 transition-opacity hover:opacity-80">
              <span className="font-headline font-black text-[10px] tracking-widest uppercase text-white">
                LET'S CONNECT
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary-fixed">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Toggle (Simplified) */}
          <div className="lg:hidden flex items-center px-4 border-l border-white/10">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-on-surface p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-0 bg-surface z-[-1] transition-transform duration-700 pt-32 px-10 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 mb-8">
            <Zap className="text-tertiary-fixed" />
            <span className="font-headline font-black text-3xl tracking-tighter">APNA<span className="text-tertiary-fixed">SHASHANK</span></span>
          </div>
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-headline font-black text-4xl tracking-tighter hover:text-tertiary-fixed transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="mt-8 pt-8 border-t border-outline-variant/10">
             <button className="w-full py-5 bg-tertiary-fixed text-primary rounded-xl font-headline font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              LET'S TALK
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
