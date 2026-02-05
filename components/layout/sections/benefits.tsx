'use client';

import { benefitList } from '@/@data/benefits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/icon';
import { cn } from '@/lib/utils';
import SectionContainer from '../section-container';
import SectionHeader from '../section-header';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export const BenefitsSection = () => {
  const t = useTranslations('Benefits');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <SectionContainer id="benefits">
      <div ref={ref} className="grid lg:grid-cols-2 lg:gap-24">
        <div className={cn(isVisible && 'scroll-fade-in')}>
          <SectionHeader
            className="sticky max-w-full text-center lg:top-[22rem] lg:text-start"
            subTitle={t('subTitle')}
            title={t('title')}
            description={t('description')}
          />
        </div>

        <div className={cn('flex w-full flex-col gap-6 lg:gap-[14rem]', isVisible && 'stagger-fade-in')}>
          {benefitList.map(({ icon }, index) => (
            <Card
              key={index}
              className={cn('group/number bg-background lg:sticky')}
              style={{ top: `${20 + index + 2}rem` }}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon}
                    className="text-primary bg-primary/20 ring-primary/10 mb-6 size-10 rounded-full p-2 ring-8"
                  />
                  <span className="text-muted-foreground/15 group-hover/number:text-muted-foreground/30 text-5xl font-bold transition-all delay-75">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle className="text-lg">{t(`items.${index}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {t(`items.${index}.description`)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
