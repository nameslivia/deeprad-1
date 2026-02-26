"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const data = [
    { age: "<40", male: 12, female: 8 },
    { age: "40-50", male: 45, female: 28 },
    { age: "50-60", male: 86, female: 45 },
    { age: "60+", male: 68, female: 34 }
];

const totals = [
    { age: "<40 歲", total: 20 },
    { age: "40-50 歲", total: 73 },
    { age: "50-60 歲", total: 131 },
    { age: "60+ 歲", total: 102 }
];

export function HighRiskDemographicsChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold">高風險族群人口統計</CardTitle>
                        <p className="text-muted-foreground text-xs mt-0.5">
                            CAC 高風險人數依年齡與性別分布
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: "var(--primary)" }}
                            />
                            男生
                        </span>
                        <span className="flex items-center gap-1">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: "var(--chart-2)" }}
                            />
                            女生
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={data}
                        barCategoryGap="40%"
                        barGap={6}
                        maxBarSize={50}
                        margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--border)"
                        />
                        <XAxis
                            dataKey="age"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            width={28}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius)",
                                fontSize: 12
                            }}
                            labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                            itemStyle={{ color: "var(--muted-foreground)" }}
                            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                        />
                        <Bar
                            dataKey="male"
                            name="男生"
                            fill="var(--primary)"
                            radius={[3, 3, 0, 0]}
                        />
                        <Bar
                            dataKey="female"
                            name="女生"
                            fill="var(--chart-2)"
                            radius={[3, 3, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Total labels row */}
                <div className="mt-3 grid grid-cols-4 border-t pt-3">
                    {totals.map((item) => (
                        <div key={item.age} className="flex flex-col items-center gap-0.5">
                            <span className="text-lg font-bold">{item.total}</span>
                            <span className="text-muted-foreground text-xs">{item.age}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
