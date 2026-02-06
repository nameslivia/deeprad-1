import { Star, BookOpen } from "lucide-react"; // Using BookOpen as a generic icon placeholder, can be customized
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export type AgentStatus = "Active" | "Coming Soon" | "Maintaining";

interface AgentCardProps {
    title: string;
    category: string;
    description: string;
    status: AgentStatus;
    rating: number;
    usageCount: number;
    icon?: React.ReactNode;
    className?: string;
}

const statusColorMap: Record<AgentStatus, string> = {
    "Active": "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    "Coming Soon": "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    "Maintaining": "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

export function AgentCard({
    title,
    category,
    description,
    status,
    rating,
    usageCount,
    icon,
    className,
    href,
}: AgentCardProps & { href?: string }) {
    const cardContent = (
        <Card className={cn("flex flex-col h-full transition-all hover:shadow-md", className)}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        {icon || <BookOpen size={24} />}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                        <p className="text-sm text-muted-foreground">{category}</p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={cn("font-normal", statusColorMap[status])}
                >
                    {status}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
            <CardFooter className="pt-2 text-sm text-muted-foreground flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star size={14} fill="currentColor" />
                    <span>{rating.toFixed(1)}</span>
                </div>
                <div className="text-muted-foreground/60">
                    {usageCount} uses
                </div>
            </CardFooter>
        </Card>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
