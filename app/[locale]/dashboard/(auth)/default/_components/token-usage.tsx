"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function TokenUsageCard() {
    const tokenUsage = 30000;
    const percentageChange = 15.2;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Token Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="font-display text-3xl leading-6">{tokenUsage.toLocaleString()}</div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500" />
                    <span className="text-green-600 dark:text-green-500">
                        +{percentageChange}% from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
