'use client';

import { FAQList } from '@/@data/faq';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SectionHeader from '../section-header';
import SectionContainer from '../section-container';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const FAQSection = () => {
  const t = useTranslations('FAQ');
  return (
    <SectionContainer id="faqs">
      <SectionHeader 
        subTitle={t('subTitle')} 
        title={t('title')} 
      />
      <div className="max-w-(--breakpoint-sm) mx-auto">
        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ value }, index) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left text-lg">
                <div className="flex items-start gap-3">
                  <Image
                    src="/faq.svg"
                    alt="FAQ"
                    width={20}
                    height={20}
                    className="mt-1 shrink-0"
                  />
                  <span>{t(`items.${index}.question`)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t(`items.${index}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
};
