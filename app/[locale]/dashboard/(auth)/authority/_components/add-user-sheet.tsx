"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ROLES, GROUPS, PERMISSIONS, getPermissionById } from "../_data/mock-data";
import { UserPlusIcon, ShuffleIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function AddUserSheet() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        const length = 16;
        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast.success("Password generated successfully");
    };

    const handleAddUser = (closeAfter: boolean) => {
        if (!email || !password || !selectedRole) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Mock user creation
        toast.success(`User ${email} added successfully`);

        if (closeAfter) {
            setOpen(false);
            resetForm();
        } else {
            resetForm();
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setSelectedRole("");
        setStatus(true);
        setSelectedGroup("");
    };

    const selectedRoleData = ROLES.find(r => r.id === selectedRole);
    const rolePermissions = selectedRoleData?.permissions.map(pid => getPermissionById(pid)).filter(Boolean) || [];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <UserPlusIcon className="size-4" />
                    Add Users
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Add New User</SheetTitle>
                    <SheetDescription>
                        Create a new user account with role and permissions
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Email/Username */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email / Username <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="password"
                                type="text"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={generatePassword}
                                        >
                                            <ShuffleIcon className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Generate random password</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">
                            Role <span className="text-destructive">*</span>
                        </Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Role Permissions Preview */}
                        {selectedRoleData && (
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

                    {/* Group */}
                    <div className="space-y-2">
                        <Label htmlFor="group">Group (Optional)</Label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                            <SelectTrigger id="group">
                                <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                                {GROUPS.map((group) => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="status">Status</Label>
                            <p className="text-muted-foreground text-xs">
                                Set user account status
                            </p>
                        </div>
                        <Switch
                            id="status"
                            checked={status}
                            onCheckedChange={setStatus}
                        />
                    </div>

                    {/* CSV Bulk Upload */}
                    <div className="space-y-2">
                        <Label>Bulk Upload</Label>
                        <div className="border-muted-foreground/25 hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6 transition-colors">
                            <UploadIcon className="text-muted-foreground mb-2 size-8" />
                            <p className="text-muted-foreground mb-1 text-sm font-medium">
                                Drop CSV file here or click to upload
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Upload multiple users at once
                            </p>
                        </div>
                    </div>
                </div>

                <SheetFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleAddUser(true)}>
                        Add & Close
                    </Button>
                    <Button onClick={() => handleAddUser(false)}>
                        Add & New
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
