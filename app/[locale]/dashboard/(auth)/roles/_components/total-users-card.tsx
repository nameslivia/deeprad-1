"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USERS, getUserTrend } from "../_data/mock-data";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export function TotalUsersCard() {
    const totalUsers = USERS.length;
    const trend = getUserTrend();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="font-display text-3xl leading-6">{totalUsers.toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2">
                    {trend.isPositive ? (
                        <TrendingUpIcon className="size-4 text-green-500" />
                    ) : (
                        <TrendingDownIcon className="size-4 text-red-500" />
                    )}
                    <span className={`text-sm ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                        {trend.isPositive ? "+" : "-"}{trend.value}%
                    </span>
                    <span className="text-muted-foreground text-xs">vs last month</span>
                </div>
            </CardContent>
        </Card>
    );
}
