"use client";

import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export function UsersTable() {
    const [users, setUsers] = useState<User[]>(USERS.slice(0, 20)); // Show first 20 for demo
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

    return (
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name / Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="w-[50px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const role = getRoleById(user.roleId);
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {role?.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(user.lastActive, "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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
