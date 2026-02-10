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
import { PERMISSIONS, getRoleById } from "../_data/mock-data";
import { User } from "../_data/types";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdjustPermissionsDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdjustPermissionsDialog({
    user,
    open,
    onOpenChange,
}: AdjustPermissionsDialogProps) {
    const role = getRoleById(user.roleId);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        user.customPermissions || role?.permissions || []
    );

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSave = () => {
        // In real app, this would update the user's custom permissions
        toast.success("Permissions updated successfully");
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
                    <DialogTitle>Adjust Permissions for {user.name}</DialogTitle>
                    <DialogDescription>
                        Customize permissions for this user. Default role: {role?.name}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-6">
                        {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                            <div key={category} className="space-y-3">
                                <h4 className="font-semibold text-sm">{category}</h4>
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
                        ))}
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
