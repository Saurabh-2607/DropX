"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { FileText, X } from "lucide-react";
import { Modal, ModalContent } from "@heroui/modal";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
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
      <div className="w-full">
        <Card className="border border-stone-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#615FFF]" />
              <h2 className="text-lg font-bold text-stone-850 font-mono uppercase tracking-wider">Your Files</h2>
            </div>
            
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#615FFF] hover:bg-[#4F4DDF] text-white font-mono uppercase text-xs font-bold tracking-wider rounded-xl h-9 px-4 flex items-center gap-2 transition-colors cursor-pointer select-none shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Upload Files
            </button>
          </CardHeader>
          <CardBody className="p-6">
            <FileList
              userId={userId}
              refreshTrigger={refreshTrigger}
              onFolderChange={handleFolderChange}
            />
          </CardBody>
        </Card>
      </div>

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
