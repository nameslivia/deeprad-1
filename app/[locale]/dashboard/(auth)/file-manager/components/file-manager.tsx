"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Folder,
  Home,
  UploadCloud,
  BookOpen,
  HardDrive,
  LayoutGrid,
  List,
  FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";
import { BulkActionsBar } from "./bulk-actions-bar";
import { FilePreviewModal } from "./file-preview-modal";
import { useFileManagerStore } from "../stores/file-manager-store";
import { toast } from "sonner";

import allFileItems from "../data.json";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentFolder = (typeof allFileItems)[number];
type SubFolder = AgentFolder["children"][number];
type FileItem = SubFolder["children"][number];
type AnyItem = AgentFolder | SubFolder | FileItem;

// ─── Storage mock data ────────────────────────────────────────────────────────

const STORAGE_TOTAL_GB = 10;
const STORAGE_USED_GB = 3.2;
const STORAGE_USED_PERCENT = (STORAGE_USED_GB / STORAGE_TOTAL_GB) * 100;

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function FolderIconLarge({ icon }: { icon: string }) {
  switch (icon) {
    case "folder-upload":
      return <UploadCloud className="h-10 w-10 text-blue-500" />;
    case "folder-report":
      return <BookOpen className="h-10 w-10 text-emerald-500" />;
    default:
      return <Folder className="h-10 w-10 text-yellow-500" />;
  }
}

// ─── Storage indicator ────────────────────────────────────────────────────────

function StorageBar() {
  const remaining = STORAGE_TOTAL_GB - STORAGE_USED_GB;
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2">
      <HardDrive className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{STORAGE_USED_GB} GB used</span>
          <span className="font-medium text-foreground">
            {remaining.toFixed(1)} GB free
          </span>
        </div>
        <Progress value={STORAGE_USED_PERCENT} className="h-1.5" />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{STORAGE_TOTAL_GB} GB</span>
    </div>
  );
}

// ─── Split panel for agent level ─────────────────────────────────────────────

