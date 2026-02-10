import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AgentsHeader() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                <p className="text-muted-foreground">
                    Choose an agent and start building today.
                </p>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search agents..."
                    className="pl-9 bg-background/50"
                />
            </div>
        </div>
    );
}
