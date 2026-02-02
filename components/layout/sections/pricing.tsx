'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionContainer from '@/components/layout/section-container';
import SectionHeader from '@/components/layout/section-header';
import { AnimatedBackground } from '@/components/ui/extras/animated-background';
import { SlidingNumber } from '@/components/ui/extras/sliding-number';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { plans, PopularPlan } from '@/@data/pricing';

type Period = {
  label: string;
  value: string;
};

export const PricingSection = () => {
  const t = useTranslations('Pricing');
  
  const periods: Period[] = [
    { label: t('monthly'), value: 'monthly' },
    { label: t('annually'), value: 'annually' },
  ];
  
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periods[0]);

  const discountRatio = 0.2;

  return (
    <SectionContainer id="pricing">
      <SectionHeader
        subTitle={t('subTitle')}
        title={t('title')}
        description={t('description')}
      />
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <div className="mb-8 flex justify-center rounded-lg border">
            <AnimatedBackground
              defaultValue={selectedPeriod.value}
              className="bg-background rounded-lg"
              onValueChange={value =>
                setSelectedPeriod(
                  periods.find(p => p.value === value) as Period
                )
              }
              transition={{
                ease: 'easeInOut',
                duration: 0.2,
              }}
            >
              {periods.map((period, index) => {
                return (
                  <Button key={index} data-id={period.value} variant="ghost">
                    {period.label}
                    {period.value === 'annually' && (
                      <Badge className="ms-1 border-0 bg-transparent text-green-600">
                        {t('save')} {discountRatio * 100}%
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </AnimatedBackground>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => {
            const annualPrice = Math.round(plan.priceMonthly * 12 * (1 - discountRatio));
            const displayPrice = selectedPeriod.value === 'monthly' 
              ? plan.priceMonthly 
              : annualPrice;
            
            return (
              <Card
                key={plan.planKey}
                className={cn('relative h-full overflow-hidden', {
                  'border-primary!': plan.popular === PopularPlan.YES,
                })}
              >
                {plan.popular === PopularPlan.YES && (
                  <div className="bg-primary text-primary-foreground absolute top-0 right-0 rounded-bl-lg px-3 py-1 text-xs font-medium">
                    {t('mostPopular')}
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{t(`plans.${plan.planKey}.name`)}</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col">
                  <div className="flex items-baseline">
                    <span className="flex text-4xl font-bold">
                      $
                      <SlidingNumber value={displayPrice} />
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm lowercase">
                      /{selectedPeriod.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {t(`plans.${plan.planKey}.description`)}
                  </p>
                  <ul className="my-6 flex-grow space-y-3">
                    {Array.from({ length: plan.featuresCount }).map((_, j) => (
                      <li key={j} className="flex items-center">
                        <Check className="text-primary mr-2 size-4" />
                        <span>{t(`plans.${plan.planKey}.features.${j}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.popular === PopularPlan.YES ? 'default' : 'outline'}>
                    {t(`plans.${plan.planKey}.cta`)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};