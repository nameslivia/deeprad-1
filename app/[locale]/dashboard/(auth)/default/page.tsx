import { generateMeta } from "@/lib/utils";

import {
  RemainingTokensCard,
  TokenUsageCard,
  FilesUploadedCard,
  TokenUsageByProductCard
} from "@/app/[locale]/dashboard/(auth)/default/_components";

export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard",
    description:
      "Overview of your token usage and activity.",
    canonical: "/default"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your token usage and activity.</p>
        </div>
      </div>
      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
        <RemainingTokensCard />
        <TokenUsageCard />
        <FilesUploadedCard />
        <div className="lg:col-span-3">
          <TokenUsageByProductCard />
        </div>
      </div>
    </div>
  );
}
