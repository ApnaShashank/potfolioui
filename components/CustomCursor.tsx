"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Initial hide to avoid stuck dot at 0,0
    gsap.set(cursor, { opacity: 0 });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Reveal on first move
      if (cursor.style.opacity === '0') {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    };

    const animationId = requestAnimationFrame(animateCursor);
    window.addEventListener('mousemove', onMouseMove);
    document.body.classList.add('custom-cursor-active');

    // Provide magnetic behavior
    const updateMagneticElements = () => {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.dataset.magneticInit) return;
            htmlEl.dataset.magneticInit = 'true';

            htmlEl.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = htmlEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dist = 0.5;

                const moveX = (e.clientX - centerX) * dist;
                const moveY = (e.clientY - centerY) * dist;

                gsap.to(htmlEl, {
                    x: moveX,
                    y: moveY,
                    duration: 0.2,
                    ease: "power2.out"
                });
                
                if (cursor) {
                   cursor.classList.add('magnet-active');
                   gsap.to(cursor, {
                       width: 90,
                       height: 90,
                       backgroundColor: 'transparent',
                       border: '1px solid #ccff00',
                       duration: 0.3,
                       ease: "power2.out"
                   });
                   const inner = cursor.querySelector('.cursor-dot');
                   if (inner) {
                       gsap.to(inner, { scale: 1, autoAlpha: 1, duration: 0.3 });
                   }
                }
            });

            htmlEl.addEventListener('mouseleave', () => {
                gsap.to(htmlEl, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
                
                if (cursor) {
                   cursor.classList.remove('magnet-active');
                   gsap.to(cursor, {
                       width: 20,
                       height: 20,
                       backgroundColor: '#ccff00',
                       border: '0px solid transparent',
                       duration: 0.3,
                       ease: "power2.out"
                   });
                   const inner = cursor.querySelector('.cursor-dot');
                   if (inner) {
                       gsap.to(inner, { scale: 0, autoAlpha: 0, duration: 0.3 });
                   }
                }
            });
        });
    };

    updateMagneticElements();
    const observer = new MutationObserver(updateMagneticElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 bg-accent rounded-full pointer-events-none z-[9999] flex items-center justify-center border border-black/20"
      style={{ willChange: "transform, width, height" }}
    >
        <div className="cursor-dot w-2 h-2 bg-black rounded-full opacity-0 scale-0"></div>
    </div>
  );
}
