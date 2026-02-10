"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleDistribution } from "../_data/mock-data";
import { Badge } from "@/components/ui/badge";

export function RoleDistributionCard() {
    const distribution = getRoleDistribution();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {Object.entries(distribution).map(([roleName, count]) => (
                        <div key={roleName} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{roleName}</span>
                            <Badge variant="secondary">{count}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
