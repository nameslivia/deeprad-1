"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
    high: { label: "高風險", color: "var(--chart-5)" },
    medium: { label: "中度以上", color: "var(--chart-4)" },
    normal: { label: "正常", color: "var(--muted)" }
} satisfies ChartConfig;

// Gauge segments: normal (grey), medium (orange), high (red)
const gaugeData = [
    { name: "正常", value: 49, fill: "var(--muted)" },
    { name: "中度以上", value: 36, fill: "var(--chart-4)" },
    { name: "高風險", value: 15, fill: "var(--chart-5)" }
];

const statsRows = [
    { label: "正常 (0)", value: 495, color: "var(--chart-1)" },
    { label: "輕度 (1-100)", value: 312, color: "var(--chart-2)" },
    { label: "中度 (101-400)", value: 261, color: "var(--chart-4)" },
    { label: "重度 (>400)", value: 167, color: "var(--chart-5)" }
];

const highRisk = 15;
const mediumPlus = 36;

export function CacRiskChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">CAC 風險指數</CardTitle>
                <p className="text-muted-foreground text-xs">冠狀動脈鈣化指數</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center gap-3">
                {/* Semicircle gauge */}
                <div className="relative flex justify-center">
                    <ChartContainer config={chartConfig} className="h-[120px] w-[200px]">
                        <PieChart width={200} height={120}>
                            <Pie
                                data={gaugeData}
                                startAngle={180}
                                endAngle={0}
                                cx={100}
                                cy={110}
                                innerRadius={62}
                                outerRadius={96}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    {/* Overlay values at bottom center of gauge */}
                    <div className="pointer-events-none absolute bottom-0 flex w-full justify-center gap-6 pb-1">
                        <div className="text-center">
                            <span
                                className="block text-xl font-bold leading-tight"
                                style={{ color: "var(--chart-5)" }}
                            >
                                {highRisk}%
                            </span>
                            <span className="text-muted-foreground text-xs">高風險</span>
                        </div>
                        <div className="text-center">
                            <span
                                className="block text-xl font-bold leading-tight"
                                style={{ color: "var(--chart-4)" }}
                            >
                                {mediumPlus}%
                            </span>
                            <span className="text-muted-foreground text-xs">中度以上</span>
                        </div>
                    </div>
                </div>

                <p className="text-muted-foreground text-xs text-center -mt-1">
                    集中於 50 歲以上男性指數偏高
                </p>

                {/* Stats rows */}
                <div className="w-full space-y-1.5 mt-1">
                    {statsRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ backgroundColor: row.color }}
                                />
                                <span className="text-muted-foreground">{row.label}</span>
                            </div>
                            <span className="font-medium">{row.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
