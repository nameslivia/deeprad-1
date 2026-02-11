"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function AuthorityPage() {
    const [searchQuery, setSearchQuery] = useState("");

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="roles">Roles</TabsTrigger>
                    </TabsList>
                    <div className="relative w-full sm:justify-between">
                        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <TabsContent value="users" className="space-y-4">
                    <UsersTable searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <RolesTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
