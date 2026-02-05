'use client';

import Image from 'next/image';
import { CircleArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

const CELL_SIZE = 80; // px

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas data flow animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Light particles
    interface Particle {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      size: number;
    }

    const particles: Particle[] = [];
    const particleCount = 18; // Number of light particles

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Move downward
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }

        // Light particles - using deeper colors to be more visible in light mode
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );

        // Using orange tones, more visible in light mode
        gradient.addColorStop(0, `rgba(249, 115, 22, ${particle.opacity * 2})`);
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    >
      {/* 3D perspective grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          transform: 'perspective(800px) rotateX(60deg)',
          transformOrigin: 'center top',
          opacity: 0.6,
          animation: 'grid-move 20s linear infinite',
        }}
      />

      {/* Canvas data flow - clean light particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient mask to enhance 3D effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, var(--background)/30 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export const HeroSection = () => {
  const t = useTranslations('Hero');

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent">
      {/* Grid background */}
      <GridBackground />

      {/* Bottom blur gradient - for smoother transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 backdrop-blur-md" style={{
        background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
      }} />

      {/* Content */}
      <div className="container relative z-10 mx-auto grid place-items-center py-16 pb-12 md:py-32 md:pb-14">
        <div className="animate-hero-fade-in space-y-8 pb-8 text-center lg:pb-20 opacity-0 [animation-delay:0.2s]">
          <h1 className="mx-auto max-w-(--breakpoint-md) text-center text-4xl font-bold md:text-6xl">{t('title')}</h1>

          <p className="text-muted-foreground mx-auto max-w-(--breakpoint-sm) text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <Button className="h-12 px-10 text-base">
              {t('tryForFree')}
              <CircleArrowRight />
            </Button>

            <Button variant="outline" className="h-12 px-10 text-base">
              {t('watchVideo')}
              <CircleArrowRight />
            </Button>
          </div>
        </div>

        <div
          className="animate-hero-fade-in group relative z-20 pb-8"
          style={{
            animationDelay: '0.4s',
            opacity: 0,
          }}
        >
          {/* Background glow */}
          <div className="bg-primary/60 absolute top-2 left-1/2 mx-auto h-24 w-[90%] -translate-x-1/2 transform rounded-full blur-3xl lg:-top-8 lg:h-80" />

          {/* Clean border design */}
          <div className="relative overflow-hidden rounded-xl bg-background max-w-7xl" style={{
            boxShadow: '0 -20px 20px 0px rgba(249, 115, 22, 0.15), 0 -30px 70px 0px rgba(249, 115, 22, 0.05)',
          }}>
            <Image
              width={1240}
              height={1200}
              className="relative mx-auto w-full rounded-xl shadow-2xl transition-all duration-700 group-hover:scale-[1.02] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
              src="/hero.png"
              alt="hero"
              priority
              unoptimized
              style={{
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
              }}
            />

            {/* Top highlight */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-white/60 to-transparent dark:via-white/40"
            />

            {/* Left highlight */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-px bg-linear-to-b from-transparent via-white/40 to-transparent dark:via-white/20"
            />

            {/* Bottom mask layer */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-40 rounded-b-xl bg-linear-to-t from-background/70 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};