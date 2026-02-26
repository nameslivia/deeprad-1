import { generateMeta } from "@/lib/utils";

import { DashboardSummaryCards } from "@/app/[locale]/dashboard/(auth)/default/_components/dashboard-summary-cards";
import { DashboardFilterBar } from "@/app/[locale]/dashboard/(auth)/default/_components/dashboard-filter-bar";
import { LungRadsChart } from "@/app/[locale]/dashboard/(auth)/default/_components/lung-rads-chart";
import { CacRiskChart } from "@/app/[locale]/dashboard/(auth)/default/_components/cac-risk-chart";
import { BoneDensityChart } from "@/app/[locale]/dashboard/(auth)/default/_components/bone-density-chart";
import { HighRiskDemographicsChart } from "@/app/[locale]/dashboard/(auth)/default/_components/high-risk-demographics-chart";

export async function generateMetadata() {
  return generateMeta({
    title: "儀表板",
    description: "健檢數據補強異常分析",
    canonical: "/default"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">儀表板</h1>
        <p className="text-muted-foreground text-sm">健檢數據補強異常分析</p>
      </div>

      {/* Filter bar */}
      <DashboardFilterBar />

      {/* Summary cards */}
      <DashboardSummaryCards />

      {/* Charts row */}
      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
        <LungRadsChart />
        <CacRiskChart />
        <BoneDensityChart />
      </div>

      {/* Demographics bar chart */}
      <HighRiskDemographicsChart />
    </div>
  );
}
