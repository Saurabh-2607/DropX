import React, { memo } from "react";
import { Star, Trash, Check, MoreVertical } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import type { File as FileType } from "@/lib/db/schema";

interface FileItemProps {
  file: FileType;
  index: number;
  isSelected: boolean;
  activeTab: string;
  onToggleSelect: (id: string, e?: React.MouseEvent) => void;
  onLightboxOpen: (index: number) => void;
  onStarFile: (file: FileType) => void;
  onDownloadFile: (file: FileType) => void;
  onTrashFile: (file: FileType) => void;
  onPermanentDelete: (file: FileType) => void;
}

const FileIllustration = memo(({ type, name }: { type: string; name: string }) => {
  const extension = name.split(".").pop()?.toUpperCase() || "FILE";

  let bgClass = "bg-stone-50 border-stone-200 text-stone-600";
  let iconColor = "text-stone-400";

  if (type.includes("pdf")) {
    bgClass = "bg-red-50/40 border-red-150 text-red-700";
    iconColor = "text-red-400";
  } else if (type.includes("zip") || type.includes("compressed") || type.includes("tar")) {
    bgClass = "bg-amber-50/40 border-amber-150 text-amber-700";
    iconColor = "text-amber-400";
  } else if (
    type.includes("javascript") ||
    type.includes("typescript") ||
    type.includes("html") ||
    type.includes("css") ||
    type.includes("json") ||
    extension === "JSX" ||
    extension === "TSX" ||
    extension === "JS" ||
    extension === "TS"
  ) {
    bgClass = "bg-blue-50/40 border-blue-150 text-blue-700";
    iconColor = "text-blue-400";
  } else if (type.startsWith("audio/")) {
    bgClass = "bg-purple-50/40 border-purple-150 text-purple-700";
    iconColor = "text-purple-400";
  } else if (type.includes("csv") || type.includes("sheet") || type.includes("excel") || extension === "CSV") {
    bgClass = "bg-emerald-50/40 border-emerald-150 text-emerald-700";
    iconColor = "text-emerald-400";
  }

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 border rounded-xl ${bgClass} select-none`}>
      <div className="relative flex flex-col items-center justify-center gap-1.5">
        <svg className={`w-10 h-10 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 bg-white/90 border border-stone-200/50 rounded shadow-sm">
          {extension.substring(0, 4)}
        </span>
      </div>
    </div>
  );
});
FileIllustration.displayName = "FileIllustration";

const FileItem = memo(({
  file,
  index,
  isSelected,
  activeTab,
  onToggleSelect,
  onLightboxOpen,
  onStarFile,
  onDownloadFile,
  onTrashFile,
  onPermanentDelete
}: FileItemProps) => {
  return (
    <div
      onClick={() => onLightboxOpen(index)}
      className={`relative w-full pb-[100%] h-0 rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 ${isSelected
        ? 'border-[#615FFF] ring-2 ring-[#615FFF]/20 bg-[#615FFF]/5'
        : 'border-stone-200 bg-stone-50 hover:shadow-md group'
        }`}
    >
      {/* Select Checkbox */}
      <div
        onClick={(e) => onToggleSelect(file.id, e)}
        className={`absolute top-3 left-3 z-30 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${isSelected
          ? 'bg-[#615FFF] border-[#615FFF] text-white shadow-sm'
          : 'bg-white/80 border-stone-300 opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-white text-transparent'
          }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {file.type.startsWith("image/") ? (
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:w-300,h-300,fo-auto/${file.path}`}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : file.type.startsWith("video/") ? (
        <div className="absolute inset-0 w-full h-full bg-stone-900 overflow-hidden">
          <video
            src={file.fileUrl}
            preload="metadata"
            className="w-full h-full object-cover opacity-80"
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-2.5 bg-stone-900/80 rounded-full border border-stone-850 text-white shadow-md transition-transform group-hover:scale-110">
              <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <FileIllustration type={file.type} name={file.name} />
      )}

      {/* Hover overlay with Actions */}
      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white z-20">
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button
                className="p-1 bg-stone-900/80 hover:bg-stone-950 rounded-lg transition-colors border border-stone-850 text-white focus:outline-none cursor-pointer flex items-center justify-center"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="File actions"
              onAction={(key) => {
                if (key === "select") onToggleSelect(file.id);
                else if (key === "star") onStarFile(file);
                else if (key === "download") onDownloadFile(file);
                else if (key === "restore") onTrashFile(file);
                else if (key === "delete") {
                  if (activeTab === "trash") {
                    onPermanentDelete(file);
                  } else {
                    onTrashFile(file);
                  }
                }
              }}
              classNames={{
                base: "font-mono uppercase text-[10px]",
              }}
            >
              <DropdownItem
                key="select"
                startContent={<Check className="h-3.5 w-3.5 text-stone-400" />}
              >
                {isSelected ? "Deselect File" : "Select File"}
              </DropdownItem>
              {activeTab === "trash" ? (
                <DropdownItem
                  key="restore"
                  startContent={
                    <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  }
                >
                  Restore File
                </DropdownItem>
              ) : (
                <>
                  <DropdownItem
                    key="star"
                    startContent={<Star className={`h-3.5 w-3.5 ${file.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-stone-400'}`} />}
                  >
                    {file.isStarred ? "Unstar File" : "Star File"}
                  </DropdownItem>
                  <DropdownItem
                    key="download"
                    startContent={
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    }
                  >
                    Download
                  </DropdownItem>
                </>
              )}
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash className="h-3.5 w-3.5" />}
              >
                {activeTab === "trash" ? "Delete Permanently" : "Move to Trash"}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="text-left pointer-events-none">
          <p className="text-xs font-mono font-bold truncate">{file.name}</p>
          <p className="text-[10px] text-stone-300 font-mono mt-0.5">
            {file.size < 1024
              ? `${file.size} B`
              : file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(1)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
          </p>
        </div>
      </div>
    </div>
  );
});

FileItem.displayName = "FileItem";

export default FileItem;
