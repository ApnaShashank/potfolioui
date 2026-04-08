"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Portfolio',
    budget: 'Not Specified',
    message: ''
  });

  useGSAP(() => {
    gsap.from(".reveal-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out"
    });

    gsap.from(".reveal-form", {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power3.out"
    });
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "bc225779-9708-4728-a43f-196ab5756245",
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          budget: formData.budget,
          message: formData.message,
          subject: "New Project Inquiry from Portfolio",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        gsap.from(".success-reveal", {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)"
        });
      } else {
        setError(result.message || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Web3Forms Error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <main ref={container} className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ccff00_0%,transparent_70%)]"></div>
        <div className="success-reveal relative z-10">
          <CheckCircle2 size={120} className="text-accent mx-auto mb-12 animate-pulse" />
          <h1 className="font-unbounded text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            THANK <br /> <span className="text-accent">YOU</span>
          </h1>
          <p className="font-body text-xl text-white/50 max-w-lg mx-auto mb-16 leading-relaxed">
            Your message has been received. I'll get back to you within 24 hours. Stay Iconic.
          </p>
          <Link href="/" className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-unbounded font-bold text-lg hover:bg-accent transition-colors">
            <ArrowLeft size={20} /> BACK TO BASE
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main ref={container} className="min-h-screen bg-[#030303] text-white p-6 lg:p-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <nav className="relative z-20 mb-20">
        <Link href="/" className="group flex items-center gap-4 font-mono text-xs uppercase tracking-[4px] text-white/40 hover:text-accent transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Home
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        <div>
          <div className="overflow-hidden mb-8">
            <h1 className="reveal-text font-unbounded text-6xl lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
              START A <br /> 
              <span className="text-accent">PROJECT</span>
            </h1>
          </div>
          <p className="reveal-form font-body text-xl lg:text-2xl text-white/40 leading-relaxed max-w-md">
            Have a vision? Let's turn it into a digital masterpiece. Fill out the form and let's start the journey.
          </p>
          
          <div className="mt-20 space-y-8 reveal-form">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-mono text-accent">01</div>
              <p className="font-unbounded font-bold text-lg">Discovery Call</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-mono text-accent">02</div>
              <p className="font-unbounded font-bold text-lg">Concept Design</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-mono text-accent">03</div>
              <p className="font-unbounded font-bold text-lg">Iconic Launch</p>
            </div>
          </div>
        </div>

        <div className="reveal-form">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 bg-[#0a0a0a] p-10 lg:p-16 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[3px] text-white/30 ml-2">Your Name</label>
                <input 
                  required
                  suppressHydrationWarning
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Shashank Gupta"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium"
                />
              </div>
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[3px] text-white/30 ml-2">Email Address</label>
                <input 
                  required
                  suppressHydrationWarning
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@iconic.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[3px] text-white/30 ml-2">Project Type</label>
                <select 
                  name="projectType"
                  suppressHydrationWarning
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-accent focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="Portfolio" className="bg-[#0a0a0a]">Portfolio</option>
                  <option value="Business Website" className="bg-[#0a0a0a]">Business Website</option>
                  <option value="Landing Page" className="bg-[#0a0a0a]">Landing Page</option>
                  <option value="UI Design" className="bg-[#0a0a0a]">UI Design</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[3px] text-white/30 ml-2">Budget Range</label>
                <select 
                  name="budget"
                  suppressHydrationWarning
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-accent focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="Not Specified" className="bg-[#0a0a0a]">Select Budget (Optional)</option>
                  <option value="$1k - $3k" className="bg-[#0a0a0a]">$1k - $3k</option>
                  <option value="$3k - $7k" className="bg-[#0a0a0a]">$3k - $7k</option>
                  <option value="$10k+" className="bg-[#0a0a0a]">$10k+</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-[3px] text-white/30 ml-2">Project Details</label>
              <textarea 
                required
                suppressHydrationWarning
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your amazing project..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium resize-none"
              ></textarea>
            </div>

            {error && <p className="text-red-500 font-mono text-xs">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent text-black font-unbounded font-black py-8 rounded-[2rem] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center gap-4">
                {isSubmitting ? "SENDING..." : "LAUNCH PROJECT"} 
                <Send size={20} className={isSubmitting ? "animate-bounce" : "group-hover/btn:translate-x-2 transition-transform"} />
              </span>
            </button>
            
            <p className="text-center font-mono text-[9px] uppercase tracking-[2px] text-white/20">
              By submitting, you agree to start something legendary.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
