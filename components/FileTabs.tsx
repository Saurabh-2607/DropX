"use client";

import { File, Star, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { type File as FileType } from "@/lib/db/schema";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: {
    id: string;
    isTrash: boolean;
    [key: string]: any;
  }[];
  starredCount: number;
  trashCount: number;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={(key) => onTabChange(key)}
      className="w-full"
    >
      <TabsList className="flex gap-2 sm:gap-4 md:gap-6">
        <TabsTrigger value="all" className="flex items-center gap-2 sm:gap-3">
          <File className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">All Files</span>
          <Badge
            variant="secondary"
            className="ml-2"
            aria-label={`${files.filter((file) => !file.isTrash).length} files`}
          >
            {files.filter((file) => !file.isTrash).length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="starred" className="flex items-center gap-2 sm:gap-3">
          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Starred</span>
          <Badge
            variant="default"
            className="ml-2"
            aria-label={`${starredCount} starred files`}
          >
            {starredCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="trash" className="flex items-center gap-2 sm:gap-3">
          <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Trash</span>
          <Badge
            variant="destructive"
            className="ml-2"
            aria-label={`${trashCount} files in trash`}
          >
            {trashCount}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        {/* Content for All Files */}
      </TabsContent>
      <TabsContent value="starred">
        {/* Content for Starred Files */}
      </TabsContent>
      <TabsContent value="trash">
        {/* Content for Trash */}
      </TabsContent>
    </Tabs>
  );
}
