'use client';

import { AgentsHeader } from "./_components/agents-header";
import { PremiumBanner } from "./_components/premium-banner";
import { AgentCard, AgentStatus } from "./_components/agent-card";
import { BookOpen } from "lucide-react";

interface Agent {
    id: string;
    title: string;
    category: string;
    description: string;
    status: AgentStatus;
    rating: number;
    usageCount: number;
    href?: string;
}

const AGENTS_DATA: Agent[] = [
    {
        id: "1",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Active",
        rating: 4.8,
        usageCount: 156,
        href: "/dashboard/agents/agent-1",
    },
    {
        id: "2",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Active",
        rating: 4.8,
        usageCount: 156,
        href: "/dashboard/agents/agent-2",
    },
    {
        id: "3",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Coming Soon",
        rating: 4.8,
        usageCount: 156,
    },
    {
        id: "4",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Coming Soon",
        rating: 4.8,
        usageCount: 156,
    },
    {
        id: "5",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Maintaining",
        rating: 4.8,
        usageCount: 156,
    },
    {
        id: "6",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Maintaining",
        rating: 4.8,
        usageCount: 156,
    },
    {
        id: "7",
        title: "Manuscript Peer Review",
        category: "Research",
        description: "Deep search and analysis of relevant papers and research reports.",
        status: "Maintaining",
        rating: 4.8,
        usageCount: 156,
    },
];

export default function AgentsPage() {
    return (
        <div className="flex flex-col gap-8">
            <PremiumBanner />

            <AgentsHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {AGENTS_DATA.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        title={agent.title}
                        category={agent.category}
                        description={agent.description}
                        status={agent.status}
                        rating={agent.rating}
                        usageCount={agent.usageCount}
                        icon={<BookOpen size={24} />}
                        href={agent.href}
                    />
                ))}
            </div>
        </div>
    );
}
