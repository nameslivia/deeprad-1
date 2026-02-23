"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ColumnsIcon,
    FilterIcon,
    MoreHorizontal,
    PlusCircle,
    PlusIcon,
    Star
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export type Agent = {
    id: number;
    name: string;
    icon?: string;
    category?: string;
    description?: string;
    rating?: number;
    usageCount?: number;
    status: "active" | "coming-soon" | "maintaining";
    href?: string;
};

const statusMap = {
    active: { label: "Active", variant: "success" },
    "coming-soon": { label: "Coming Soon", variant: "warning" },
    maintaining: { label: "Maintaining", variant: "default" }
} as const;

const CATEGORIES = ["Research", "Writing", "Review", "Analysis", "Other"];
const STATUSES = [
    { value: "active" as const, label: "Active" },
    { value: "coming-soon" as const, label: "Coming Soon" },
    { value: "maintaining" as const, label: "Maintaining" }
];

// ─── Add Agent Sheet ───────────────────────────────────────────────────────────
function AddAgentSheet({ onAdd }: { onAdd: (agent: Agent) => void }) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [rating, setRating] = React.useState("");
    const [usageCount, setUsageCount] = React.useState("");
    const [status, setStatus] = React.useState<Agent["status"]>("active");
    const [href, setHref] = React.useState("");

    const reset = () => {
        setName("");
        setCategory("");
        setDescription("");
        setRating("");
        setUsageCount("");
        setStatus("active");
        setHref("");
    };

    const handleAdd = (closeAfter: boolean) => {
        if (!name || !category || !status) {
            toast.error("Please fill in all required fields (Name, Category, Status).");
            return;
        }
        const newAgent: Agent = {
            id: Date.now(),
            name,
            icon: name[0]?.toUpperCase() ?? "A",
            category,
            description,
            rating: rating ? parseFloat(rating) : undefined,
            usageCount: usageCount ? parseInt(usageCount, 10) : undefined,
            status,
            href: href || undefined
        };
        onAdd(newAgent);
        toast.success(`Agent "${name}" added successfully.`);
        if (closeAfter) {
            setOpen(false);
            reset();
        } else {
            reset();
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <PlusIcon className="size-4" />
                    Add Agent
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="px-6 pt-6">
                    <SheetTitle>Add New Agent</SheetTitle>
                    <SheetDescription>
                        Create a new agent entry for the product catalogue.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 px-6 py-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="add-name">
                            Agent Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="add-name"
                            placeholder="e.g. Manuscript Peer Review"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="add-category">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="add-category" className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="add-description">Description</Label>
                        <Input
                            id="add-description"
                            placeholder="Short description of the agent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <Label htmlFor="add-rating">Rating (0 – 5)</Label>
                        <Input
                            id="add-rating"
                            type="number"
                            min={0}
                            max={5}
                            step={0.1}
                            placeholder="e.g. 4.8"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>

                    {/* Usage Count */}
                    <div className="space-y-2">
                        <Label htmlFor="add-usage">Usage Count</Label>
                        <Input
                            id="add-usage"
                            type="number"
                            min={0}
                            placeholder="e.g. 156"
                            value={usageCount}
                            onChange={(e) => setUsageCount(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="add-status">
                            Status <span className="text-destructive">*</span>
                        </Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as Agent["status"])}>
                            <SelectTrigger id="add-status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Href */}
                    <div className="space-y-2">
                        <Label htmlFor="add-href">Agent Page Link</Label>
                        <Input
                            id="add-href"
                            placeholder="/dashboard/agents/agent-1"
                            value={href}
                            onChange={(e) => setHref(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter className="gap-2 px-6 pb-6">
                    <Button variant="outline" onClick={() => handleAdd(true)}>
                        Add &amp; Close
                    </Button>
                    <Button onClick={() => handleAdd(false)}>
                        Add &amp; New
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

// ─── Edit Agent Sheet ──────────────────────────────────────────────────────────
function EditAgentSheet({
    agent,
    open,
    onOpenChange,
    onSave
}: {
    agent: Agent | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (updated: Agent) => void;
}) {
    const [name, setName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [rating, setRating] = React.useState("");
    const [usageCount, setUsageCount] = React.useState("");
    const [status, setStatus] = React.useState<Agent["status"]>("active");
    const [href, setHref] = React.useState("");

    // Sync form fields when the target agent changes
    React.useEffect(() => {
        if (agent) {
            setName(agent.name ?? "");
            setCategory(agent.category ?? "");
            setDescription(agent.description ?? "");
            setRating(agent.rating !== undefined ? String(agent.rating) : "");
            setUsageCount(agent.usageCount !== undefined ? String(agent.usageCount) : "");
            setStatus(agent.status);
            setHref(agent.href ?? "");
        }
    }, [agent]);

    const handleSave = () => {
        if (!name || !category || !status) {
            toast.error("Please fill in all required fields (Name, Category, Status).");
            return;
        }
        if (!agent) return;
        onSave({
            ...agent,
            name,
            category,
            description,
            rating: rating ? parseFloat(rating) : undefined,
            usageCount: usageCount ? parseInt(usageCount, 10) : undefined,
            status,
            href: href || undefined
        });
        toast.success(`Agent "${name}" updated successfully.`);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="px-6 pt-6">
                    <SheetTitle>Edit Agent</SheetTitle>
                    <SheetDescription>
                        Update the details for this agent.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 px-6 py-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">
                            Agent Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g. Manuscript Peer Review"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-category">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="edit-category" className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
                            placeholder="Short description of the agent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-rating">Rating (0 – 5)</Label>
                        <Input
                            id="edit-rating"
                            type="number"
                            min={0}
                            max={5}
                            step={0.1}
                            placeholder="e.g. 4.8"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>

                    {/* Usage Count */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-usage">Usage Count</Label>
                        <Input
                            id="edit-usage"
                            type="number"
                            min={0}
                            placeholder="e.g. 156"
                            value={usageCount}
                            onChange={(e) => setUsageCount(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-status">
                            Status <span className="text-destructive">*</span>
                        </Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as Agent["status"])}>
                            <SelectTrigger id="edit-status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Href */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-href">Agent Page Link</Label>
                        <Input
                            id="edit-href"
                            placeholder="/dashboard/agents/agent-1"
                            value={href}
                            onChange={(e) => setHref(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter className="gap-2 px-6 pb-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

// ─── Main AgentList Component ──────────────────────────────────────────────────
export default function AgentList({ data }: { data: Agent[] }) {
    const [agents, setAgents] = React.useState<Agent[]>(data);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Edit sheet state
    const [editOpen, setEditOpen] = React.useState(false);
    const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null);

    const openEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setEditOpen(true);
    };

    const handleAdd = (newAgent: Agent) => {
        setAgents((prev) => [...prev, newAgent]);
    };

    const handleSave = (updated: Agent) => {
        setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    };

    const handleDelete = (id: number) => {
        setAgents((prev) => prev.filter((a) => a.id !== id));
        toast.success("Agent deleted.");
    };

    const columns: ColumnDef<Agent>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    className="-ml-3"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Agent Name
                    <ArrowUpDown className="size-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
                        {(row.original.icon ?? "AI")[0]}
                    </div>
                    <div>
                        <div className="font-medium capitalize">{row.getValue("name")}</div>
                        {row.original.href ? (
                            <Link
                                href={row.original.href}
                                className="text-xs text-muted-foreground hover:underline truncate max-w-[180px] block">
                                {row.original.href}
                            </Link>
                        ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                        )}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <Button
                    className="-ml-3"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Category
                    <ArrowUpDown className="size-3" />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="max-w-[260px] truncate text-sm text-muted-foreground">
                    {row.getValue("description") || "—"}
                </div>
            )
        },
        {
            accessorKey: "rating",
            header: ({ column }) => (
                <Button
                    className="-ml-3"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Rating
                    <ArrowUpDown className="size-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const rating = row.getValue("rating") as number | undefined;
                return rating !== undefined ? (
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="size-3.5 fill-current" />
                        <span>{rating.toFixed(1)}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                );
            }
        },
        {
            accessorKey: "usageCount",
            header: ({ column }) => (
                <Button
                    className="-ml-3"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Uses
                    <ArrowUpDown className="size-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const count = row.getValue("usageCount") as number | undefined;
                return <span>{count !== undefined ? count : "—"}</span>;
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    className="-ml-3"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Status
                    <ArrowUpDown className="size-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                const info = statusMap[status] ?? { label: status, variant: "default" };
                return (
                    <Badge variant={info.variant as "success" | "warning" | "default"} className="capitalize">
                        {info.label}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {agent.href && (
                                <DropdownMenuItem asChild>
                                    <Link href={agent.href}>View Agent</Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => openEdit(agent)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(String(agent.id))}>
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(agent.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const table = useReactTable({
        data: agents,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    });

    const statuses = [
        { value: "active", label: "Active" },
        { value: "coming-soon", label: "Coming Soon" },
        { value: "maintaining", label: "Maintaining" }
    ];

    const categories = [
        { value: "research", label: "Research" },
        { value: "writing", label: "Writing" },
        { value: "review", label: "Review" }
    ];

    const Filters = () => (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle />
                        Status
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                    <Command>
                        <CommandInput placeholder="Status" className="h-9" />
                        <CommandList>
                            <CommandEmpty>No status found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(val) => {
                                            const col = table.getColumn("status");
                                            const current = (col?.getFilterValue() as string) ?? "";
                                            col?.setFilterValue(current === val ? "" : val);
                                        }}>
                                        <div className="flex items-center space-x-3 py-1">
                                            <Checkbox
                                                id={status.value}
                                                checked={table.getColumn("status")?.getFilterValue() === status.value}
                                            />
                                            <label
                                                htmlFor={status.value}
                                                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {status.label}
                                            </label>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle />
                        Category
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                    <Command>
                        <CommandInput placeholder="Category" className="h-9" />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((cat) => (
                                    <CommandItem
                                        key={cat.value}
                                        value={cat.label}
                                        onSelect={(val) => {
                                            const col = table.getColumn("category");
                                            const current = (col?.getFilterValue() as string) ?? "";
                                            col?.setFilterValue(current === val ? "" : val);
                                        }}>
                                        <div className="flex items-center space-x-3 py-1">
                                            <Checkbox id={cat.value} />
                                            <label
                                                htmlFor={cat.value}
                                                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {cat.label}
                                            </label>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );

    return (
        <>
            {/* Edit Sheet (rendered outside table to avoid DOM nesting issues) */}
            <EditAgentSheet
                agent={editingAgent}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={handleSave}
            />

            <div className="w-full space-y-4">
                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search agents..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <div className="hidden gap-2 md:flex">
                            <Filters />
                        </div>
                        {/* filter for mobile */}
                        <div className="inline md:hidden">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <FilterIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-60 p-4">
                                    <div className="grid space-y-2">
                                        <Filters />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="ms-auto flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <span className="hidden lg:inline">Columns</span> <ColumnsIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(value)}>
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Add Agent Sheet Button */}
                        <AddAgentSheet onAdd={handleAdd} />
                    </div>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2">
                    <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
