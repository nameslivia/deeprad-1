"use client";

import { useState } from "react";
import { RotateCcw, CalendarDays, Users, BarChart2, Stethoscope, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type FilterState = {
    period: string;
    gender: string;
    age: string;
    type: string;
};

const defaultFilters: FilterState = {
    period: "month",
    gender: "all",
    age: "all",
    type: "general",
};

const filterConfigs = [
    {
        key: "period" as const,
        icon: CalendarDays,
        options: [
            { value: "month", label: "本月" },
            { value: "lastMonth", label: "上月" },
            { value: "quarter", label: "近三個月" },
            { value: "year", label: "今年" },
        ],
    },
    {
        key: "gender" as const,
        icon: Users,
        options: [
            { value: "all", label: "全部性別" },
            { value: "male", label: "男性" },
            { value: "female", label: "女性" },
        ],
    },
    {
        key: "age" as const,
        icon: BarChart2,
        options: [
            { value: "all", label: "全部年齡" },
            { value: "<40", label: "40 歲以下" },
            { value: "40-49", label: "40–49 歲" },
            { value: "50-59", label: "50–59 歲" },
            { value: "60+", label: "60 歲以上" },
        ],
    },
    {
        key: "type" as const,
        icon: Stethoscope,
        options: [
            { value: "general", label: "一般健檢" },
            { value: "executive", label: "高階主管健檢" },
            { value: "cancer-screening", label: "癌症篩檢" },
            { value: "cardiovascular", label: "心血管檢查" },
        ],
    },
];

function StyledSelect({
    icon: Icon,
    value,
    options,
    onChange,
    isChanged,
}: {
    icon: React.ElementType;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    isChanged: boolean;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className={[
                    "h-8 gap-2 rounded-lg border px-3 text-sm font-medium shadow-none transition-all duration-150",
                    "hover:border-foreground/30 hover:shadow-sm focus:ring-0",
                    isChanged
                        ? "border-foreground/40 bg-foreground text-background [&>svg]:text-background"
                        : "border-border bg-background text-foreground",
                ].join(" ")}
            >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function DashboardFilterBar() {
    const [state, setState] = useState<FilterState>(defaultFilters);

    const set = (key: keyof FilterState) => (value: string) =>
        setState((prev) => ({ ...prev, [key]: value }));

    const isDirty = Object.keys(defaultFilters).some(
        (k) => state[k as keyof FilterState] !== defaultFilters[k as keyof FilterState]
    );

    const changedCount = Object.keys(defaultFilters).filter(
        (k) => state[k as keyof FilterState] !== defaultFilters[k as keyof FilterState]
    ).length;

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
                <Filter className="h-3.5 w-3.5" />
                篩選條件
            </span>

            {filterConfigs.map(({ key, icon, options }) => (
                <StyledSelect
                    key={key}
                    icon={icon}
                    value={state[key]}
                    options={options}
                    onChange={set(key)}
                    isChanged={state[key] !== defaultFilters[key]}
                />
            ))}

            <div className="ml-auto flex items-center gap-2">
                {isDirty && (
                    <span className="text-xs text-muted-foreground">
                        已篩選 {changedCount} 項
                    </span>
                )}
                <button
                    onClick={() => setState(defaultFilters)}
                    disabled={!isDirty}
                    className={[
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                        isDirty
                            ? "border-border bg-background text-foreground hover:bg-muted cursor-pointer"
                            : "border-transparent text-muted-foreground/40 cursor-not-allowed",
                    ].join(" ")}
                >
                    <RotateCcw className="h-3 w-3" />
                    重設
                </button>
            </div>
        </div>
    );
}