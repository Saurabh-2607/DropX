"use client";

import { File, Star, Trash } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import type { File as FileType } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
  onEmptyTrash?: () => void;
  onUploadClick?: () => void;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
  onEmptyTrash,
  onUploadClick,
}: FileTabsProps) {
  // Only count non-folder files for the counter display
  const allFilesCount = files.filter((file) => !file.isTrash && !file.isFolder).length;

  return (
    <div className="flex justify-between items-center border-b border-stone-100 w-full pb-0.5 min-h-[44px]">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => onTabChange(key as string)}
        variant="underlined"
        classNames={{
          base: "overflow-x-auto",
          tabList: "gap-2 sm:gap-4 md:gap-6 flex-nowrap border-b-0",
          tab: "py-3 whitespace-nowrap text-stone-600 hover:text-stone-900 data-[selected=true]:text-[#615FFF] font-mono uppercase text-xs font-bold tracking-wider cursor-pointer",
          cursor: "bg-[#615FFF] h-[2px]",
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span className="font-medium">All Files</span>
              <Badge
                variant="flat"
                color="default"
                size="sm"
                aria-label={`${allFilesCount} files`}
              >
                {allFilesCount}
              </Badge>
            </div>
          }
        />
        <Tab
          key="starred"
          title={
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="font-medium">Starred</span>
              <Badge
                variant="flat"
                color="warning"
                size="sm"
                aria-label={`${starredCount} starred files`}
              >
                {starredCount}
              </Badge>
            </div>
          }
        />
        <Tab
          key="trash"
          title={
            <div className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              <span className="font-medium">Trash</span>
              <Badge
                variant="solid"
                color="danger"
                size="sm"
                aria-label={`${trashCount} files in trash`}
              >
                {trashCount}
              </Badge>
            </div>
          }
        />
      </Tabs>

      <div className="flex items-center gap-2">
        {activeTab === "trash" && trashCount > 0 && onEmptyTrash ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEmptyTrash}
            className="h-8 text-[10px] px-3 gap-1 border-red-200 bg-red-50/50 hover:bg-red-50 text-red-700 hover:text-red-800 hover:border-red-300"
          >
            <Trash className="h-3.5 w-3.5" />
            Empty Trash
          </Button>
        ) : (
          onUploadClick && (
            <Button
              variant="primary"
              size="md"
              onClick={onUploadClick}
              className="gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Upload Files
            </Button>
          )
        )}
      </div>
    </div>
  );
}
