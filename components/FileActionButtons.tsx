"use client";

import { RefreshCw, Trash } from "lucide-react";
import { Button } from "@heroui/button";

interface FileActionButtonsProps {
  activeTab: string;
  trashCount: number;
  folderPath: Array<{ id: string; name: string }>;
  onRefresh: () => void;
  onEmptyTrash: () => void;
}

export default function FileActionButtons({
  activeTab,
  trashCount,
  folderPath,
  onRefresh,
  onEmptyTrash,
}: FileActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <h2 className="text-base font-bold text-stone-800 font-mono uppercase tracking-wider truncate max-w-full">
        {activeTab === "all" &&
          (folderPath.length > 0
            ? folderPath[folderPath.length - 1].name
            : "All Files")}
        {activeTab === "starred" && "Starred Files"}
        {activeTab === "trash" && "Trash"}
      </h2>
      <div className="flex gap-2 sm:gap-3 self-end sm:self-auto">
        <Button
          onClick={onRefresh}
          className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-mono uppercase text-[10px] font-bold tracking-wider rounded-lg h-8 px-3"
          startContent={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Refresh
        </Button>
        {activeTab === "trash" && trashCount > 0 && (
          <Button
            onClick={onEmptyTrash}
            className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 font-mono uppercase text-[10px] font-bold tracking-wider rounded-lg h-8 px-3"
            startContent={<Trash className="h-3.5 w-3.5" />}
          >
            Empty Trash
          </Button>
        )}
      </div>
    </div>
  );
}
