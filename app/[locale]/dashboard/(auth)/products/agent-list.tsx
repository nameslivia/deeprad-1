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
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    ClipboardCopy,
    ColumnsIcon,
    ExternalLink,
    FilterIcon,
    MoreVerticalIcon,
    Pencil,
    PlusCircle,
    PlusIcon,
    Star,
    Trash2
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
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

const statusColorMap: Record<Agent["status"], string> = {
    "active": "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    "coming-soon": "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    "maintaining": "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
};

const statusLabelMap: Record<Agent["status"], string> = {
    "active": "Active",
    "coming-soon": "Coming Soon",
    "maintaining": "Maintaining"
};

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
    const [status, setStatus] = React.useState<Agent["status"]>("active");
    const [href, setHref] = React.useState("");

    const reset = () => {
        setName("");
        setCategory("");
        setDescription("");
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
    const [status, setStatus] = React.useState<Agent["status"]>("active");
    const [href, setHref] = React.useState("");

    // Sync form fields when the target agent changes
    React.useEffect(() => {
        if (agent) {
            setName(agent.name ?? "");
            setCategory(agent.category ?? "");
            setDescription(agent.description ?? "");
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

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deletingAgent, setDeletingAgent] = React.useState<Agent | null>(null);
    const [deleteConfirmInput, setDeleteConfirmInput] = React.useState("");

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

    const openDeleteDialog = (agent: Agent) => {
        setDeletingAgent(agent);
        setDeleteConfirmInput("");
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!deletingAgent) return;
        setAgents((prev) => prev.filter((a) => a.id !== deletingAgent.id));
        toast.success(`Agent "${deletingAgent.name}" deleted.`);
        setDeleteDialogOpen(false);
        setDeletingAgent(null);
        setDeleteConfirmInput("");
    };

    const columns: ColumnDef<Agent>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Agent Name
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3.5" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                    )}
                </button>
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
                <button
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Category
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3.5" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                    )}
                </button>
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
                <button
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Rating
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3.5" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                    )}
                </button>
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
                <button
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Uses
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3.5" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const count = row.getValue("usageCount") as number | undefined;
                return <span>{count !== undefined ? count : "—"}</span>;
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Status
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3.5" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3.5" />
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                const label = statusLabelMap[status] ?? status;
                const colorClass = statusColorMap[status] ?? "";
                return (
                    <Badge variant="outline" className={`capitalize font-normal ${colorClass}`}>
                        {label}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreVerticalIcon className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {agent.href && (
                                <DropdownMenuItem asChild>
                                    <Link href={agent.href}>
                                        <ExternalLink className="mr-2 size-4" />
                                        View Agent
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => openEdit(agent)}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(String(agent.id))}>
                                <ClipboardCopy className="mr-2 size-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => openDeleteDialog(agent)}>
                                <Trash2 className="mr-2 size-4" />
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
        state: {
            sorting,
            columnFilters,
            columnVisibility
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
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
                setDeleteDialogOpen(open);
                if (!open) setDeleteConfirmInput("");
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Agent</DialogTitle>
                        <DialogDescription>
                            This action <strong>cannot be undone</strong>. This will permanently delete the agent{" "}
                            <strong>{deletingAgent?.name}</strong> and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-sm text-muted-foreground">
                            Please type <span className="font-semibold text-foreground">{deletingAgent?.name}</span> to confirm.
                        </p>
                        <Input
                            placeholder={deletingAgent?.name ?? ""}
                            value={deleteConfirmInput}
                            onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={deleteConfirmInput !== deletingAgent?.name}
                            onClick={handleDelete}>
                            I understand, delete this agent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                                    <TableRow key={row.id}>
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
                    <div className="flex-1" />
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
