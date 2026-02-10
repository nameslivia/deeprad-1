"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PERMISSIONS } from "../_data/mock-data";
import { Role } from "../_data/types";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditRolePermissionsDialogProps {
    role: Role;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updatedRole: Role) => void;
}

export function EditRolePermissionsDialog({
    role,
    open,
    onOpenChange,
    onSave,
}: EditRolePermissionsDialogProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        role.permissions
    );

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSelectAll = (category: string) => {
        const categoryPermissions = PERMISSIONS.filter(p => p.category === category).map(p => p.id);
        const allSelected = categoryPermissions.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
        }
    };

    const handleSave = () => {
        const updatedRole: Role = {
            ...role,
            permissions: selectedPermissions,
        };
        onSave(updatedRole);
        toast.success(`Permissions updated for ${role.name}`);
        onOpenChange(false);
    };

    // Group permissions by category
    const permissionsByCategory = PERMISSIONS.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {} as Record<string, typeof PERMISSIONS>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Permissions for {role.name}</DialogTitle>
                    <DialogDescription>
                        Select the permissions for this role. {selectedPermissions.length} of {PERMISSIONS.length} permissions selected.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-6">
                        {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                            const categoryPermissionIds = permissions.map(p => p.id);
                            const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
                            const someSelected = categoryPermissionIds.some(id => selectedPermissions.includes(id));

                            return (
                                <div key={category} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">{category}</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSelectAll(category)}
                                            className="h-7 text-xs"
                                        >
                                            {allSelected ? "Deselect All" : "Select All"}
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-start space-x-3">
                                                <Checkbox
                                                    id={permission.id}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={() => handleTogglePermission(permission.id)}
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <Label
                                                        htmlFor={permission.id}
                                                        className="cursor-pointer font-medium text-sm"
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                    <p className="text-muted-foreground text-xs">
                                                        {permission.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
