"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileActions({
  file,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Download button */}
      {!file.isTrash && !file.isFolder && (
        <Button>
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}

      {/* Star button */}
      {!file.isTrash && (
        <Button>
          <span className="hidden sm:inline">
          <Star
            className={`h-4 w-4 ${
              file.isStarred
                ? "text-yellow-400 fill-current"
                : "text-gray-400"
            }`}
          />
            {file.isStarred ? "Unstar" : "Star"}
          </span>
        </Button>
      )}

      {/* Trash/Restore button */}
      <Button>
        <span className="hidden sm:inline">
            <ArrowUpFromLine className="h-4 w-4" />
          ) : (
            <Trash className="h-4 w-4" />
          )
          {file.isTrash ? "Restore" : "Delete"}
        </span>
      </Button>

      {/* Delete permanently button */}
      {file.isTrash && (
        <Button>
          <span className="hidden sm:inline">Remove</span>
        </Button>
      )}
    </div>
  );
}
