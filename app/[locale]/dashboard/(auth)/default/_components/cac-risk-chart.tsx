"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
    { label: "正常 (0)", value: 485, color: "var(--chart-1)", pct: 49 },
    { label: "輕微 (1-100)", value: 312, color: "var(--chart-2)", pct: 27 },
    { label: "中度 (101-400)", value: 261, color: "var(--chart-4)", pct: 22 },
    { label: "重度 (>400)", value: 187, color: "var(--chart-5)", pct: 15 },
];

const highRisk = 15;
const mediumPlus = 36;

// Full semicircle path: left → right (180° → 0°)
function describeArc(cx: number, cy: number, r: number) {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

// Semicircle circumference = π * r
function semiLength(r: number) {
    return Math.PI * r;
}

export function CacRiskChart() {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        // setTimeout is more reliable than RAF in Next.js Strict Mode
        const t = setTimeout(() => setAnimated(true), 60);
        return () => clearTimeout(t);
    }, []);

    const cx = 110;
    const cy = 108;
    const sw = 14;
    const gap = 4;
    const radii = [88, 88 - sw - gap, 88 - 2 * (sw + gap), 88 - 3 * (sw + gap)];

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">CAC 風險指數</CardTitle>
                <p className="text-muted-foreground text-xs">冠狀動脈鈣化指數</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center gap-3">
                {/* Concentric semicircle arcs */}
                <div className="relative flex justify-center">
                    <svg width={220} height={118} viewBox="0 0 220 118">
                        {categories.map((cat, i) => {
                            const r = radii[i];
                            const total = semiLength(r);
                            const filled = (cat.pct / 100) * total;
                            const delay = i * 130;
                            const path = describeArc(cx, cy, r);
                            return (
                                <g key={cat.label}>
                                    {/* Background track — full arc, grey */}
                                    <path
                                        d={path}
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth={sw}
                                        strokeLinecap="round"
                                    />
                                    {/* Colored fill — same full arc path,
                                        dasharray clips to `filled` length,
                                        dashoffset starts at `filled` (invisible) → 0 (fully shown) */}
                                    <path
                                        d={path}
                                        fill="none"
                                        stroke={cat.color}
                                        strokeWidth={sw}
                                        strokeLinecap="round"
                                        strokeDasharray={`${filled} ${total}`}
                                        strokeDashoffset={animated ? 0 : filled}
                                        style={{
                                            transition: `stroke-dashoffset 750ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                                        }}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Key stats */}
                <div className="flex gap-6 -mt-2">
                    <div className="text-center">
                        <span className="block text-xl font-bold leading-tight" style={{ color: "var(--chart-5)" }}>
                            {highRisk}%
                        </span>
                        <span className="text-muted-foreground text-xs">重度</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold leading-tight" style={{ color: "var(--chart-4)" }}>
                            {mediumPlus}%
                        </span>
                        <span className="text-muted-foreground text-xs">中度以上</span>
                    </div>
                </div>

                <p className="text-muted-foreground text-xs text-center">
                    集中於 50 歲以上男性族群
                </p>

                {/* Stats rows */}
                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
                    {categories.map((row) => (
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
