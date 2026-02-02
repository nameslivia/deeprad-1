'use client';

import React from 'react';

import { featureList } from '@/@data/features';
import { CardTitle } from '@/components/ui/card';
import Icon from '@/components/icon';
import { CardHover, CardsHover } from '@/components/ui/extras/cards-hover';
import SectionContainer from '@/components/layout/section-container';
import SectionHeader from '@/components/layout/section-header';

export const FeaturesSection = () => {
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <SectionContainer id="features">
      <SectionHeader
        subTitle="Features"
        title="Tools Designed to Accelerate Your Research"
        description="Here to support your writing, reviewing, and everything in between—so you can focus on ideas, not the struggle."
      />
      <CardsHover
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        value={value}
        onValueChange={setValue}
      >
        {featureList.map(card => (
          <CardHover
            key={card.icon}
            value={card.icon}
            className="flex items-start gap-6"
          >
            <div className="space-y-4">
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <p className="text-muted-foreground font-normal">
                {card.description}
              </p>
            </div>
            <div className="bg-primary/20 ring-primary/10 rounded-full p-2 ring-8">
              <Icon name={card.icon} className="text-primary size-6" />
            </div>
          </CardHover>
        ))}
      </CardsHover>
    </SectionContainer>
  );
};