function AgentSplitView({
  agentFolder,
  onNavigate,
  onDownloadZip,
  searchQuery,
  viewMode,
}: {
  agentFolder: AgentFolder;
  onNavigate: (subFolderName: string) => void;
  onDownloadZip: (name: string) => void;
  searchQuery: string;
  viewMode: "grid" | "list";
}) {
  const uploads = agentFolder.children.find((c) => c.name === "uploads");
  const reports = agentFolder.children.find((c) => c.name === "reports");

  function SubPanel({ folder }: { folder: typeof uploads }) {
    if (!folder) return null;
    const filteredFiles = folder.children.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border-2 border-dashed border-border">
        {/* Sub-folder header */}
        <div
          className="flex cursor-pointer items-center gap-3 border-b bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
          onClick={() => onNavigate(folder.name)}>
          <FolderIconLarge icon={folder.icon} />
          <div className="min-w-0 flex-1">
            <span className="font-semibold capitalize">{folder.label ?? folder.name}</span>
            <p className="mt-0.5 text-xs text-muted-foreground">{folder.size}</p>
          </div>
          <span className="text-xs text-muted-foreground">{filteredFiles.length} files</span>
        </div>

        {/* Files content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredFiles.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpen className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No files yet</EmptyTitle>
                {/* <EmptyDescription>
                  Drag and drop files here to upload
                </EmptyDescription> */}
              </EmptyHeader>
            </Empty>
          ) : viewMode === "grid" ? (
            <FileGrid
              items={filteredFiles as any[]}
              onItemClick={() => { }}
              onDownload={(item) => onDownloadZip(item.name)}
              selectable={false}
            />
          ) : (
            <FileList
              items={filteredFiles as any[]}
              onItemClick={() => { }}
              onDownload={(item) => onDownloadZip(item.name)}
              selectable={false}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-0 lg:flex-row">
      <SubPanel folder={uploads} />
      <SubPanel folder={reports} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type SortOption = "name" | "date" | "size";
type SortDirection = "asc" | "desc";

export function FileManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  const { viewMode, setViewMode, clearSelection } = useFileManagerStore();

  const currentPath = searchParams.get("path") || "";
  const pathSegments = currentPath ? currentPath.split("/").filter(Boolean) : [];

  const isMobile = useIsMobile();

  useEffect(() => {
    setSearchQuery("");
    clearSelection();
  }, [currentPath, clearSelection]);

  // ── Sort helpers ──
  const parseFileSize = (s: string): number => {
    const n = Number.parseFloat(s);
    if (s.includes("GB")) return n * 1e9;
    if (s.includes("MB")) return n * 1e6;
    if (s.includes("KB")) return n * 1e3;
    return n;
  };

  const parseDate = (d: string): number => {
    const [day, month, year] = d.split(".");
    return new Date(2000 + +year, +month - 1, +day).getTime();
  };

  const sortItems = <T extends { name: string; date: string; size: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "date") cmp = parseDate(a.date) - parseDate(b.date);
      else cmp = parseFileSize(a.size) - parseFileSize(b.size);
      return sortDirection === "asc" ? cmp : -cmp;
    });

  const getSortLabel = () => {
    const dir = sortDirection === "asc" ? "↑" : "↓";
    return `${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ${dir}`;
  };

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  // ── Navigation ──
  const navigateTo = (segments: string[]) => {
    if (segments.length === 0) router.push("?");
    else router.push(`?path=${encodeURIComponent(segments.join("/"))}`);
  };

  const handleBreadcrumbClick = (index: number) => {
    navigateTo(pathSegments.slice(0, index + 1));
  };

  const handleDownloadZip = (name: string) => {
    toast.success(`Preparing "${name}.zip" for download...`);
  };

  const handleItemClick = (item: any) => {
    if (item.type === "folder") {
      navigateTo([...pathSegments, item.name]);
    } else {
      setPreviewFile(item);
    }
  };

  // ── Determine view level ──
  const agentFolder =
    pathSegments.length >= 1
      ? allFileItems.find((a) => a.name === pathSegments[0]) ?? null
      : null;

  const subFolder =
    agentFolder && pathSegments.length >= 2
      ? agentFolder.children.find((c) => c.name === pathSegments[1]) ?? null
      : null;

  // Items for level 0 (agent folders) or level 2 (files in sub-folder)
  const level0Items = sortItems(
    allFileItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const level2Items = subFolder
    ? sortItems(
      (subFolder.children as FileItem[]).filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : [];

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        {/* ── Header row ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Library</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your uploaded files, organize content and control access
                </p>
              </div>
            </div>
            {pathSegments.length > 0 && (
              <div className="flex items-center overflow-x-auto">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="cursor-pointer" onClick={() => navigateTo([])}>
                      <Home className="h-4 w-4" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {pathSegments.map((seg, i) => (
                      <Fragment key={i}>
                        <BreadcrumbItem
                          className="cursor-pointer"
                          onClick={() => handleBreadcrumbClick(i)}>
                          {seg}
                        </BreadcrumbItem>
                        {i < pathSegments.length - 1 && <BreadcrumbSeparator />}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}
          </div>

          {/* Storage bar */}
          <div className="w-full sm:w-64">
            <StorageBar />
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search files and folders…"
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <Toggle
                size="sm"
                pressed={viewMode === "grid"}
                onPressedChange={() => setViewMode("grid")}
                aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={viewMode === "list"}
                onPressedChange={() => setViewMode("list")}
                aria-label="List view">
                <List className="h-4 w-4" />
              </Toggle>
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  Sort: {getSortLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(["name", "date", "size"] as SortOption[]).map((opt) => (
                  <DropdownMenuItem key={opt} onClick={() => handleSortChange(opt)}>
                    <div className="flex w-full items-center justify-between">
                      <span className="capitalize">{opt}</span>
                      {sortBy === opt && (
                        <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* ── Content ── */}
        <div className="min-w-0">
          {/* LEVEL 0: Root — agent folder grid/list */}
          {pathSegments.length === 0 && (
            <>
              {level0Items.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderOpen className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>No agents found</EmptyTitle>
                    <EmptyDescription>
                      No agents matching &quot;{searchQuery}&quot;
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : viewMode === "grid" ? (
                <FileGrid
                  items={level0Items as any[]}
                  onItemClick={handleItemClick}
                  onDownload={(item) => handleDownloadZip(item.name)}
                  selectable={true}
                />
              ) : (
                <FileList
                  items={level0Items as any[]}
                  onItemClick={handleItemClick}
                  onDownload={(item) => handleDownloadZip(item.name)}
                  selectable={true}
                />
              )}
            </>
          )}

          {/* LEVEL 1: Agent split view (uploads | reports) */}
          {pathSegments.length === 1 && agentFolder && (
            <AgentSplitView
              agentFolder={agentFolder}
              onNavigate={(sub) => navigateTo([pathSegments[0], sub])}
              onDownloadZip={handleDownloadZip}
              searchQuery={searchQuery}
              viewMode={viewMode}
            />
          )}

          {/* LEVEL 2: Sub-folder file list */}
          {pathSegments.length === 2 && subFolder && (
            <>
              {level2Items.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderOpen className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>
                      {searchQuery ? "No files found" : "This folder is empty"}
                    </EmptyTitle>
                    {/* <EmptyDescription>
                      {searchQuery
                        ? `No files matching "${searchQuery}"`
                        : "Drag and drop files here to upload"}
                    </EmptyDescription> */}
                  </EmptyHeader>
                </Empty>
              ) : viewMode === "grid" ? (
                <FileGrid
                  items={level2Items as any[]}
                  onItemClick={handleItemClick}
                  onDownload={(item) => handleDownloadZip(item.name)}
                  selectable={true}
                />
              ) : (
                <FileList
                  items={level2Items as any[]}
                  onItemClick={handleItemClick}
                  onDownload={(item) => handleDownloadZip(item.name)}
                  selectable={true}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        onDownloadSelected={() => handleDownloadZip("selected files")}
        onDeleteSelected={() => { }}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
        file={previewFile}
        onDownload={() => previewFile && handleDownloadZip(previewFile.name)}
      />
    </>
  );
}
