'use client';

import Image from 'next/image';
import { CheckIcon, CircleArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackgroundBeamsWithCollision } from '@/components/ui/extras/background-beams-with-collision';

export const HeroSection = () => {
  const t = useTranslations('Hero');

  return (
    <section className="container w-full">
      <div className="mx-auto grid place-items-center py-16 pb-8 md:py-32 md:pb-14 lg:max-w-(--breakpoint-xl)">
        <BackgroundBeamsWithCollision>
          <div className="space-y-8 pb-8 text-center lg:pb-20">
            <div className="mx-auto max-w-(--breakpoint-md) text-center text-4xl font-bold md:text-6xl">
              <h1>{t('title')}</h1>
            </div>
            <p className="text-muted-foreground mx-auto max-w-(--breakpoint-sm) text-xl">
              {t('subtitle')}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row!">
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
        </BackgroundBeamsWithCollision>

        <div className="group relative">
          {/* blur effect */}
          <div className="bg-primary/60 absolute top-2 left-1/2 mx-auto h-24 w-[90%] -translate-x-1/2 transform rounded-full blur-3xl lg:-top-8 lg:h-80"></div>
          {/* blur effect */}

          <Image
            width={1240}
            height={1200}
            className="rouded-lg relative mx-auto flex w-full items-center rounded-lg mask-b-from-20% mask-b-to-90% leading-none"
            src="/hero.png"
            alt="shadcn landing page"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};
