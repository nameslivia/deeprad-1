"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveUsersCount } from "../_data/mock-data";
import { CircleIcon } from "lucide-react";

export function ActiveUsersCard() {
    const activeUsers = getActiveUsersCount();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="font-display text-3xl leading-6">{activeUsers.toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2">
                    <CircleIcon className="size-2 fill-green-500 text-green-500" />
                    <span className="text-muted-foreground text-xs">Currently online</span>
                </div>
            </CardContent>
        </Card>
    );
}
