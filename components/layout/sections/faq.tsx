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

export const FAQSection = () => {
  return (
    <SectionContainer id="faqs">
      <SectionHeader subTitle="FAQS" title="Common Questions" />
      <div className="max-w-(--breakpoint-sm) mx-auto">
        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
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
                  <span>{question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
};
