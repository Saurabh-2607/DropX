"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { addToast } from "@heroui/toast";
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

interface QueueItem {
  id: string;
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

const FileTypeIcon = ({ name }: { name: string }) => {
  const extension = name.split(".").pop()?.toUpperCase() || "FILE";
  return (
    <div className="relative w-10 h-10 bg-white border border-stone-200 rounded flex items-center justify-center overflow-hidden shrink-0">
      <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <div className="absolute bottom-0 right-0 left-0 bg-stone-50 text-[8px] font-mono text-stone-500 font-bold uppercase tracking-wider text-center py-0.5 border-t border-stone-200">
        {extension.substring(0, 3)}
      </div>
    </div>
  );
};

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [uploadQueue, setUploadQueue] = useState<QueueItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFilesToQueue = (files: File[]) => {
    // Sort files by newest to oldest
    const sortedFiles = [...files].sort((a, b) => b.lastModified - a.lastModified);
    const newItems: QueueItem[] = sortedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "idle",
    }));

    setUploadQueue((prev) => [...newItems, ...prev]);

    // Trigger upload sequentially
    newItems.forEach((item) => {
      uploadFileItem(item.id, item.file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadFileItem = async (itemId: string, fileToUpload: File) => {
    // Validate file size (5MB limit)
    if (fileToUpload.size > 5 * 1024 * 1024) {
      setUploadQueue((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: "error", error: "File exceeds 5MB limit", progress: 0 }
            : item
        )
      );
      addToast({
        title: "File Too Large",
        description: `"${fileToUpload.name}" exceeds the 5MB limit.`,
        color: "danger",
      });
      return;
    }

    setUploadQueue((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: "uploading" } : item
      )
    );

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadQueue((prev) =>
              prev.map((item) =>
                item.id === itemId ? { ...item, progress: percentCompleted } : item
              )
            );
          }
        },
      });

      setUploadQueue((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: "success", progress: 100 } : item
        )
      );

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error("Error uploading queue item:", err);
      setUploadQueue((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: "error", error: "Upload failed", progress: 0 }
            : item
        )
      );
      addToast({
        title: "Upload Failed",
        description: `Could not upload "${fileToUpload.name}".`,
        color: "danger",
      });
    }
  };

  const removeItem = (itemId: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearAllQueue = () => {
    setUploadQueue([]);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-stone-200 rounded-2xl p-6 shadow-sm text-stone-800">
      {/* Card Header */}
      <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-6">
        <span className="font-mono text-base font-bold uppercase tracking-wider text-stone-900">
          Upload Files
        </span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-colors rounded-xl py-12 px-6 text-center cursor-pointer mb-6"
      >
        {/* Beautiful Stacked Cards Illustration */}
        <div className="relative h-24 w-36 mx-auto flex items-center justify-center mb-6">
          {/* Card 1 */}
          <div className="absolute w-14 h-20 bg-white border border-stone-200 rounded shadow-sm transform -rotate-12 translate-x-[-14px] flex flex-col p-2 gap-1 select-none opacity-60">
            <div className="w-6 h-1.5 bg-stone-200 rounded-full animate-pulse" />
            <div className="w-10 h-1 bg-stone-150 rounded-full" />
            <div className="w-8 h-1 bg-stone-100 rounded-full" />
          </div>
          {/* Card 2 */}
          <div className="absolute w-14 h-20 bg-white border border-stone-200 rounded shadow-sm transform rotate-12 translate-x-[14px] flex flex-col p-2 gap-1 select-none opacity-60">
            <div className="w-6 h-1.5 bg-stone-200 rounded-full animate-pulse" />
            <div className="w-10 h-1 bg-stone-150 rounded-full" />
            <div className="w-8 h-1 bg-stone-100 rounded-full" />
          </div>
          {/* Card 3 */}
          <div className="absolute w-16 h-22 bg-white border border-stone-300 rounded-lg shadow-md flex flex-col p-2.5 gap-2 select-none z-10">
            <div className="w-8 h-1.5 bg-stone-300 rounded-full" />
            <div className="w-12 h-1 bg-stone-200 rounded-full" />
            <div className="w-10 h-1 bg-stone-150 rounded-full" />
            <div className="w-6 h-1 bg-stone-100 rounded-full" />
            
            {/* Floating badges */}
            <div className="absolute -bottom-2 -right-4 bg-stone-900 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded shadow border border-stone-850">
              PDF
            </div>
            <div className="absolute -bottom-1 -left-4 bg-stone-100 text-stone-700 text-[8px] font-bold font-mono px-2 py-0.5 rounded shadow border border-stone-200">
              ZIP
            </div>
          </div>
        </div>

        <p className="text-stone-700 text-sm font-semibold">
          Drag & drop files or <span className="text-[#615FFF] hover:underline">browse</span>
        </p>
        <p className="text-xs text-stone-400 mt-2 font-mono leading-relaxed">
          Supports PDF, JSX, ZIP, CSV, MD, images, and more
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Queue list */}
      {uploadQueue.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 px-1 border-b border-stone-100">
            <span className="text-xs font-mono font-bold tracking-wider text-stone-400">
              QUEUE ({uploadQueue.length})
            </span>
            <button
              onClick={clearAllQueue}
              className="text-xs font-mono font-bold tracking-wider text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1.5 custom-scrollbar">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                  item.status === "success"
                    ? "bg-emerald-50/20 border-emerald-100/85"
                    : item.status === "error"
                      ? "bg-red-50/20 border-red-100/85"
                      : "bg-white border-stone-200/85 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileTypeIcon name={item.file.name} />
                    <div className="text-left">
                      <p className="text-sm font-semibold font-mono text-stone-700 truncate max-w-[200px]">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">
                        {item.status === "success"
                          ? `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`
                          : `${((item.file.size * item.progress / 100) / (1024 * 1024)).toFixed(2)} MB of ${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "success" && (
                      <span className="bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider">
                        SUCCESS
                      </span>
                    )}
                    {item.status === "error" && (
                      <span className="bg-red-100/80 text-red-800 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider">
                        FAILED
                      </span>
                    )}
                    {item.status === "uploading" && (
                      <span className="bg-blue-50 text-[#615FFF] px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider animate-pulse">
                        {item.progress}%
                      </span>
                    )}
                    {item.status === "idle" && (
                      <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider">
                        QUEUED
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-600 rounded-md transition-colors focus:outline-none cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden mt-1.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.status === "success"
                        ? "bg-emerald-500"
                        : item.status === "error"
                          ? "bg-red-500"
                          : "bg-[#615FFF]"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
