"use client";

import { useState } from "react";
import { ROLES, PERMISSIONS, getPermissionById } from "../_data/mock-data";
import { Role } from "../_data/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, Trash2Icon, LockIcon } from "lucide-react";
import { EditRolePermissionsDialog } from "./edit-role-permissions-dialog";
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
import { toast } from "sonner";

export function RolesTable() {
    const [roles, setRoles] = useState<Role[]>(ROLES);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const handleEditRole = (role: Role) => {
        if (role.isLocked) {
            toast.error("Super Admin role cannot be edited");
            return;
        }
        setSelectedRole(role);
        setEditDialogOpen(true);
    };

    const handleDeleteRole = (role: Role) => {
        if (role.isLocked) {
            toast.error("Super Admin role cannot be deleted");
            return;
        }
        if (role.userCount > 0) {
            toast.error(`Cannot delete role with ${role.userCount} assigned users`);
            return;
        }
        setRoleToDelete(role);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
            toast.success(`Role ${roleToDelete.name} deleted`);
            setRoleToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    // Group permissions by category
    const getPermissionsByCategory = (permissionIds: string[]) => {
        const permissions = permissionIds.map(id => getPermissionById(id)).filter(Boolean);
        return permissions.reduce((acc, perm) => {
            if (perm) {
                if (!acc[perm.category]) {
                    acc[perm.category] = [];
                }
                acc[perm.category].push(perm);
            }
            return acc;
        }, {} as Record<string, typeof permissions>);
    };

    return (
        <>
            <div className="space-y-4">
                {roles.map((role) => {
                    const permissionsByCategory = getPermissionsByCategory(role.permissions);
                    const topPermissions = role.permissions.slice(0, 5).map(id => getPermissionById(id)).filter(Boolean);

                    return (
                        <Card key={role.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{role.name}</CardTitle>
                                            {role.isLocked && (
                                                <LockIcon className="text-muted-foreground size-4" />
                                            )}
                                        </div>
                                        <CardDescription className="mt-1">
                                            {role.description}
                                        </CardDescription>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="secondary">{role.userCount} users</Badge>
                                            <Badge variant="outline">{role.permissions.length} permissions</Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditRole(role)}
                                            disabled={role.isLocked}
                                        >
                                            <EditIcon className="mr-2 size-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteRole(role)}
                                            disabled={role.isLocked || role.userCount > 0}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2Icon className="mr-2 size-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Top permissions preview */}
                                <div className="mb-4">
                                    <p className="mb-2 text-xs font-medium">Key Permissions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {topPermissions.map((perm) => (
                                            <Badge key={perm?.id} variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                                {perm?.name}
                                            </Badge>
                                        ))}
                                        {role.permissions.length > 5 && (
                                            <Badge variant="secondary">
                                                +{role.permissions.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Accordion for full permission tree */}
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="permissions" className="border-0">
                                        <AccordionTrigger className="text-sm hover:no-underline">
                                            View All Permissions
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 pt-2">
                                                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                                                    <div key={category}>
                                                        <h5 className="mb-2 font-semibold text-sm">{category}</h5>
                                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                            {permissions.map((perm) => (
                                                                <div key={perm?.id} className="flex items-start gap-2">
                                                                    <Badge variant="default" className="mt-0.5 bg-green-500/10 text-green-600">
                                                                        ✓
                                                                    </Badge>
                                                                    <div>
                                                                        <p className="text-sm font-medium">{perm?.name}</p>
                                                                        <p className="text-muted-foreground text-xs">
                                                                            {perm?.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Edit Role Permissions Dialog */}
            {selectedRole && (
                <EditRolePermissionsDialog
                    role={selectedRole}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onSave={(updatedRole) => {
                        setRoles(prev =>
                            prev.map(r => (r.id === updatedRole.id ? updatedRole : r))
                        );
                    }}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the role "{roleToDelete?.name}"? This action
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
