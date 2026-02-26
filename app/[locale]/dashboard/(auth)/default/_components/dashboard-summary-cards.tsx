"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, KeyRound } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";

const cards = [
  {
    title: "總受檢人數",
    value: 1245,
    icon: Activity,
    iconColor: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    trend: "+12%",
    trendLabel: "較上月成長",
    footer: null
  },
  {
    title: "高風險 CAC",
    value: 261,
    badge: "21%",
    badgeColor: "text-orange-500",
    icon: Heart,
    iconColor: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    footer: "需心臟科後診"
  },
  {
    title: "腎結石 4A+",
    value: 50,
    badge: "4%",
    badgeColor: "text-[var(--chart-4)]",
    icon: TrendingUp,
    iconColor: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    footer: "需切片或密切追蹤"
  },
  {
    title: "骨質疏鬆",
    value: 249,
    badge: "20%",
    badgeColor: "text-[var(--chart-4)]",
    icon: KeyRound,
    iconColor: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    footer: "T-score < -2.5"
  }
];

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return <>{display.toLocaleString()}</>;
}

export function DashboardSummaryCards() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{card.title}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tracking-tight">
                        <AnimatedNumber value={card.value} />
                      </span>
                      {card.badge && (
                        <span className={`text-sm font-medium ${card.badgeColor}`}>
                          ({card.badge})
                        </span>
                      )}
                    </div>
                    {(card as any).trend && (
                      <div className="flex items-center text-xs mt-1">
                        <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
                        <span className="text-orange-500 font-medium mr-1">{(card as any).trend}</span>
                        <span className="text-muted-foreground">{(card as any).trendLabel}</span>
                      </div>
                    )}
                    {card.footer && (
                      <p className="text-muted-foreground text-xs mt-1">{card.footer}</p>
                    )}
                  </div>
                  <div className={`rounded-md p-2 ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
