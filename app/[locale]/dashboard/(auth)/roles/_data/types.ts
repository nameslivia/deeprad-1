export interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[]; // Permission IDs
    isLocked: boolean; // Super Admin is locked
    userCount: number;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    type: "core" | "department" | "custom";
    roleIds: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roleId: string;
    status: "active" | "inactive";
    lastActive: Date;
    groupId?: string;
    customPermissions?: string[]; // Override permissions
}

export interface UserFilters {
    roles: string[];
    status: "all" | "active" | "inactive";
    lastActiveDays?: number;
    searchQuery?: string;
}

export interface UserFormData {
    email: string;
    password: string;
    roleId: string;
    status: "active" | "inactive";
    groupId?: string;
}
