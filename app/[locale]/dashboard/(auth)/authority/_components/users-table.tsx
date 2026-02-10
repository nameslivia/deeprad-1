"use client";

import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
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
import { MoreVerticalIcon, ShieldIcon, Trash2Icon, UserCogIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { AdjustPermissionsDialog } from "./adjust-permissions-dialog";
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

export function UsersTable() {
    const [users, setUsers] = useState<User[]>(USERS);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

    const handleAdjustPermissions = (user: User) => {
        setSelectedUser(user);
        setPermissionsDialogOpen(true);
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
            header: "Name / Email",
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
            header: "Role",
            cell: ({ row }) => {
                const role = getRoleById(row.original.roleId);
                return (
                    <span className="text-sm font-medium">
                        {role?.name}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
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
            header: "Last Active",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {format(row.original.lastActive, "MMM dd, yyyy HH:mm")}
                </span>
            ),
        },
        {
            id: "actions",
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
                                onClick={() => handleAdjustPermissions(user)}
                            >
                                <ShieldIcon className="mr-2 size-4" />
                                Adjust Permissions
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

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
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
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Showing {currentPage * 10 + 1} to{" "}
                            {Math.min((currentPage + 1) * 10, users.length)} of {users.length} users
                        </div>
                        <Pagination>
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

            {/* Adjust Permissions Dialog */}
            {selectedUser && (
                <AdjustPermissionsDialog
                    user={selectedUser}
                    open={permissionsDialogOpen}
                    onOpenChange={setPermissionsDialogOpen}
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
