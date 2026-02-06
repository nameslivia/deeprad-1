import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBannerProps {
  className?: string;
}

export function PremiumBanner({ className }: PremiumBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg bg-orange-50 px-6 py-4 border border-orange-100 dark:bg-orange-950/30 dark:border-orange-900",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
        <Crown size={20} fill="currentColor" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">
          Premium Member
        </h3>
        <p className="text-sm text-muted-foreground">
          Unlimited access to all AI Agents
        </p>
      </div>
    </div>
  );
}
