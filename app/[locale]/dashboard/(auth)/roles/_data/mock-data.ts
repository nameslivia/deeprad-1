import { Permission, Role, Group, User } from "./types";

// Permissions organized by category
export const PERMISSIONS: Permission[] = [
    // Dashboard
    { id: "dashboard.own", name: "Dashboard Overview", description: "Can view the full platform-wide dashboard", category: "Dashboard" },

    // Library
    { id: "library.own", name: "Own Files", description: "Can access and manage own files", category: "Library" },

    // Agent
    { id: "agent.trial", name: "All Agents, One Use Each", description: "Can try all Agents once per Agent", category: "Agent" },
    { id: "agent.token", name: "All Available Agents, Per Token", description: "Can use all subscribed Agents billed by token", category: "Agent" },
    { id: "agent.manage", name: "Manage All Agent Settings", description: "Can manage settings for all Agents", category: "Agent" },

    // Report
    { id: "report.personal", name: "Personal Usage Report", description: "Can view own usage records and reports", category: "Report" },
    { id: "report.all", name: "All Users Usage Report", description: "Can view usage records for all users", category: "Report" },

    // Product
    { id: "product.manage", name: "Publish / Unpublish Products", description: "Can publish and unpublish products", category: "Product" },

    // Roles
    { id: "roles.users", name: "User Account Management", description: "Can manage user accounts", category: "Roles" },
    { id: "roles.roles", name: "Role & Permission Settings", description: "Can configure user roles and permissions", category: "Roles" },
];

// Roles with their permissions
export const ROLES: Role[] = [
    {
        id: "trial-user",
        name: "Trial User",
        description: "Trial user with personal view; can try every Agent once",
        permissions: [
            "dashboard.own",
            "library.own",
            "agent.trial",
        ],
        isLocked: false,
        userCount: 209,
    },
    {
        id: "subscriber",
        name: "Subscriber",
        description: "Paid user with personal view; can use all subscribed Agents billed by token",
        permissions: [
            "dashboard.own",
            "library.own",
            "agent.token",
            "report.personal",
        ],
        isLocked: false,
        userCount: 5,
    },
    {
        id: "super-user",
        name: "Super User",
        description: "Company-level user with organization view; can manage all Agent settings and view all reports",
        permissions: [
            "dashboard.own",
            "agent.manage",
            "report.all",
            "product.manage",
            "roles.users",
            "roles.roles",
        ],
        isLocked: false,
        userCount: 3,
    },
    {
        id: "admin",
        name: "Admin",
        description: "Platform administrator with full platform view and all management permissions",
        permissions: [
            "dashboard.own",
            "agent.manage",
            "report.all",
            "product.manage",
            "roles.users",
            "roles.roles",
        ],
        isLocked: true,
        userCount: 1,
    },
];

// Groups for role organization
export const GROUPS: Group[] = [
    {
        id: "core",
        name: "Core Roles",
        description: "Essential system roles",
        type: "core",
        roleIds: ["admin", "super-user"],
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
        roleId: "admin",
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
