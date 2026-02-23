import { Permission, Role, Group, User } from "./types";

// Permissions organized by category
export const PERMISSIONS: Permission[] = [
    // User Management
    { id: "users.create", name: "Create Users", description: "Can create new users", category: "User Management" },
    { id: "users.edit", name: "Edit Users", description: "Can edit user information", category: "User Management" },
    { id: "users.delete", name: "Delete Users", description: "Can delete users", category: "User Management" },
    { id: "users.permissions", name: "Manage User Permissions", description: "Can adjust individual user permissions", category: "User Management" },

    // Role Management
    { id: "roles.view", name: "View Roles", description: "Can view role list and details", category: "Role Management" },
    { id: "roles.create", name: "Create Roles", description: "Can create new roles", category: "Role Management" },
    { id: "roles.edit", name: "Edit Roles", description: "Can edit role permissions", category: "Role Management" },
    { id: "roles.delete", name: "Delete Roles", description: "Can delete roles", category: "Role Management" },

    // Analytics
    { id: "analytics.view", name: "View Analytics", description: "Can view analytics dashboard", category: "Analytics" },
    { id: "analytics.export", name: "Export Analytics", description: "Can export analytics data", category: "Analytics" },

    // Settings
    { id: "settings.view", name: "View Settings", description: "Can view system settings", category: "Settings" },
    { id: "settings.edit", name: "Edit Settings", description: "Can modify system settings", category: "Settings" },
    { id: "settings.security", name: "Security Settings", description: "Can manage security settings", category: "Settings" },

    // Billing
    { id: "billing.view", name: "View Billing", description: "Can view billing information", category: "Billing" },
    { id: "billing.manage", name: "Manage Billing", description: "Can manage billing and subscriptions", category: "Billing" },
];

// Roles with their permissions
export const ROLES: Role[] = [
    {
        id: "super-admin",
        name: "Super Admin",
        description: "Full system access with all permissions",
        permissions: PERMISSIONS.map(p => p.id), // All permissions
        isLocked: true,
        userCount: 1,
    },
    {
        id: "admin",
        name: "Admin",
        description: "Administrative access with most permissions",
        permissions: [
            "users.create", "users.edit", "users.delete", "users.permissions",
            "roles.view", "roles.create", "roles.edit",
            "analytics.view", "analytics.export",
            "settings.view", "settings.edit",
            "billing.view",
        ],
        isLocked: false,
        userCount: 3,
    },
    {
        id: "subscriber",
        name: "Subscriber",
        description: "Content moderation and user management",
        permissions: [
            "users.edit",
            "analytics.view",
        ],
        isLocked: false,
        userCount: 5,
    },
    {
        id: "trial-user",
        name: "Trial User",
        description: "Basic user access",
        permissions: [
            "content.view", "content.create",
            "analytics.view",
        ],
        isLocked: false,
        userCount: 209,
    },
];

// Groups for role organization
export const GROUPS: Group[] = [
    {
        id: "core",
        name: "Core Roles",
        description: "Essential system roles",
        type: "core",
        roleIds: ["super-admin", "admin"],
    },
    {
        id: "dept-marketing",
        name: "Marketing",
        description: "Marketing department roles",
        type: "department",
        roleIds: [],
    },
    {
        id: "dept-sales",
        name: "Sales",
        description: "Sales department roles",
        type: "department",
        roleIds: [],
    },
    {
        id: "dept-engineering",
        name: "Engineering",
        description: "Engineering department roles",
        type: "department",
        roleIds: [],
    },
    {
        id: "custom-1",
        name: "Content Team",
        description: "Content creation and moderation",
        type: "custom",
        roleIds: ["subscriber"],
    },
];

