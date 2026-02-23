'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';

const CELL_SIZE = 80; // px

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const w = Math.max(window.innerWidth || 1, 1);
      const h = Math.max(window.innerHeight || 1, 1);
      canvas.width = w;
      canvas.height = h;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const perspectiveScale = (y: number) => {
      if (canvas.height <= 1) return 1;
      return 1 - (y / canvas.height) * 0.5; // simulate rotateX(60deg)
    };

    class LightFlowParticle {
      direction: 'horizontal' | 'vertical';
      x: number = 0;
      y: number = 0;
      dx: number = 0;
      dy: number = 0;
      speed: number;
      opacity: number;
      size: number;
      trailLength: number;
      positions: { x: number; y: number }[];

      constructor() {
        this.direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        this.speed = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.size = Math.random() * 2 + 2;
        this.trailLength = 200;
        this.positions = [];
        this.reset();
      }

      reset() {
        if (!canvas) return;
        // avoid NaN
        if (this.direction === 'horizontal') {
          this.y = Math.floor(Math.random() * (canvas.height / CELL_SIZE + 1)) * CELL_SIZE;
          this.x = Math.random() < 0.5 ? -20 : canvas.width + 20; // 稍微超出邊界開始
          this.dx = this.x < 0 ? this.speed : -this.speed;
          this.dy = 0;
        } else {
          this.x = Math.floor(Math.random() * (canvas.width / CELL_SIZE + 1)) * CELL_SIZE;
          this.y = Math.random() < 0.5 ? -20 : canvas.height + 20;
          this.dy = this.y < 0 ? this.speed : -this.speed;
          this.dx = 0;
        }
        this.positions = [];
      }

      update() {
        if (!canvas) return;
        this.x += this.dx;
        this.y += this.dy;

        // reset if out of canvas
        if (
          this.x > canvas.width + 50 ||
          this.x < -50 ||
          this.y > canvas.height + 50 ||
          this.y < -50
        ) {
          this.reset();
        }

        // update positions
        this.positions.push({ x: this.x, y: this.y });
        if (this.positions.length > this.trailLength) {
          this.positions.shift();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!canvas) return;
        for (let i = 0; i < this.positions.length; i++) {
          const pos = this.positions[i];

          // skip if position is invalid
          if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y)) continue;

          const scale = perspectiveScale(pos.y);
          const centerX = canvas.width / 2;
          let adjustedX = centerX + (pos.x - centerX) * scale;
          const adjustedY = pos.y;

          if (!Number.isFinite(adjustedX)) {
            adjustedX = pos.x;
          }

          const progress = (i + 1) / this.positions.length;
          const alpha = this.opacity * progress; // alpha 0.3 ~ 0
          const outerRadius = this.size * (1 + i / this.trailLength);

          if (outerRadius <= 0 || !Number.isFinite(outerRadius)) continue;

          try {
            const gradient = ctx.createRadialGradient(
              adjustedX, adjustedY, 0,
              adjustedX, adjustedY, outerRadius
            );
            gradient.addColorStop(0, `rgba(249, 115, 22, ${alpha})`);
            gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
              adjustedX,
              adjustedY,
              Math.max(this.size * (1 - i / this.trailLength), 0.1), // avoid 0
              0,
              Math.PI * 2
            );
            ctx.fill();
          } catch (e) {
            // for debug
            ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(adjustedX, adjustedY, this.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    const particles: LightFlowParticle[] = [];
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new LightFlowParticle());
    }

    const animate = () => {
      // skip if canvas is invalid
      if (canvas.width < 2 || canvas.height < 2) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
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
      {/* Canvas for light flows */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0.7 }}
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

export default GridBackground;

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
      <div className="container relative z-10 mx-auto grid place-items-center py-8 pb-8 md:py-32 md:pb-14">
        <div className="animate-hero-fade-in space-y-8 pb-4 md:pb-8 text-center lg:pb-20 [animation-delay:0.2s]">
          <h1 className="mx-auto max-w-(--breakpoint-md) text-center text-4xl font-bold md:text-6xl">{t('title')}</h1>

          <p className="text-muted-foreground mx-auto max-w-(--breakpoint-sm) text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <Link href="/dashboard/default">
              <Button className="h-12 px-10 text-base">
                {t('tryForFree')}
                <CircleArrowRight />
              </Button>
            </Link>

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
          <div className="relative overflow-hidden rounded-xl bg-background max-w-full md:max-w-5xl lg:max-w-7xl mx-auto" style={{
            boxShadow: '0 -20px 20px 0px rgba(249, 115, 22, 0.15), 0 -30px 70px 0px rgba(249, 115, 22, 0.05)',
          }}>
            {/* Mobile image */}
            <Image
              width={800}
              height={600}
              className="relative mx-auto w-full rounded-xl shadow-2xl transition-all duration-700 group-hover:scale-[1.02] md:hidden dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
              src="/hero-mobile.png"
              alt="hero"
              priority
              unoptimized
              style={{
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
              }}
            />

            {/* Desktop image */}
            <Image
              width={1240}
              height={1200}
              className="relative mx-auto hidden w-full rounded-xl shadow-2xl transition-all duration-700 group-hover:scale-[1.02] md:block dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
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