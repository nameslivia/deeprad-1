import { generateMeta } from "@/lib/utils";
import {
    TotalUsersCard,
    RoleDistributionCard,
    ActiveUsersCard,
    AddUserSheet,
    UsersTable,
    RolesTable,
} from "./_components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateMetadata() {
    return generateMeta({
        title: "Authority",
        description: "User and role management dashboard",
        canonical: "/authority"
    });
}

export default function AuthorityPage() {
    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Authority</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage users, roles, and permissions
                    </p>
                </div>
                <AddUserSheet />
            </div>

            {/* Summary Cards */}
            <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
                <TotalUsersCard />
                <RoleDistributionCard />
                <ActiveUsersCard />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <UsersTable />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <RolesTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
