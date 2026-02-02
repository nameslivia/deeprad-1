export enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  planKey: 'starter' | 'professional' | 'enterprise';
  popular: PopularPlan;
  priceMonthly: number;
  featuresCount: number;
}

export const plans: PlanProps[] = [
  {
    planKey: 'starter',
    popular: 0,
    priceMonthly: 29,
    featuresCount: 4,
  },
  {
    planKey: 'professional',
    popular: 1,
    priceMonthly: 79,
    featuresCount: 5,
  },
  {
    planKey: 'enterprise',
    popular: 0,
    priceMonthly: 199,
    featuresCount: 6,
  },
];