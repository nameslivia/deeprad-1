import { promises as fs } from "fs";
import path from "path";
import { generateMeta } from "@/lib/utils";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AgentList from "@/app/[locale]/dashboard/(auth)/products/agent-list";

export async function generateMetadata(): Promise<Metadata> {
    return generateMeta({
        title: "Product",
        description:
            "Manage the agents displayed on the dashboard agents page. Built with shadcn/ui, Tailwind CSS and Next.js.",
        canonical: "/dashboard/products"
    });
}

async function getAgents() {
    const data = await fs.readFile(
        path.join(process.cwd(), "app/[locale]/dashboard/(auth)/products/data.json")
    );
    return JSON.parse(data.toString());
}

export default async function Page() {
    const agents = await getAgents();

    const total = agents.length;
    const active = agents.filter((a: { status: string }) => a.status === "active").length;
    const comingSoon = agents.filter((a: { status: string }) => a.status === "coming-soon").length;
    const maintaining = agents.filter((a: { status: string }) => a.status === "maintaining").length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Product</h1>
                <Button asChild>
                    <Link href="/dashboard/agents">
                        <PlusIcon /> Add Agent
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardDescription>Total Agents</CardDescription>
                        <CardTitle className="font-display text-2xl lg:text-3xl">{total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Active</CardDescription>
                        <CardTitle className="font-display text-2xl lg:text-3xl">{active}</CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <span className="text-green-600">Deployed</span>
                            </Badge>
                        </CardAction>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Coming Soon</CardDescription>
                        <CardTitle className="font-display text-2xl lg:text-3xl">{comingSoon}</CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <span className="text-orange-500">Pending</span>
                            </Badge>
                        </CardAction>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Maintaining</CardDescription>
                        <CardTitle className="font-display text-2xl lg:text-3xl">{maintaining}</CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <span className="text-muted-foreground">Paused</span>
                            </Badge>
                        </CardAction>
                    </CardHeader>
                </Card>
            </div>

            <div className="pt-4">
                <AgentList data={agents} />
            </div>
        </div>
    );
}
