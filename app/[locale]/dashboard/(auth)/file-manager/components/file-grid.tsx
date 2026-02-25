"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { Download, MoreHorizontal, Folder, FileText, File } from "lucide-react";
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

interface FileGridProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  selectable?: boolean;
}

function getFileIcon(iconType: string, className?: string) {
  const base = cn("h-8 w-8", className);
  switch (iconType) {
    case "folder":
    case "folder-upload":
    case "folder-report":
      return <Folder className={cn(base, "text-yellow-500")} />;
    case "pdf":
      return <FileText className={cn(base, "text-red-500")} />;
    case "word":
      return <FileText className={cn(base, "text-blue-500")} />;
    case "figma":
      return <File className={cn(base, "text-purple-500")} />;
    default:
      return <File className={cn(base, "text-gray-500")} />;
  }
}

export function FileGrid({ items, onItemClick, onDownload, selectable = false }: FileGridProps) {
  const { selectedFileIds, toggleFileSelection, isFileSelected } = useFileManagerStore();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isSelected = isFileSelected(item.id);

        return (
          <Card
            key={item.id}
            className={cn(
              "group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onItemClick(item)}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {/* Icon and Checkbox */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {getFileIcon(item.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectable && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleFileSelection(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
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

                {/* File Info */}
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm" title={item.name}>
                    {item.name}
                  </p>
                  {item.type === "folder" && item.label && item.label !== item.name && (
                    <p className="truncate text-xs text-muted-foreground mt-0.5" title={item.label}>
                      {item.label}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{item.size}</p>
                </div>

                {/* Owner & Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={item.owner.avatar} />
                      <AvatarFallback className="text-xs">
                        {item.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{item.owner.name}</span>
                  </div>
                  <span>{item.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
