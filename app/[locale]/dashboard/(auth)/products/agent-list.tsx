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
    Star
} from "lucide-react";
import Link from "next/link";

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

export const columns: ColumnDef<Agent>[] = [
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
                        {row.original.href && (
                            <DropdownMenuItem asChild>
                                <Link href={row.original.href}>View Agent</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(row.original.id))}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export default function AgentList({ data }: { data: Agent[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
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
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search agents..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
    );
}
