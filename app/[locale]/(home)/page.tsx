import { BenefitsSection } from '@/components/layout/sections/benefits';
import { FAQSection } from '@/components/layout/sections/faq';
import { FeaturesSection } from '@/components/layout/sections/features';
import { FooterSection } from '@/components/layout/sections/footer';
import { HeroSection } from '@/components/layout/sections/hero';
import { PricingSection } from '@/components/layout/sections/pricing';
import { ServicesSection } from '@/components/layout/sections/services';

export const metadata = {
  title: `Scholia`,
  description:
    '',
  openGraph: {
    type: 'website',
    url: 'https://scholia.com.tw',
    title: 'Scholia',
    description: '',
    images: [
      {
        url: '/seo.jpg',
        width: 1200,
        height: 630,
        alt: 'Scholia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://scholia.com.tw',
    title: 'Scholia',
    description:
      '',
    images: ['/seo.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <FAQSection />
      <PricingSection />
      <FooterSection />
    </>
  );
}
