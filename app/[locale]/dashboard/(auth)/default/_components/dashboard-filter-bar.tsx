"use client";

import { useState } from "react";
import { Filter, RotateCcw, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export function DashboardFilterBar() {
    const [period, setPeriod] = useState("month");
    const [branch, setBranch] = useState("all");
    const [age, setAge] = useState("all");
    const [type, setType] = useState("general");

    const handleReset = () => {
        setPeriod("month");
        setBranch("all");
        setAge("all");
        setType("general");
    };

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Filter className="h-3.5 w-3.5" />
                <span>篩選條件</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="h-7 w-auto border-none bg-transparent px-1 text-sm shadow-none focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">本月</SelectItem>
                        <SelectItem value="quarter">本季</SelectItem>
                        <SelectItem value="year">本年</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-4 w-px bg-border" />

            {/* Branch */}
            <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-7 w-auto border-none bg-transparent px-1 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">全部社別</SelectItem>
                    <SelectItem value="taipei">台北社</SelectItem>
                    <SelectItem value="taichung">台中社</SelectItem>
                </SelectContent>
            </Select>

            <div className="h-4 w-px bg-border" />

            {/* Age */}
            <Select value={age} onValueChange={setAge}>
                <SelectTrigger className="h-7 w-auto border-none bg-transparent px-1 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">全部年齡</SelectItem>
                    <SelectItem value="40-49">40-49 歲</SelectItem>
                    <SelectItem value="50-59">50-59 歲</SelectItem>
                    <SelectItem value="60+">60+ 歲</SelectItem>
                </SelectContent>
            </Select>

            <div className="h-4 w-px bg-border" />

            {/* Type */}
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-7 w-auto border-none bg-transparent px-1 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="general">一般健康</SelectItem>
                    <SelectItem value="premium">進階健康</SelectItem>
                </SelectContent>
            </Select>

            <div className="ml-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleReset}
                >
                    <RotateCcw className="h-3 w-3" />
                    重設篩選
                </Button>
            </div>
        </div>
    );
}
