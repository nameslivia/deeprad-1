"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bars = [
    {
        label: "骨質疏鬆",
        value: 249,
        color: "var(--chart-3)",
        bgOpacity: "bg-[var(--chart-3)]"
    },
    {
        label: "骨量減少",
        value: 439,
        color: "var(--chart-4)",
        bgOpacity: "bg-[var(--chart-4)]"
    },
    {
        label: "正常",
        value: 590,
        color: "var(--muted-foreground)",
        bgOpacity: "bg-[var(--muted-foreground)]"
    }
];

const total = bars.reduce((s, b) => s + b.value, 0);
const abnormalTotal = bars[0].value + bars[1].value;
const abnormalPct = Math.round((abnormalTotal / total) * 100);

const miniSegments = [
    { label: "骨質疏鬆", pct: 23, color: "var(--chart-3)" },
    { label: "骨量減少", pct: 35, color: "var(--chart-4)" },
    { label: "正常", pct: 45, color: "var(--muted)" }
];

export function BoneDensityChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">骨質密度分析</CardTitle>
                <p className="text-muted-foreground text-xs">DXA 骨密度檢查結果</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
                {/* Horizontal bar rows */}
                <div className="space-y-3">
                    {bars.map((bar) => {
                        const pct = Math.round((bar.value / total) * 100);
                        return (
                            <div key={bar.label} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{bar.label}</span>
                                    <span className="font-medium">{bar.value} 人</span>
                                </div>
                                <div className="h-5 w-full overflow-hidden rounded-sm bg-muted">
                                    <div
                                        className="h-full rounded-sm transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: bar.color
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Abnormal ratio section */}
                <div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium">異常比例</p>
                            <p className="text-muted-foreground text-xs">骨量減少及骨質疏鬆統計合計</p>
                        </div>
                        <span
                            className="text-2xl font-bold"
                            style={{ color: "var(--chart-3)" }}
                        >
                            {abnormalPct}%
                        </span>
                    </div>

                    {/* Mini segmented bar */}
                    <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
                        {miniSegments.map((seg) => (
                            <div
                                key={seg.label}
                                className="h-full"
                                style={{
                                    width: `${seg.pct}%`,
                                    backgroundColor: seg.color
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        {miniSegments.map((seg) => (
                            <div key={seg.label} className="flex flex-col items-center gap-0.5">
                                <span className="font-medium">{seg.pct}%</span>
                                <span>{seg.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
