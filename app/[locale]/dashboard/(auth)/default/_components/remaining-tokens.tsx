"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function RemainingTokensCard() {
  const remainingTokens = 24322;
  const totalQuota = 50000;
  const percentage = (remainingTokens / totalQuota) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl leading-6">{remainingTokens.toLocaleString()}</div>
        <div className="mt-4 space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-muted-foreground text-xs">
            Total Quota {totalQuota.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
