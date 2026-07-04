"use client";

import { Button } from "@/components/ui/Button";

interface FileEmptyStateProps {
  activeTab: string;
  onUploadClick?: () => void;
}

const PremiumFileIllustration = () => {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center select-none">
      {/* Background document sheet */}
      <div className="absolute w-12 h-16 bg-stone-100 border border-stone-200 rounded-lg transform -rotate-12 translate-x-[-12px] opacity-60 shadow-sm transition-transform duration-300"></div>

      {/* Main Foreground document sheet */}
      <div className="absolute w-12 h-16 bg-white border border-stone-200 rounded-lg shadow-md z-10 flex flex-col justify-between p-2">
        {/* Mock content lines */}
        <div className="space-y-1">
          <div className="w-6 h-1 bg-[#615FFF]/35 rounded"></div>
          <div className="w-8 h-1 bg-stone-200 rounded"></div>
          <div className="w-5 h-1 bg-stone-200 rounded"></div>
        </div>
        {/* Tiny brand dot */}
        <div className="flex justify-end">
          <div className="w-3.5 h-3.5 bg-[#615FFF]/10 rounded flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#615FFF] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Interactive bouncing action badge on the right */}
      <div className="absolute w-9 h-9 bg-[#615FFF] border border-[#4E4BCC] rounded-xl shadow-lg z-20 translate-x-[20px] translate-y-[12px] flex items-center justify-center text-white transform rotate-12 animate-bounce">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  );
};

export default function FileEmptyState({ activeTab, onUploadClick }: FileEmptyStateProps) {
  return (
    <div className="text-center py-20 w-full">
      <PremiumFileIllustration />

      <h3 className="text-xl font-semibold text-stone-850 mb-2">
        {activeTab === "all" && "No files available"}
        {activeTab === "starred" && "No starred files"}
        {activeTab === "trash" && "Trash is empty"}
      </h3>

      <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed px-4">
        {activeTab === "all" &&
          "Upload your first file to get started with your personal cloud storage"}
        {activeTab === "starred" &&
          "Mark important files with a star to find them quickly when you need them"}
        {activeTab === "trash" &&
          "Files you delete will appear here before being permanently removed"}
      </p>

      {activeTab === "all" && onUploadClick && (
        <Button
          variant="primary"
          size="md"
          onClick={onUploadClick}
          className="mt-6 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Upload Files
        </Button>
      )}
    </div>
  );
}