// Static date strings to avoid hydration errors (30 different dates to rotate through)
const STATIC_DATES = [
    "2024-02-10T14:30:00", "2024-02-10T10:15:00", "2024-02-09T16:45:00",
    "2024-02-09T14:20:00", "2024-02-09T11:30:00", "2024-02-08T15:10:00",
    "2024-02-08T09:45:00", "2024-02-07T16:20:00", "2024-02-07T13:15:00",
    "2024-02-06T18:30:00", "2024-02-06T11:00:00", "2024-02-05T14:45:00",
    "2024-02-05T10:30:00", "2024-02-04T16:15:00", "2024-02-04T09:20:00",
    "2024-02-03T15:40:00", "2024-02-03T11:25:00", "2024-02-02T17:10:00",
    "2024-02-02T13:50:00", "2024-02-01T14:35:00", "2024-01-31T16:20:00",
    "2024-01-31T10:45:00", "2024-01-30T15:30:00", "2024-01-30T09:15:00",
    "2024-01-29T14:00:00", "2024-01-28T11:40:00", "2024-01-27T16:25:00",
    "2024-01-26T13:10:00", "2024-01-25T10:55:00", "2024-01-24T15:20:00",
];

// Mock users data
export const USERS: User[] = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        roleId: "super-admin",
        status: "active",
        lastActive: new Date("2024-02-10T14:30:00"),
        groupId: "core",
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        roleId: "admin",
        status: "active",
        lastActive: new Date("2024-02-10T10:15:00"),
        groupId: "core",
    },
    {
        id: "3",
        name: "Carol Williams",
        email: "carol.williams@example.com",
        roleId: "admin",
        status: "active",
        lastActive: new Date("2024-02-09T16:45:00"),
        groupId: "core",
    },
    {
        id: "4",
        name: "David Brown",
        email: "david.brown@example.com",
        roleId: "admin",
        status: "inactive",
        lastActive: new Date("2024-01-28T09:20:00"),
    },
    {
        id: "5",
        name: "Emma Davis",
        email: "emma.davis@example.com",
        roleId: "subscriber",
        status: "active",
        lastActive: new Date("2024-02-10T13:00:00"),
        groupId: "custom-1",
    },
    {
        id: "6",
        name: "Frank Miller",
        email: "frank.miller@example.com",
        roleId: "subscriber",
        status: "active",
        lastActive: new Date("2024-02-10T11:30:00"),
        groupId: "custom-1",
    },
    {
        id: "7",
        name: "Grace Wilson",
        email: "grace.wilson@example.com",
        roleId: "subscriber",
        status: "active",
        lastActive: new Date("2024-02-09T14:20:00"),
        groupId: "custom-1",
    },
    {
        id: "8",
        name: "Henry Moore",
        email: "henry.moore@example.com",
        roleId: "subscriber",
        status: "active",
        lastActive: new Date("2024-02-08T15:10:00"),
        groupId: "custom-1",
    },
    {
        id: "9",
        name: "Ivy Taylor",
        email: "ivy.taylor@example.com",
        roleId: "subscriber",
        status: "inactive",
        lastActive: new Date("2024-01-15T10:00:00"),
    },
    {
        id: "10",
        name: "Jack Anderson",
        email: "jack.anderson@example.com",
        roleId: "trial-user",
        status: "active",
        lastActive: new Date("2024-02-10T15:45:00"),
    },
    // Adding more users to reach 218 total with static dates
    ...Array.from({ length: 208 }, (_, i) => ({
        id: `${i + 11}`,
        name: `User ${i + 11}`,
        email: `user${i + 11}@example.com`,
        roleId: "trial-user",
        status: (i % 10 === 0 ? "inactive" : "active") as "active" | "inactive",
        lastActive: new Date(STATIC_DATES[i % STATIC_DATES.length]), // Use static dates in rotation
    })),
];

// Helper functions
export function getRoleById(roleId: string): Role | undefined {
    return ROLES.find(r => r.id === roleId);
}

export function getPermissionById(permissionId: string): Permission | undefined {
    return PERMISSIONS.find(p => p.id === permissionId);
}

export function getUsersByRole(roleId: string): User[] {
    return USERS.filter(u => u.roleId === roleId);
}

export function getActiveUsersCount(): number {
    return USERS.filter(u => u.status === "active").length;
}

export function getRoleDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    ROLES.forEach(role => {
        distribution[role.name] = USERS.filter(u => u.roleId === role.id).length;
    });
    return distribution;
}

export function getUserTrend(): { value: number; isPositive: boolean } {
    // Mock trend data - in real app, this would compare with previous period
    return {
        value: 5.2, // 5.2% increase
        isPositive: true,
    };
}
