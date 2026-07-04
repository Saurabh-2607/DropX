"use client";

import { ArrowUpFromLine } from "lucide-react";
import { Button } from "@heroui/button";

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
}: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm overflow-x-auto pb-2">
      <Button
        variant="flat"
        size="sm"
        isIconOnly
        onClick={navigateUp}
        isDisabled={folderPath.length === 0}
        className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-lg min-w-8 h-8"
      >
        <ArrowUpFromLine className="h-4 w-4" />
      </Button>
      <Button
        variant="flat"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={`bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-mono uppercase text-[10px] font-bold tracking-wider rounded-lg h-8 px-3 ${folderPath.length === 0 ? "border-[#615FFF] text-[#615FFF] bg-[#615FFF]/5" : ""}`}
      >
        Home
      </Button>
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <span className="mx-1 text-stone-400 font-mono">/</span>
          <Button
            variant="flat"
            size="sm"
            onClick={() => navigateToPathFolder(index)}
            className={`bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-mono uppercase text-[10px] font-bold tracking-wider rounded-lg h-8 px-3 text-ellipsis overflow-hidden max-w-[150px] ${index === folderPath.length - 1 ? "border-[#615FFF] text-[#615FFF] bg-[#615FFF]/5" : ""}`}
            title={folder.name}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
