"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
    { category: "1(正常)", value: 745, fill: "var(--chart-1)" },
    { category: "2(低風險)", value: 312, fill: "var(--chart-2)" },
    { category: "3(可能)", value: 88, fill: "var(--chart-3)" },
    { category: "4A(可能)", value: 50, fill: "var(--chart-4)" },
    { category: "4B/4X(高度可能)", value: 50, fill: "var(--chart-5)" }
];

const chartConfig = {
    value: { label: "人數" },
    "1(正常)": { label: "1(正常)", color: "var(--chart-1)" },
    "2(低風險)": { label: "2(低風險)", color: "var(--chart-2)" },
    "3(可能)": { label: "3(可能)", color: "var(--chart-3)" },
    "4A(可能)": { label: "4A(可能)", color: "var(--chart-4)" },
    "4B/4X(高度可能)": { label: "4B/4X(高度可能)", color: "var(--chart-5)" }
} satisfies ChartConfig;

const highRiskTotal = chartData[3].value + chartData[4].value;
const total = chartData.reduce((s, d) => s + d.value, 0);
const highRiskPct = Math.round((highRiskTotal / total) * 100);

export function LungRadsChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Lung-RADS 分類</CardTitle>
                <p className="text-muted-foreground text-xs">
                    低劑量胸部電腦斷層篩檢結果
                </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center gap-4">
                <div className="relative">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto h-[180px] w-[180px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="category"
                                innerRadius={58}
                                outerRadius={82}
                                strokeWidth={2}
                                stroke="var(--card)"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    {/* Center label */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">{highRiskPct}%</span>
                        <span className="text-muted-foreground text-xs">高風險</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5">
                    {chartData.map((item) => (
                        <div key={item.category} className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="text-muted-foreground text-xs">{item.category}</span>
                            </div>
                            <span className="text-xs font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
