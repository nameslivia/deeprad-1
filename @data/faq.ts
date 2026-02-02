interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQList: FAQProps[] = [
  {
    question: 'How do you protect my research content?',
    answer:
      'We protect your research content through strict security measures.All data is encrypted both in transit and at rest, ensuring unauthorized parties cannot access it. Only you have access to your content — we do not use your data for AI training or share it with third parties. You may delete your data at any time, and once removed, it is permanently erased from our systems.',
    value: 'item-1',
  },
  {
    question: 'Will the data I upload be used to train AI models?',
    answer:
      'Absolutely! You can upgrade, downgrade, or modify your plan at any time through your account settings.',
    value: 'item-2',
  },
  {
    question: 'Is this suitable for individual use or team use?',
    answer:
      'Yes, our support team is available around the clock to assist you with any questions or issues.',
    value: 'item-3',
  },
  {
    question: 'Can beginners, researchers, or students use this as well?',
    answer:
      'We prioritize your data privacy with robust security protocols, including end-to-end encryption and GDPR compliance.',
    value: 'item-4',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes, we offer flexible, custom plans designed to meet the unique needs of businesses of all sizes. Contact us for more details.',
    value: 'item-5',
  },
  {
    question: 'If I upgrade my plan, will my data be kept?',
    answer:
      'We accept major credit cards, PayPal, and bank transfers for easy and convenient payment options.',
    value: 'item-6',
  },
  {
    question:
      'Do you offer discounts for students or educational institutions?',
    answer:
      'We accept major credit cards, PayPal, and bank transfers for easy and convenient payment options.',
    value: 'item-7',
  },
];
