"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ROLES, getRoleById, getPermissionById } from "../_data/mock-data";
import { User } from "../_data/types";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ChangeRoleDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleChange: (userId: string, newRoleId: string) => void;
}

export function ChangeRoleDialog({
    user,
    open,
    onOpenChange,
    onRoleChange,
}: ChangeRoleDialogProps) {
    const currentRole = getRoleById(user.roleId);
    const [selectedRoleId, setSelectedRoleId] = useState<string>(user.roleId);

    const handleSave = () => {
        if (selectedRoleId === user.roleId) {
            toast.info("No changes made");
            onOpenChange(false);
            return;
        }

        onRoleChange(user.id, selectedRoleId);
        const newRole = getRoleById(selectedRoleId);
        toast.success(`Role updated to ${newRole?.name}`);
        onOpenChange(false);
    };

    const selectedRole = getRoleById(selectedRoleId);
    const rolePermissions = selectedRole?.permissions.map(pid => getPermissionById(pid)).filter(Boolean) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Role for {user.name}</DialogTitle>
                    <DialogDescription>
                        Select a new role for this user. Current role: {currentRole?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">New Role</Label>
                        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Role Permissions Preview */}
                    {selectedRole && (
                        <div className="rounded-lg border bg-muted/50 p-3">
                            <p className="mb-2 text-xs font-medium">Role Permissions:</p>
                            <div className="flex flex-wrap gap-1">
                                {rolePermissions.slice(0, 6).map((perm) => (
                                    <Badge key={perm?.id} variant="secondary" className="text-xs">
                                        {perm?.name}
                                    </Badge>
                                ))}
                                {rolePermissions.length > 6 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{rolePermissions.length - 6} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
