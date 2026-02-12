"use client";

import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
} from "@tanstack/react-table";
import { USERS, ROLES, getRoleById } from "../_data/mock-data";
import { User } from "../_data/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVerticalIcon, Trash2Icon, UserCogIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";

import { ChangeRoleDialog } from "./change-role-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersTableProps {
    searchQuery?: string;
}

export function UsersTable({ searchQuery = "" }: UsersTableProps) {
    const [users, setUsers] = useState<User[]>(USERS);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleRoleChange = (userId: string, newRoleId: string) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, roleId: newRoleId } : user
            )
        );
        const role = getRoleById(newRoleId);
        toast.success(`Role updated to ${role?.name}`);
    };

    const handleStatusToggle = (userId: string, newStatus: boolean) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: newStatus ? "active" : "inactive" }
                    : user
            )
        );
        toast.success(`User ${newStatus ? "activated" : "deactivated"}`);
    };



    const handleChangeRole = (user: User) => {
        setSelectedUser(user);
        setRoleDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            toast.success(`User ${userToDelete.email} deleted`);
            setUserToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            size: 300,
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name / Email
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3.5" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3.5" />
                        ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                    </button>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-xs">
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "roleId",
            size: 150,
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3.5" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3.5" />
                        ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                    </button>
                );
            },
            cell: ({ row }) => {
                const role = getRoleById(row.original.roleId);
                return (
                    <span className="text-sm font-medium">
                        {role?.name}
                    </span>
                );
            },
            sortingFn: (rowA, rowB) => {
                const roleA = getRoleById(rowA.original.roleId)?.name || "";
                const roleB = getRoleById(rowB.original.roleId)?.name || "";
                return roleA.localeCompare(roleB);
            },
        },
        {
            accessorKey: "status",
            size: 180,
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3.5" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3.5" />
                        ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                    </button>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={user.status === "active"}
                            onCheckedChange={(checked) =>
                                handleStatusToggle(user.id, checked)
                            }
                        />
                        <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={
                                user.status === "active"
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    : ""
                            }
                        >
                            {user.status}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "lastActive",
            size: 180,
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Last Active
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3.5" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3.5" />
                        ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                    </button>
                );
            },
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {format(row.original.lastActive, "MMM dd, yyyy HH:mm")}
                </span>
            ),
        },
        {
            id: "actions",
            size: 80,
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreVerticalIcon className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleChangeRole(user)}
                            >
                                <UserCogIcon className="mr-2 size-4" />
                                Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                className="text-destructive"
                            >
                                <Trash2Icon className="mr-2 size-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(user => {
            const role = getRoleById(user.roleId);
            return (
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                role?.name.toLowerCase().includes(query)
            );
        });
    }, [users, searchQuery]);

    const table = useReactTable({
        data: filteredUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    return (
        <>
            <div className="space-y-4">
                <div className="rounded-lg border">
                    <Table className="table-fixed">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.column.columnDef.size
                                                    ? `${header.column.columnDef.size}px`
                                                    : 'auto'
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-muted-foreground text-sm w-full">
                            Showing {currentPage * 10 + 1} to{" "}
                            {Math.min((currentPage + 1) * 10, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <Pagination className="w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => table.previousPage()}
                                        className={
                                            !table.getCanPreviousPage()
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>

                                {Array.from({ length: pageCount }, (_, i) => i).map((page) => {
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        page === 0 ||
                                        page === pageCount - 1 ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => table.setPageIndex(page)}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => table.nextPage()}
                                        className={
                                            !table.getCanNextPage()
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Change Role Dialog */}
            {selectedUser && (
                <ChangeRoleDialog
                    user={selectedUser}
                    open={roleDialogOpen}
                    onOpenChange={setRoleDialogOpen}
                    onRoleChange={handleRoleChange}
                />
            )}



            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {userToDelete?.name}? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
