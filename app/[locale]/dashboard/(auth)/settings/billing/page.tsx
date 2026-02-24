"use client";

import { Edit2, Plus, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TransactionStatus = "pending" | "failed" | "paid";

interface Transaction {
  id: string;
  product: string;
  status: TransactionStatus;
  date: string;
  amount: string;
}

const transactions: Transaction[] = [
  {
    id: "#36223",
    product: "Mock premium pack",
    status: "pending",
    date: "12/10/2025",
    amount: "$39.90"
  },
  {
    id: "#34283",
    product: "Enterprise plan subscription",
    status: "paid",
    date: "11/13/2025",
    amount: "$159.90"
  },
  {
    id: "#32234",
    product: "Business board pro license",
    status: "paid",
    date: "10/13/2025",
    amount: "$89.90"
  },
  {
    id: "#31354",
    product: "Custom integration package",
    status: "failed",
    date: "09/13/2025",
    amount: "$299.90"
  },
  {
    id: "#30254",
    product: "Developer toolkit license",
    status: "paid",
    date: "08/15/2025",
    amount: "$129.90"
  },
  {
    id: "#29876",
    product: "Support package renewal",
    status: "pending",
    date: "07/22/2025",
    amount: "$79.90"
  }
];

interface PlanOption {
  key: string;
  name: string;
  priceMonthly: number;
  credits: number;
  popular?: boolean;
}

const planOptions: PlanOption[] = [
  {
    key: "starter",
    name: "Starter",
    priceMonthly: 29,
    credits: 40000
  },
  {
    key: "professional",
    name: "Professional",
    priceMonthly: 79,
    credits: 130000,
    popular: true
  },
  {
    key: "enterprise-self",
    name: "Enterprise",
    priceMonthly: 199,
    credits: 450000
  }
];

function ChoosePlanDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string>("professional");
  const [autoTopUp, setAutoTopUp] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Choose a Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs.{" "}
            <a href="#" className="underline underline-offset-2">
              View detailed plan information.
            </a>
          </DialogDescription>
        </DialogHeader>

        {/* Plan options */}
        <div className="space-y-3 py-2">
          {planOptions.map((plan) => (
            <button
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key)}
              className={cn(
                "w-full rounded-lg border-2 p-4 text-left transition-colors",
                selectedPlan === plan.key
                  ? "border-foreground bg-muted/40"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-base">{plan.name}</div>
                  <div className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">${plan.priceMonthly}</span>
                    {" "}/ month
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold tabular-nums">
                    {plan.credits.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-sm">credits / month</div>
                </div>
              </div>
            </button>
          ))}

          {/* Auto top-up row */}
          <div className="flex items-center justify-between rounded-lg px-1 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Automatically top-up with{" "}
              <span className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium text-foreground bg-muted">
                $10 <span className="opacity-50">⊕</span>
              </span>{" "}
              when balance is low
            </div>
            <Switch checked={autoTopUp} onCheckedChange={setAutoTopUp} />
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-lg border-2 border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-base">Enterprise Plan</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Bespoke credit limits
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    <Users className="h-3 w-3" /> Teams
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  Enterprise plans including SSO, OIDC, SCIM, Slack integration, dedicated
                  support, and volume discounts.
                </p>
              </div>
              <Button size="sm" className="shrink-0">
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedPlan}
            onClick={() => onOpenChange(false)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Page() {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Billing monthly | Next payment on 02/09/2025 for{" "}
            <span className="font-medium">$59.90</span>
          </CardDescription>
          <CardAction>
            <Button onClick={() => setPlanDialogOpen(true)}>Change plan</Button>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="font-medium">Carolyn Perkins •••• 0392</div>
                <Badge variant="info">Primary</Badge>
              </div>
              <p className="text-muted-foreground text-sm">Expired Dec 2025</p>
            </div>
            <Button variant="outline" size="icon">
              <Edit2 />
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-2">
              <div className="font-medium">Carolyn Perkins •••• 8461</div>
              <p className="text-muted-foreground text-sm">Expired Jun 2025</p>
            </div>
            <Button variant="outline" size="icon">
              <Edit2 />
            </Button>
          </div>

          <Button variant="outline" className="w-full">
            <Plus />
            Add payment method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const statusMap = {
                  pending: "warning",
                  failed: "destructive",
                  paid: "success"
                } as const;

                const statusClass = statusMap[transaction.status] ?? "secondary";

                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>
                      <Badge variant={statusClass}>{transaction.status}</Badge>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right font-medium">{transaction.amount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ChoosePlanDialog open={planDialogOpen} onOpenChange={setPlanDialogOpen} />
    </div>
  );
}
