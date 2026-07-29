"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Modal, ModalContent } from "@heroui/modal";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import type { File as FileType } from "@/lib/db/schema";

interface DashboardContentProps {
  userId: string;
  userName: string;
  initialFiles: FileType[];
}

export default function DashboardContent({
  userId,
  userName,
  initialFiles,
}: DashboardContentProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFileUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFolderChange = (folderId: string | null) => {
    setCurrentFolder(folderId);
  };

  return (
    <div className="w-full">
      {/* Grid Layout: Compact, Full-Width File Showcase */}
      <FileList
        userId={userId}
        initialFiles={initialFiles}
        refreshTrigger={refreshTrigger}
        onFolderChange={handleFolderChange}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Upload Dialog Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-transparent shadow-none border-none p-0 max-w-lg mx-4",
        }}
      >
        <ModalContent>
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 z-50 p-1 bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 rounded-full transition-colors cursor-pointer focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
            <FileUploadForm 
              userId={userId} 
              onUploadSuccess={handleFileUploadSuccess}
              currentFolder={currentFolder}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
