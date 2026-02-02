'use client';

import { Badge } from '@/components/ui/badge';
import { ProService, serviceList } from '@/@data/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionContainer from '@/components/layout/section-container';
import SectionHeader from '@/components/layout/section-header';
import Icon from '@/components/icon';
import { useTranslations } from 'next-intl';

export const ServicesSection = () => {
  const t = useTranslations('Services');
  return (
    <SectionContainer id="services">
      <SectionHeader
        subTitle={t('subTitle')}
        title={t('title')}
        description={t('description')}
      />
      <div className="mx-auto grid w-full max-w-(--breakpoint-lg) gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceList.map(({ icon, pro }, index) => (
          <Card key={index} className="bg-muted relative h-full gap-2">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">
                  {t(`items.${index}.title`)}
                </CardTitle>
                <div className="bg-primary/20 ring-primary/10 rounded-full p-2 ring-8 shrink-0">
                  <Icon name={icon} className="text-primary size-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t(`items.${index}.description`)}
              </p>
            </CardContent>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
};
