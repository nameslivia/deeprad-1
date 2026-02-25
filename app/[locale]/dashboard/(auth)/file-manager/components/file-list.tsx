"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Folder, FileText, File, UploadCloud, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileManagerStore } from "../stores/file-manager-store";

interface FileItem {
  id: string;
  name: string;
  label?: string;
  type: string;
  icon: string;
  date: string;
  size: string;
  owner: {
    name: string;
    avatar?: string;
  };
  [key: string]: any; // Allow additional properties
}

interface FileListProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  selectable?: boolean;
}

function getFileIcon(iconType: string, className?: string) {
  const base = cn("h-5 w-5", className);
  switch (iconType) {
    case "folder":
      return <Folder className={cn(base, "text-yellow-500")} />;
    case "folder-upload":
      return <UploadCloud className={cn(base, "text-blue-500")} />;
    case "folder-report":
      return <BookOpen className={cn(base, "text-emerald-500")} />;
    case "pdf":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
          <FileText className="size-3" />
        </div>
      );
    case "word":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
          W
        </div>
      );
    case "figma":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500 text-xs font-bold text-white">
          F
        </div>
      );
    default:
      return <File className={cn(base, "text-gray-500")} />;
  }
}

export function FileList({ items, onItemClick, onDownload, selectable = false }: FileListProps) {
  const { selectedFileIds, toggleFileSelection, isFileSelected } = useFileManagerStore();

  return (
    <div className="divide-y rounded-lg border">
      {items.map((item) => {
        const isSelected = isFileSelected(item.id);

        return (
          <div
            key={item.id}
            className={cn(
              "flex cursor-pointer items-center justify-between p-3 transition-all duration-150 hover:bg-muted lg:p-4",
              isSelected && "bg-primary/5"
            )}
            onClick={() => onItemClick(item)}>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {selectable && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleFileSelection(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="shrink-0">{getFileIcon(item.icon)}</div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {item.name}
                </p>
                {item.type === "folder" && item.label && item.label !== item.name && (
                  <p className="truncate text-xs text-muted-foreground">{item.label}</p>
                )}
                <p className="text-xs text-muted-foreground lg:hidden">{item.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="hidden w-24 text-right lg:inline">{item.date}</span>
              <span className="hidden w-20 text-right lg:inline">{item.size}</span>
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={item.owner.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{item.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(item);
                    }}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
