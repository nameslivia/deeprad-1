"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Zap } from "lucide-react";

const chartData = [
    { product: "Manuscript Peer Review", tokens: 12500, fill: "var(--chart-1)" },
    { product: "Project Peer Review", tokens: 8200, fill: "var(--chart-2)" },
    { product: "Manuscript Copilot", tokens: 5800, fill: "var(--chart-3)" }
];

const chartConfig = {
    tokens: {
        label: "Tokens"
    },
    "Manuscript Peer Review": {
        label: "Manuscript Peer Review",
        color: "var(--chart-1)"
    },
    "Project Peer Review": {
        label: "Project Peer Review",
        color: "var(--chart-2)"
    },
    "Manuscript Copilot": {
        label: "Manuscript Copilot",
        color: "var(--chart-3)"
    }
} satisfies ChartConfig;

export function TokenUsageByProductCard() {
    const totalTokens = chartData.reduce((sum, item) => sum + item.tokens, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Token Usage by Product</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
                    {/* Donut Chart */}
                    <div className="shrink-0">
                        <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-[200px]">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={chartData}
                                    dataKey="tokens"
                                    nameKey="product"
                                    innerRadius={60}
                                    outerRadius={90}
                                    strokeWidth={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="text-sm">{item.product}</span>
                                </div>
                                <span className="text-sm font-medium">{item.tokens.toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="border-t pt-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3" />
                                    <span className="text-sm font-semibold">Total</span>
                                </div>
                                <span className="text-sm font-semibold">{totalTokens.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
