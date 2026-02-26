"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, KeyRound } from "lucide-react";

const cards = [
  {
    title: "總受檢人數",
    value: "1,245",
    icon: Activity,
    iconColor: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    footer: null
  },
  {
    title: "高風險 CAC",
    value: "261",
    badge: "21%",
    badgeColor: "text-[var(--chart-5)]",
    icon: Heart,
    iconColor: "text-[var(--chart-2)]",
    bgColor: "bg-[var(--chart-2)]/10",
    footer: "需心臟科後診"
  },
  {
    title: "腎結石 4A+",
    value: "50",
    badge: "4%",
    badgeColor: "text-[var(--chart-4)]",
    icon: TrendingUp,
    iconColor: "text-[var(--chart-4)]",
    bgColor: "bg-[var(--chart-4)]/10",
    footer: "需切片或密切追蹤"
  },
  {
    title: "骨質疏鬆",
    value: "249",
    badge: "20%",
    badgeColor: "text-[var(--chart-4)]",
    icon: KeyRound,
    iconColor: "text-[var(--muted-foreground)]",
    bgColor: "bg-[var(--muted)]/60",
    footer: "T-score < -2.5"
  }
];

export function DashboardSummaryCards() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">
                      {card.value}
                    </span>
                    {card.badge && (
                      <span className={`text-sm font-medium ${card.badgeColor}`}>
                        ({card.badge})
                      </span>
                    )}
                  </div>
                  {card.footer && (
                    <p className="text-muted-foreground text-xs">{card.footer}</p>
                  )}
                </div>
                <div className={`rounded-md p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
