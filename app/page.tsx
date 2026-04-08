"use client";

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  ArrowRight, 
  Code, 
  Cpu, 
  Palette, 
  Search, 
  Layers, 
  MousePointer2, 
  CheckCircle2, 
  Smartphone,
  Star,
  Quote,
  Briefcase,
  ChevronRight,
  Globe,
  Layout,
  UserCheck,
  Zap,
  Activity,
  Workflow,
  ExternalLink,
  Mail,
  ArrowUpRight,
  Share2,
  Terminal,
  Box,
  Feather,
  Anchor,
  Bot,
  Rocket
} from 'lucide-react';
import Navbar from './components/Navbar';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

const WorldGlobe = dynamic(() => import('@/components/Globe'), { ssr: false });
import TextScramble from '@/components/TextScramble';

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);
  const aboutBlobRef = useRef<SVGSVGElement>(null);
  const aboutCursorRef = useRef<HTMLDivElement>(null);
  const [activeRow1, setActiveRow1] = useState(0); // 0 or 1
  const [activeRow2, setActiveRow2] = useState(1); // 0 or 1 (Initial Row 2 has 2nd items as big)
  const [showIframe, setShowIframe] = useState(false);
  const prototypeRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerTextRef = useRef<HTMLHeadingElement>(null);
  const footerBgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Reveal Animation
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title .char", {
      y: 120,
      opacity: 0,
      stagger: 0.05,
      duration: 1.2,
      ease: "power4.out",
    }).from(".hero-badge", {
      scale: 0,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)",
      clearProps: "all" // Ensure GSAP doesn't leave lingering inline styles that might conflict
    }, "-=0.8").from(".hero-cta", {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
    }, "-=0.5");

    // Magnetic Badges Optimization (using quickTo for high performance)
    const badges = document.querySelectorAll(".hero-badge");
    
    // Setup quickTo for each badge to prevent tween buildup
    const badgeAnimations = Array.from(badges).map(badge => ({
      element: badge,
      xTo: gsap.quickTo(badge, "x", { duration: 0.4, ease: "power2.out" }),
      yTo: gsap.quickTo(badge, "y", { duration: 0.4, ease: "power2.out" })
    }));

    const onBadgeMove = (e: MouseEvent) => {
      badgeAnimations.forEach(({ element, xTo, yTo }) => {
        const rect = element.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - bx, e.clientY - by);
        
        if (dist < 200) {
          xTo((e.clientX - bx) * 0.2);
          yTo((e.clientY - by) * 0.2);
        } else {
          xTo(0);
          yTo(0);
        }
      });
    };
    window.addEventListener("mousemove", onBadgeMove);

    // Hero SVG Spin Optimization
    gsap.to(".hero-spin-svg", {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none",
      force3D: true,
    });

    // Scroll Velocity Skew Effect
    let lastScrollTop = 0;
    let skew = 0;
    const scrollContent = document.getElementById('scroll-content');
    
    const scrollLoop = () => {
      if (scrollContent) {
        const scrollTop = window.scrollY;
        const velocity = scrollTop - lastScrollTop;
        lastScrollTop = scrollTop;
  
        const maxSkew = 5.0;
        const speed = Math.min(Math.max(velocity * 0.1, -maxSkew), maxSkew);
  
        skew += (speed - skew) * 0.1;
  
        if (Math.abs(skew) > 0.01) {
          scrollContent.style.transform = `skewY(${skew}deg) translateZ(0)`;
        } else {
          scrollContent.style.transform = `translateZ(0)`;
        }
      }
      requestAnimationFrame(scrollLoop);
    };
    const scrollRafId = requestAnimationFrame(scrollLoop);

    // 2. About Fluid Interaction
    if (aboutImageRef.current && aboutCursorRef.current && aboutBlobRef.current) {
      const imgBox = aboutImageRef.current;
      const cursor = aboutCursorRef.current;
      const blob = aboutBlobRef.current;

      const cursorX = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
      const cursorY = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });
      const blobX = gsap.quickTo(blob, "x", { duration: 0.6, ease: "power2.out" });
      const blobY = gsap.quickTo(blob, "y", { duration: 0.6, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        const rect = imgBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if inside bounds (though mousemove is on it, added for safety)
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          cursorX(x);
          cursorY(y);
          
          // Magnetic Pull (Blob moves 10% toward mouse)
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          blobX((x - centerX) * 0.15);
          blobY((y - centerY) * 0.15);
        }
      };

      imgBox.addEventListener("mousemove", onMove);
      imgBox.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 }));
      imgBox.addEventListener("mouseleave", () => {
        gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.3 });
        gsap.to(blob, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      });
    }

    // Scroll-driven Blob Rotation
    gsap.to(aboutBlobRef.current, {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
      rotate: 180,
      scale: 1.2,
      ease: "none",
    });

    // 3. Marquee Animation
    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1,
    });

    // 3. About Section Reveal
    gsap.from(".about-content", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // 4. Stats Counter Animation
    const stats = document.querySelectorAll(".stat-number");
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target") || "0");
      gsap.to(stat, {
        scrollTrigger: {
          trigger: stat,
          start: "top 90%",
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
      });
    });

    // 5. Skills Grid Reveal
    gsap.from(".skill-card", {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // 6. Services Reveal
    gsap.from(".service-card", {
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });

    // 7. Tools Pop-in
    gsap.from(".tool-icon", {
      scrollTrigger: {
        trigger: ".tools-section",
        start: "top 85%",
      },
      scale: 0.5,
      opacity: 0,
      stagger: {
        each: 0.05,
        grid: "auto",
        from: "center",
      },
      duration: 0.6,
      ease: "back.out(2)",
    });

    // 8. Process Line Drawing
    gsap.from(".process-line", {
      scrollTrigger: {
        trigger: ".process-section",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1.5,
      },
      scaleY: 0,
      transformOrigin: "top",
      ease: "none",
    });

    // 9. Case Study Parallax
    gsap.to(".case-study-img", {
      scrollTrigger: {
        trigger: ".case-study-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: -100,
      ease: "none",
    });

    // 10. Portfolio Image Zoom
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) => {
      const img = item.querySelector("img");
      gsap.to(img, {
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          scrub: true,
        },
        scale: 1.1,
        ease: "none",
      });
    });

    // 11. Prototype Internal Scroll (Disabled for direct interaction)
    /*
    gsap.to(".prototype-iframe", {
      scrollTrigger: {
        trigger: ".prototype-section",
        start: "top center",
        end: "bottom center",
        scrub: 1.5,
      },
      yPercent: -75,
      ease: "none",
    });
    */

    // 12. Testimonials horizontal loop
    const testiWrapper = document.querySelector(".testi-inner");
    if (testiWrapper) {
      gsap.to(testiWrapper, {
        xPercent: -50,
        ease: "none",
        duration: 20, // Sped up the animation significantly
        repeat: -1,
        force3D: true, // Forces hardware acceleration to prevent blur
      });
    }

    // 13. Experience Items Stagger
    gsap.from(".experience-item", {
      scrollTrigger: {
        trigger: ".experience-section",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
    });

    // 14. Footer Section Unified Parallax
    if (footerRef.current && footerTextRef.current && footerBgRef.current) {
      const fBox = footerRef.current;
      const fText = footerTextRef.current;
      const fBg = footerBgRef.current;

      const textX = gsap.quickTo(fText, "x", { duration: 0.5, ease: "power2.out" });
      const textY = gsap.quickTo(fText, "y", { duration: 0.5, ease: "power2.out" });
      const bgX = gsap.quickTo(fBg, "x", { duration: 0.8, ease: "power2.out" });
      const bgY = gsap.quickTo(fBg, "y", { duration: 0.8, ease: "power2.out" });

      const onFooterMove = (e: MouseEvent) => {
        const rect = fBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Text follows mouse (subtle 10% move)
        textX((x - centerX) * 0.1);
        textY((y - centerY) * 0.1);

        // Background moves OPPOSITE (subtle 5% negative move)
        bgX((x - centerX) * -0.05);
        bgY((y - centerY) * -0.05);
      };

      fBox.addEventListener("mousemove", onFooterMove);
      fBox.addEventListener("mouseleave", () => {
        gsap.to(fText, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        gsap.to(fBg, { x: 0, y: 0, duration: 1, ease: "power2.out" });
      });
    }

    // 17. Skills Section Entrance (CSS-driven via ScrollTrigger)
    gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card, i) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          delay: i * 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // 16. About Typing Effect
    gsap.to(".typing-char", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 70%",
      },
      opacity: 1,
      stagger: 0.04,
      duration: 0.05,
      ease: "none",
    });

    // Blinking Cursor
    gsap.to(".typing-cursor", {
      opacity: 0,
      repeat: -1,
      duration: 0.5,
      ease: "steps(1)",
    });

    // Fade out cursor after typing
    gsap.to(".typing-cursor", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 70%",
      },
      opacity: 0,
      duration: 0.1,
      delay: (0.04 * 51) + 0.5, // Approx length * stagger + buffer
    });

    // 15. Footer Links Entrance
    gsap.from(".footer-link", {
      scrollTrigger: {
        trigger: "footer",
        start: "top 95%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
    });

    // Iframe Lazy Loading Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before reaching it
    );

    if (prototypeRef.current) {
      observer.observe(prototypeRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", onBadgeMove);
      cancelAnimationFrame(scrollRafId);
      observer.disconnect();
    };

  }, { scope: container });

  return (
    <>
      <Navbar />
      <main ref={container} className="bg-brutal-bg text-brutal-fg overflow-hidden">
      <div id="scroll-content">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 lg:pt-0 px-10 lg:px-24 mb-20">
        {/* Layered Background Blobs - Optimized (Removed expensive blur, used radial gradient) */}
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(204,255,0,0.06)_0%,transparent_60%)] rounded-full animate-float opacity-80 pointer-events-none" style={{ willChange: 'transform' }}></div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 preserve-3d">
          <div className="perspective-1000 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="hero-title group flex flex-col items-center lg:items-start font-unbounded text-[clamp(2.5rem,7vw,6.5rem)] font-black leading-[0.9] tracking-tighter uppercase text-white mb-8 transition-all">
              <div className="relative">
                {"SHASHANK"}
              </div>
              <div className="relative text-accent">
                {"GUPTA"}
              </div>
            </h1>
            
            <p className="font-space text-sm lg:text-base text-white/50 max-w-md mb-10 leading-relaxed uppercase tracking-widest px-4 lg:px-0">
                Full Stack Developer & AI Learner <br/>
                Crafting clean, interactive, and user-first digital experiences.
            </p>
          </div>
          <div className="relative flex justify-center items-center py-12 lg:py-0">
            <div className="relative">
                {/* Central Portrait Layer */}
                <div className="relative w-[85vw] max-w-[340px] lg:w-[420px] aspect-[4/5] bg-[#111] rounded-[3rem] overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,1)] z-20 border border-white/10">
                  <Image 
                    src="https://ik.imagekit.io/DEMOPROJECT/main-img.webp" 
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 mix-blend-luminosity group-hover:mix-blend-normal"
                    alt="Shashank Gupta Portrait"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                </div>

                {/* Floating Badges Layer */}
                <FloatingBadge text="Full Stack Dev" icon={<Zap size={14}/>} className="top-[5%] -left-[2%] lg:-left-[15%] bg-black/60 text-white border-white/20 backdrop-blur-2xl z-50" />
                <FloatingBadge text="System Architect" icon={<Code size={14}/>} className="top-[35%] -right-[5%] lg:-right-[20%] bg-black/60 text-white border-white/20 backdrop-blur-2xl z-50" />
                <FloatingBadge text="Mobile Engineer" icon={<Smartphone size={14}/>} className="bottom-[25%] -left-[5%] lg:-left-[20%] bg-black/60 text-white border-white/20 backdrop-blur-2xl z-50" />
                <FloatingBadge text="AI Research" icon={<Cpu size={14}/>} className="bottom-[12%] -right-[2%] lg:-right-[15%] bg-accent text-black border-accent/30 backdrop-blur-2xl z-50" />
                
                {/* Dynamic SVG Layer - Optimized (Removed blur, added will-change) */}
                <div className="absolute w-[180%] h-[180%] -top-[40%] -left-[40%] -z-10 opacity-60 pointer-events-none bg-[radial-gradient(circle,rgba(204,255,0,0.08)_0%,transparent_60%)] rounded-full"></div>
                <svg className="hero-spin-svg absolute -top-20 -right-20 w-[140%] h-[140%] -z-10 opacity-30 pointer-events-none" style={{ willChange: 'transform' }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45.7,-77.6C59.1,-71.3,70.2,-59.1,77.6,-45.1C85,-31.1,88.7,-15.5,87.6,-0.6C86.5,14.3,80.7,28.6,72,40.6C63.3,52.6,51.8,62.3,38.8,69.5C25.8,76.7,11.3,81.4,-3.1,86.7C-17.5,92,-31.7,98,-45.9,94.3C-60,90.6,-74.1,77.2,-82.4,61.7C-90.7,46.2,-93.2,28.6,-92,11.5C-90.8,-5.6,-86,-22.2,-77.7,-36.8C-69.4,-51.4,-57.6,-64,-43.8,-70.1C-30,-76.2,-14.2,-75.8,0.8,-77.2C15.8,-78.6,32.3,-83.9,45.7,-77.6Z" fill="#ccff00" transform="translate(100 100)"></path>
                </svg>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 mix-blend-difference">
          <span className="font-space text-[10px] uppercase tracking-[6px] text-white opacity-60">Scroll</span>
          <div className="w-[1px] h-24 relative overflow-hidden bg-white/20 rounded-full">
            <div className="absolute top-0 left-0 w-full h-full bg-accent origin-top animate-scroll-line"></div>
          </div>
        </div>
        
        {/* Brutalist Tape Wrapper */}
        <div className="absolute bottom-12 left-[-10%] w-[120%] bg-accent text-black -rotate-[3deg] py-4 border-y-4 border-black shadow-2xl z-30 pointer-events-none">
            <div className="font-syncopate text-2xl lg:text-3xl font-black whitespace-nowrap animate-tape-scroll tracking-widest">
                UI DESIGN ✦ FRONTEND ✦ INTERACTIONS ✦ PERFORMANCE ✦ USER EXPERIENCE ✦ CREATIVE DEV ✦ UI DESIGN ✦ FRONTEND ✦ INTERACTIONS ✦ PERFORMANCE ✦ USER EXPERIENCE ✦ CREATIVE DEV ✦
            </div>
        </div>
      </section>

      {/* 2. Brutalist Text Section 1 */}
      <section className="min-h-[70vh] bg-[#080808] flex items-center px-6 py-20 lg:p-[10vw] border-t border-[#222]">
          <p className="font-space font-light text-[clamp(2rem,5vw,4rem)] leading-[1.1] text-[#444] max-w-6xl">
              WE BUILD <span className="text-white font-bold">DIGITAL EXPERIENCES</span> THAT DEFY GRAVITY. NO TEMPLATES. NO LIMITS. JUST <span className="text-white font-bold">PURE CODE</span> AND <span className="text-white font-bold">RAW AESTHETICS</span>.
          </p>
      </section>

      {/* 2. Interaction Section (Scramble) */}
      <TextScramble />
      </div>

      {/* 2. Marquee Section */}
      <div className="py-16 bg-[#030303] border-y border-white/5 overflow-hidden relative">
        <div className="marquee-inner flex gap-24 items-center whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10">FIGMA</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10 text-accent">●</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10">NEXT.JS</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10 text-accent">●</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10">GSAP</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10 text-accent">●</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10">SPLINE</span>
              <span className="font-headline text-4xl lg:text-6xl font-black tracking-tighter opacity-10 text-accent">●</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. About Section */}
      <section className="about-section py-32 px-6 lg:px-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div ref={aboutImageRef} className="about-image relative group cursor-none">
            <div className="absolute -inset-4 bg-tertiary-fixed/5 rounded-[4rem] blur-2xl group-hover:bg-tertiary-fixed/10 transition-all duration-700"></div>
            <div className="relative aspect-square bg-[#111] rounded-[4rem] p-12 overflow-hidden flex items-center justify-center">
              {/* Fluid Blob */}
              <svg ref={aboutBlobRef} className="w-full h-full opacity-20 will-change-transform" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,76.5,-43.3C83.5,-29.2,86.1,-12.8,83.9,2.8C81.7,18.4,74.7,33.2,64.8,45.8C54.9,58.4,42.1,68.8,27.8,74.4C13.5,80.1,-2.3,81,-17.8,77.5C-33.3,74,-48.5,66.1,-60.2,54.4C-71.9,42.7,-80,27.2,-81.8,11.1C-83.6,-5,-79,-21.7,-70.7,-35.8C-62.4,-50,-50.4,-61.6,-36.8,-68.7C-23.2,-75.8,-8.1,-78.4,7.3,-84.7C22.7,-91.1,44.7,-76.4,44.7,-76.4Z" fill="#A3FF12" transform="translate(100 100)"></path>
              </svg>
              
              {/* Static Background Pointer (optional layer) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <MousePointer2 size={120} strokeWidth={0.5} className="text-primary" />
              </div>

              {/* Ghost Cursor */}
              <div ref={aboutCursorRef} className="absolute top-0 left-0 -ml-8 -mt-8 pointer-events-none opacity-0 scale-0 z-30">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150"></div>
                  <MousePointer2 size={64} strokeWidth={1.5} className="text-primary drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="about-content">
            <h2 className="typing-text font-headline text-4xl lg:text-6xl font-bold mb-10 leading-tight">
              {"I curate interfaces that speak before they function.".split("").map((char, i) => (
                <span key={i} className="typing-char opacity-0">{char}</span>
              ))}
              <span className="typing-cursor inline-block w-[2px] h-[1em] bg-accent ml-1 translate-y-1"></span>
            </h2>
            <div className="space-y-6 font-body text-lg text-white/50 leading-relaxed mb-12">
              <p>I’m a Full Stack Developer and AI learner focused on creating clean, interactive, and user-first digital experiences.</p>
              <p>I combine design thinking with modern development to build interfaces that not only look good, but feel smooth and intuitive.</p>
              <p>Every project I work on is crafted with attention to detail, performance, and real user behavior.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="font-headline text-5xl font-black text-primary"><span className="stat-number" data-target="2">0</span>+</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-white/40 mt-3">Years Exp.</p>
              </div>
              <div>
                <p className="font-headline text-5xl font-black text-primary"><span className="stat-number" data-target="100">0</span>+</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-white/40 mt-3">Repositories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-24 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <StatBox number="10" suffix="+" label="Projects" />
          <StatBox number="5" suffix="+" label="UI Concepts Built" />
          <StatBox number="100" suffix="%" label="Responsive Designs" />
          <StatBox number="100" suffix="%" label="SEO Friendly" />
        </div>
      </section>

      {/* 5. Skills Section */}
      <section id="about" className="py-32 px-6 lg:px-20 bg-brutal-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl lg:text-7xl font-bold mb-6 text-white uppercase tracking-tighter">Mastering the Craft</h2>
              <p className="font-space text-lg text-white/50 uppercase tracking-widest leading-relaxed">Blending technical mastery with creative intuition to build high-performance digital products.</p>
            </div>
          </div>
          
          <div className="skills-grid grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
            <SkillCard 
              span="lg:col-span-4 lg:row-span-2" 
              icon={<Palette size={36} />} 
              title="UI Design" 
              description="Clean, modern interfaces focused on usability and aesthetics." 
              skills={['Figma', 'UI/UX', 'Design Systems']} 
            />
            <SkillCard 
              span="lg:col-span-2 lg:row-span-1" 
              icon={<Search size={36} />} 
              title="UX Strategy" 
              description="Designing user flows that improve engagement and clarity." 
              skills={['User Flows', 'Research']} 
            />
            <SkillCard 
              span="lg:col-span-2 lg:row-span-1" 
              icon={<Cpu size={36} />} 
              title="Interaction Design" 
              description="Creating smooth animations and micro-interactions." 
              skills={['GSAP', 'Motion']} 
            />
            <SkillCard 
              span="lg:col-span-3 lg:row-span-1" 
              icon={<Code size={36} />} 
              title="Frontend Development" 
              description="Building responsive, fast websites using HTML, CSS, JS, React." 
              skills={['React', 'Next.js', 'Typescript']} 
            />
            <SkillCard 
              span="lg:col-span-3 lg:row-span-1" 
              icon={<MousePointer2 size={36} />} 
              title="Prototyping" 
              description="Turning ideas into interactive prototypes using Figma." 
              skills={['Figma', 'Lottie']} 
            />
          </div>
        </div>
      </section>

      {/* 6. Services Section */}
      <section id="services" className="services-section py-32 px-6 lg:px-20 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 text-center md:text-left gap-8">
            <h2 className="font-headline text-4xl lg:text-7xl font-bold text-white uppercase tracking-tighter">Solutions Provided</h2>
            <a href="mailto:shashank8808108802@gmail.com" className="interactive group flex items-center gap-4 font-syncopate font-bold text-xl text-accent hover:text-white transition-colors">
              Request a Custom Solution
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<Layout size={40} className="text-primary" />}
              title="Product OS Design"
              description="Building full-scale design systems that empower teams to ship faster with consistent visual quality."
              points={['Atomic Design Systems', 'Component Libraries', 'Documentation']}
            />
            <ServiceCard 
              icon={<Zap size={40} className="text-secondary-fixed-dim" />}
              title="Identity & Branding"
              description="Crafting digital-first identities that resonate with Gen-Z and modern creative markets."
              points={['Visual Direction', 'Micro-branding', 'Motion Guidelines']}
            />
          </div>
        </div>
      </section>

      {/* 7. Tools Section */}
      <section className="tools-section py-32 px-6 lg:px-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline text-3xl font-bold mb-6 opacity-30 uppercase tracking-[10px]">The Arsenal</h2>
          <p className="font-body text-xl text-white/50 mb-16 max-w-2xl mx-auto tracking-wide">
            Tools & technologies I use to craft digital experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-10 lg:gap-14">
            {/* Standard Technologies */}
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=html" alt="HTML5" className="w-[50px] h-[50px]" />} label="HTML5" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=css" alt="CSS3" className="w-[50px] h-[50px]" />} label="CSS3" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=js" alt="JS" className="w-[50px] h-[50px]" />} label="JavaScript" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind" className="w-[50px] h-[50px]" />} label="Tailwind CSS" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=react" alt="React" className="w-[50px] h-[50px]" />} label="React.js" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=next" alt="Next" className="w-[50px] h-[50px]" />} label="Next.js" />
            
            {/* Motion & Design */}
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=gsap" alt="GSAP" className="w-[50px] h-[50px]" />} label="GSAP" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=framer" alt="Framer" className="w-[50px] h-[50px]" />} label="Framer Motion" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=figma" alt="Figma" className="w-[50px] h-[50px]" />} label="Figma" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=canva" alt="Canva" className="w-[50px] h-[50px]" />} label="Canva" />
            
            {/* Backend & Systems */}
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" className="w-[50px] h-[50px]" />} label="MongoDB" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=py" alt="Python" className="w-[50px] h-[50px]" />} label="Python" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=git" alt="Git" className="w-[50px] h-[50px]" />} label="Git" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=github" alt="GitHub" className="w-[50px] h-[50px]" />} label="GitHub" />
            <ToolItem icon={<img src="https://skillicons.dev/icons?i=supabase" alt="Supabase" className="w-[50px] h-[50px]" />} label="Supabase" />
            
            {/* Custom / AI Tools */}
            <ToolItem icon={<Bot size={50} strokeWidth={2} />} label="Google Stitch" />
            <ToolItem icon={<Rocket size={50} strokeWidth={2} />} label="Antigravity" />
          </div>
        </div>
      </section>

      {/* 8. Process Section */}
      <section className="process-section py-40 px-6 lg:px-20 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between flex-wrap gap-8 items-end mb-24">
             <h2 className="font-unbounded text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
               The<br/><span className="text-accent">Method</span>
             </h2>
             <p className="font-mono text-[10px] uppercase tracking-[4px] text-white/30 max-w-xs text-right">
                4-Step systematic framework designed to maximize aesthetics and conversion.
             </p>
          </div>
          
          <div className="flex flex-col w-full border-t border-white/5">
            <ProcessStep num="01" title="Discovery" desc="Understanding goals, users, and project vision." />
            <ProcessStep num="02" title="Ideation" desc="Creating concepts and wireframes." />
            <ProcessStep num="03" title="Execution" desc="Designing and developing the interface." />
            <ProcessStep num="04" title="Launch" desc="Delivering optimized and ready-to-use product." />
          </div>
        </div>
      </section>

      {/* 9. Case Study Highlight */}
      <section className="case-study-section py-20 px-6 lg:px-20 bg-[#0a0a0a] text-white overflow-hidden relative border-y border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(204,255,0,0.15)_0%,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="w-full lg:w-1/2">
            <p className="font-space tracking-[4px] uppercase text-accent mb-8">Featured Case Study 2024</p>
            <h2 className="font-headline text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10">SYNAPSE <br /><span className="text-white/20">ANALYTICS</span></h2>
            <p className="font-space text-xl opacity-50 mb-12 max-w-xl uppercase tracking-widest">A high-performance AI dashboard that visualizes neural network training cycles in real-time, built for scaling engineering teams.</p>
            <a href="mailto:shashank8808108802@gmail.com" className="interactive bg-accent text-black px-10 py-6 rounded-2xl font-syncopate font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-4">
              Explore Study <ArrowRight size={20} />
            </a>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="case-study-img rounded-[4rem] overflow-hidden shadow-2xl relative z-10 rotate-3 group hover:rotate-0 transition-transform duration-700 aspect-video">
              <Image 
                src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop" 
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover" 
                alt="NeoBank Case Study" 
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tertiary-fixed/30 blur-[80px] -z-10 animate-float"></div>
          </div>
        </div>
      </section>

      {/* 10. Portfolio Showcase Grid */}
      <section id="archive" className="py-32 px-6 lg:px-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-24">
            <h2 className="font-headline text-4xl lg:text-6xl font-bold text-white">The Archive</h2>
            <p className="font-label text-xs uppercase tracking-[3px] text-white/40 pb-4">Scroll to Explore</p>
          </div>
          
          <div className="flex flex-col gap-10 lg:gap-16">
            {/* Row 1 */}
            <div className="md:flex gap-10 lg:gap-16 items-start">
              <PortfolioCard 
                span={activeRow1 === 0 ? "flex-[7]" : "flex-[5]"} 
                image="https://images.unsplash.com/photo-1618761767630-0114b392cf98?q=80&w=2070&auto=format&fit=crop" 
                title="Aura AI" 
                category="AI / Machine Learning" 
                onMouseEnter={() => setActiveRow1(0)}
              />
              <PortfolioCard 
                span={activeRow1 === 1 ? "flex-[7]" : "flex-[5] md:mt-32"} 
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
                title="Vault Stream" 
                category="Full Stack / Fintech" 
                onMouseEnter={() => setActiveRow1(1)}
              />
            </div>

            {/* Row 2 */}
            <div className="md:flex gap-10 lg:gap-16 items-start">
              <PortfolioCard 
                span={activeRow2 === 0 ? "flex-[8]" : "flex-[4]"} 
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
                title="Pulse Edge" 
                category="IoT / Web Architecture" 
                onMouseEnter={() => setActiveRow2(0)}
              />
              <PortfolioCard 
                span={activeRow2 === 1 ? "flex-[7]" : "flex-[5] md:mt-32"} 
                image="https://images.unsplash.com/photo-1551288049-bbda486c2ad0?q=80&w=2070&auto=format&fit=crop" 
                title="Cloud Core" 
                category="DevOps / Systems" 
                onMouseEnter={() => setActiveRow2(1)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. Interactive Prototypes [NEW] */}
      <section ref={prototypeRef} className="prototype-section py-32 px-6 lg:px-20 bg-[#080808] overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <h2 className="font-headline text-4xl lg:text-6xl font-bold text-white mb-8">Live Playground</h2>
            <p className="font-body text-xl text-white/50 leading-relaxed mb-12">Step into a live ecosystem of previous works. This sandbox demonstrates how I maintain fluid physics and high-end aesthetics across diverse digital platforms.</p>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Smartphone className="text-primary" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xl text-white">Spatial Transitions</h4>
                  <p className="text-white/40">Ensuring the user never feels lost during state changes.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-tertiary-fixed transition-colors">
                  <Activity className="text-primary" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xl text-white">Micro-interactions</h4>
                  <p className="text-white/40">Defining how every button clicks and every menu slides.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center py-20 relative">
            <div className="w-[300px] h-[600px] bg-black rounded-[3.5rem] p-4 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-black overflow-hidden z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-3xl z-30"></div>
              <div className="w-full h-full bg-[#111] rounded-[2.5rem] overflow-hidden relative group/phone">
                {showIframe ? (
                  <iframe 
                    src="https://shashankguptadot.vercel.app/" 
                    loading="lazy"
                    className="prototype-iframe w-[125%] h-[200%] border-none origin-top-left scale-[0.8] transition-transform"
                    title="Live Portfolio Preview"
                    style={{ width: '375px', height: '1200px' }}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/phone:opacity-100 transition-opacity pointer-events-none z-20">
                    <p className="text-white font-space text-[10px] uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">Click & Scroll inside</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-tertiary-fixed/10 blur-[120px] rounded-full -z-10"></div>
          </div>
        </div>
      </section>

      {/* 12. Testimonials Section [NEW] */}
      <section className="py-32 bg-[#030303] overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-20 text-center">
          <h2 className="font-headline text-3xl font-bold opacity-30 uppercase tracking-[15px]">Industry Trust</h2>
        </div>
        <div className="testi-inner flex gap-8 whitespace-nowrap will-change-transform [backface-visibility:hidden] [-webkit-font-smoothing:antialiased]">
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <TestimonialCard name="Sarah Jenkins" role="CEO @ FinStream" quote="One of the few designers who actually understands business goals. The UI wasn't just pretty; it actually worked." />
              <TestimonialCard name="Marcus Thorne" role="Creative Director @ Agency.X" quote="Exceptional eye for detail. The animation work on our project brought a level of polish we didn't think was possible." />
              <TestimonialCard name="Elena Rossi" role="Product Manager @ CloudScale" quote="Shashank bridges the gap between high-level strategy and pixel-perfect execution better than anyone we've worked with." />
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 13. Experience Section */}
      <section className="experience-section py-32 px-6 lg:px-20 bg-brutal-bg relative border-y border-white/5 overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-8 items-center">
          
          {/* Timeline side (Right side on desktop, top on mobile) */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1 px-4 lg:px-0">
            <h2 className="font-headline text-4xl lg:text-7xl font-bold mb-6 text-white uppercase tracking-tighter">The <span className="text-accent">Journey</span></h2>
            <p className="font-space text-[10px] lg:text-xs uppercase tracking-[5px] text-white/50 mb-16 max-w-sm">
               Rooted in India, delivering iconic digital experiences globally.
            </p>

            <div className="space-y-4">
              <ExperienceItem date="2021 — PRESENT" role="Vibe Coder / Freelancer" co="Independent Studio" loc="Delhi, India" />
              <ExperienceItem date="2018 — 2021" role="Senior UI Developer" co="Digital Alchemy" loc="New Delhi, India" />
              <ExperienceItem date="2016 — 2018" role="Interaction Designer" co="Creative Pulsar" loc="NCR, India" />
            </div>
          </div>

          {/* Globe Side (Left side on desktop, bottom on mobile) */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2 relative z-10">
            
            {/* The Globe Component */}
            <div className="relative w-full rounded-[4rem] group flex justify-center items-center">
              <WorldGlobe />

              {/* Interaction Hint */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-space text-[10px] uppercase tracking-[4px] text-white/30 pointer-events-none bg-black/40 px-4 py-2 rounded-full backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                Drag to Explore
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 14. CTA + Footer — Unified Section */}
      <footer 
        ref={footerRef}
        className="relative overflow-hidden bg-[#030303]"
      >
        {/* Dot Grid Background — Opposite Parallax */}
        <div 
          ref={footerBgRef}
          className="absolute inset-[-10%] opacity-20 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
        </div>

        {/* CTA Content — Direct Parallax */}
        <div className="relative z-10 pt-48 pb-20 px-6 lg:px-20 text-center">
          <h2 
            ref={footerTextRef}
            className="cta-reveal-text font-headline text-[clamp(4rem,15vw,10rem)] font-black text-white leading-[0.8] tracking-tighter mb-16 cursor-none"
          >
            LET'S <br /> CREATE <br /> <span className="text-accent">ICONIC</span>
          </h2>
          <Link href="/contact" className="interactive inline-block bg-accent text-black px-12 py-8 rounded-full font-syncopate font-black text-2xl hover:scale-110 transition-transform shadow-[0_0_50px_rgba(204,255,0,0.3)]">
            Built My Website
          </Link>
        </div>

        {/* Mega Name + Footer Bar */}
        <div className="relative z-10 mt-16">

          {/* Social Icons — Left Side */}
          <div className="hidden lg:flex absolute left-8 bottom-32 flex-col gap-8 z-20">
            <a href="#" className="group flex items-center gap-3 text-white/30 hover:text-tertiary-fixed transition-colors duration-300" aria-label="LinkedIn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-tertiary-fixed opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">LinkedIn</span>
            </a>
            <a href="#" className="group flex items-center gap-3 text-white/30 hover:text-tertiary-fixed transition-colors duration-300" aria-label="Twitter">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-tertiary-fixed opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Twitter</span>
            </a>
            <a href="#" className="group flex items-center gap-3 text-white/30 hover:text-tertiary-fixed transition-colors duration-300" aria-label="GitHub">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-tertiary-fixed opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">GitHub</span>
            </a>
            <a href="#" className="group flex items-center gap-3 text-white/30 hover:text-tertiary-fixed transition-colors duration-300" aria-label="Dribbble">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-tertiary-fixed opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Dribbble</span>
            </a>
          </div>

          {/* Social Icons — Right Side */}
          <div className="hidden lg:flex absolute right-8 bottom-32 flex-col gap-8 z-20 items-end">
            <a href="mailto:shashank8808108802@gmail.com" className="group flex items-center gap-3 text-white/30 hover:text-accent transition-colors duration-300" aria-label="Email">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Email</span>
              <Mail size={28} />
            </a>
            <a href="#" className="group flex items-center gap-3 text-white/30 hover:text-accent transition-colors duration-300" aria-label="Instagram">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Instagram</span>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>

          {/* SHASHANK — Massive Interactive Text at Bottom */}
          <div className="overflow-hidden px-4">
            <div className="flex justify-center items-center whitespace-nowrap">
              {"SHASHANK".split("").map((char, i) => (
                <FooterChar key={i} char={char} />
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 py-6 px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-[4px] text-white/40 font-medium">© 2026 SHASHANK GUPTA — BORN IN INDIA, SCALING GLOBALLY</p>
            <div className="flex gap-4 items-center">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[4px] text-white/40 font-medium">AVAILABLE FOR NEW OPPORTUNITIES</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}

// Helper Components
function StatBox({ number, suffix, label }: { number: string, suffix: string, label: string }) {
  return (
    <div className="text-center">
      <div className="font-headline text-4xl lg:text-6xl font-black mb-3">
        <span className="stat-number" data-target={number}>0</span>{suffix}
      </div>
      <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{label}</p>
    </div>
  );
}

function SkillCard({ icon, title, description, skills, span }: { icon: React.ReactNode, title: string, description: string, skills: string[], span: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  // unique id per card for pattern so they don't conflict
  const patternId = React.useId().replace(/:/g, "");

  useGSAP(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const xTo = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" });
    const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.1); yTo(y * 0.1);
      rotateXTo(-y * 0.05); rotateYTo(x * 0.05);
    };
    const onLeave = () => { xTo(0); yTo(0); rotateXTo(0); rotateYTo(0); };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={`skill-card relative ${span} bg-[#0a0a0a] p-10 lg:p-12 rounded-[3.5rem] border border-white/5 hover:bg-[#111] transition-colors duration-700 group overflow-hidden`}
    >
      {/* Background Reactive Mesh */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id={`grid-${patternId}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#A3FF12" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${patternId})`} />
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="w-20 h-20 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mb-10 group-hover:bg-accent transition-all duration-700 group-hover:rotate-6 group-hover:scale-110 shadow-lg">
            <div className="text-primary group-hover:text-black transition-colors duration-700">{icon}</div>
          </div>
          <h3 className="font-headline text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">{title}</h3>
          <p className="font-body text-xl text-white/50 leading-relaxed mb-10 group-hover:text-white/80 transition-opacity">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map(skill => (
            <span key={skill} className="px-5 py-2 rounded-full bg-[#1a1a1a] border border-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/40 group-hover:border-accent/20 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all duration-1000"></div>
    </div>
  );
}

function ServiceCard({ icon, title, description, points }: { icon: React.ReactNode, title: string, description: string, points: string[] }) {
  return (
    <div className="service-card bg-[#0a0a0a] p-12 lg:p-16 rounded-[4rem] border border-white/5 hover:border-accent/50 transition-all duration-700 h-full flex flex-col justify-between">
      <div>
        <div className="mb-10 scale-125 origin-left">{icon}</div>
        <h3 className="font-headline text-3xl lg:text-4xl font-bold text-white mb-6">{title}</h3>
        <p className="font-body text-xl text-white/50 leading-relaxed mb-10">{description}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {points.map(p => (
          <div key={p} className="flex items-center gap-2 font-label text-xs uppercase tracking-widest text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="tool-icon flex flex-col items-center gap-6 group">
      <div className="text-white/30 transition-all duration-500 group-hover:text-accent group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100">
        {icon}
      </div>
      <p className="font-label text-[10px] tracking-[4px] uppercase text-white/20 group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100">{label}</p>
    </div>
  );
}

function ProcessStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative group w-full py-16 lg:py-20 border-b border-white/5 cursor-crosshair overflow-hidden">
      {/* Subtle Background Number */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 font-unbounded text-[20vw] font-black text-white/[0.02] group-hover:text-accent/[0.04] transition-colors duration-700 pointer-events-none select-none z-0">
        0{num.replace('0', '')}
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pl-0 lg:pl-10 group-hover:pl-4 lg:group-hover:pl-20 transition-all duration-700 ease-out">
        
        <div className="flex items-center gap-6 lg:gap-12">
          <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full border border-white/10 flex items-center justify-center font-mono text-sm lg:text-xl text-white/40 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-700 bg-[#0a0a0a]">
            {num}
          </div>
          <h3 className="font-unbounded text-4xl lg:text-6xl font-black text-white group-hover:text-accent transition-colors duration-500 uppercase tracking-tighter">
            {title}
          </h3>
        </div>
        
        <div className="w-full lg:w-1/3 flex items-center justify-between gap-8 pl-16 lg:pl-0">
          <p className="font-body text-lg lg:text-2xl text-white/30 group-hover:text-white/80 transition-colors duration-500 leading-relaxed max-w-sm">
            {desc}
          </p>
          
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-[#111] items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-700 shrink-0">
            <ArrowRight className="text-accent" size={32} />
          </div>
        </div>
        
      </div>
    </div>
  );
}

function PortfolioCard({ span, image, title, category, onMouseEnter }: { span: string, image: string, title: string, category: string, onMouseEnter?: () => void }) {
  return (
    <div 
      className={`${span} portfolio-item interactive group transition-all duration-700 ease-in-out`}
      onMouseEnter={onMouseEnter}
    >
      <div className="relative rounded-[3rem] overflow-hidden bg-[#050505] aspect-[4/3] mb-8 shadow-xl">
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-700"></div>
        <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
          <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center text-primary rotate-45 group-hover:rotate-0 transition-transform duration-700">
            <ExternalLink size={24} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-4">
        <div>
          <p className="font-label text-[10px] uppercase tracking-widest text-white/40 mb-2">{category}</p>
          <h3 className="font-headline text-3xl font-bold text-white group-hover:text-accent transition-colors">{title}</h3>
        </div>
        <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, quote }: { name: string, role: string, quote: string }) {
  return (
    <div className="min-w-[400px] lg:min-w-[500px] bg-[#0a0a0a] p-12 lg:p-16 rounded-[3.5rem] border border-white/5 whitespace-normal flex flex-col justify-between transform-gpu [backface-visibility:hidden]">
      <div>
        <Quote size={60} className="text-accent mb-10 opacity-20" />
        <p className="font-headline text-2xl lg:text-3xl font-bold text-white leading-[1.3] mb-12">"{quote}"</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
          <Star className="text-tertiary-fixed" size={20} fill="currentColor" />
        </div>
        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="font-label text-xs uppercase tracking-widest text-secondary">{role}</p>
        </div>
      </div>
    </div>
  );
}

function ExperienceItem({ date, role, co, loc }: { date: string, role: string, co: string, loc: string }) {
  return (
    <div className="experience-item interactive group py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:px-6 transition-all duration-500">
      <div className="flex flex-col gap-2">
        <span className="font-label text-[10px] tracking-[4px] uppercase text-white/40">{date}</span>
        <h3 className="font-headline text-3xl font-bold text-white group-hover:text-accent transition-colors">{role}</h3>
      </div>
      <div className="text-left md:text-right">
        <p className="font-headline text-xl font-bold text-white">{co}</p>
        <p className="font-label text-xs uppercase tracking-widest text-white/40 mt-1">{loc}</p>
      </div>
    </div>
  );
}

function FooterGroup({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-label text-xs uppercase tracking-widest text-secondary">{title}</p>
      <div className="flex flex-col gap-3">
        {links.map(link => (
          <a key={link} href="#" className="footer-link font-body text-lg opacity-60 hover:opacity-100 hover:text-tertiary-fixed transition-all">{link}</a>
        ))}
      </div>
    </div>
  );
}

function FloatingBadge({ text, icon, className }: { text: string, icon: React.ReactNode, className: string }) {
  return (
    <div className={`hero-badge absolute px-4 lg:px-8 py-2 lg:py-4 rounded-full border flex items-center gap-2 lg:gap-4 font-space font-black text-[8px] lg:text-[10px] uppercase tracking-[0.2em] z-30 shadow-2xl will-change-transform opacity-100 whitespace-nowrap ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function FooterChar({ char }: { char: string }) {
  const [active, setActive] = useState(false);

  return (
    <span
      onClick={() => setActive(!active)}
      className={`font-headline text-[clamp(5rem,20vw,18rem)] font-black leading-[0.85] tracking-tighter select-none cursor-pointer transition-all duration-500 ease-out inline-block ${
        active
          ? "text-tertiary-fixed scale-105"
          : "text-white/[0.06] hover:text-tertiary-fixed/80 hover:scale-110"
      }`}
      style={{ willChange: "color, transform" }}
    >
      {char}
    </span>
  );
}
