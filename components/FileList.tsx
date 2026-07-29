"use client";

import { useEffect, useState, useMemo } from "react";
import { Star, Trash, X, MoreVertical, Check } from "lucide-react";
import { addToast } from "@heroui/toast";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileTabs from "@/components/FileTabs";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
  onUploadClick?: () => void;
}

const getFriendlyFileType = (type: string, name: string) => {
  if (type === "folder") return "Folder";
  const ext = name.split(".").pop()?.toUpperCase() || "";
  if (!ext) return type;

  if (type.startsWith("image/")) return `${ext} Image`;
  if (type.includes("pdf")) return "PDF Document";
  if (type.includes("zip") || type.includes("compressed")) return `${ext} Archive`;
  if (type.includes("javascript") || type.includes("typescript") || ext === "JSX" || ext === "TSX") return `${ext} File`;
  if (type.startsWith("video/")) return `${ext} Video`;
  if (type.startsWith("text/")) return `${ext} Document`;

  return `${ext} File`;
};

const FileIllustration = ({ type, name }: { type: string; name: string }) => {
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
};

const FileIconLarge = ({ type, name }: { type: string; name: string }) => {
  const extension = name.split(".").pop()?.toUpperCase() || "FILE";
  let iconColor = "text-stone-400";

  if (type.includes("pdf")) iconColor = "text-red-500";
  else if (type.includes("zip") || type.includes("compressed")) iconColor = "text-amber-500";
  else if (type.includes("javascript") || type.includes("typescript") || extension === "JSX") iconColor = "text-blue-500";
  else if (type.startsWith("audio/")) iconColor = "text-purple-500";
  else if (type.includes("csv") || extension === "CSV") iconColor = "text-emerald-500";

  return (
    <div className="w-16 h-16 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center relative shadow-lg">
      <svg className={`w-8 h-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span className="absolute bottom-1.5 right-2 bg-stone-800 text-[8px] font-mono font-bold text-stone-300 px-1 py-0.2 rounded border border-stone-700">
        {extension.substring(0, 3)}
      </span>
    </div>
  );
};

export default function FileList({
  userId,
  refreshTrigger = 0,
  onUploadClick,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Lightbox & Modal states
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());

  // Image Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sharpen, setSharpen] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [savingState, setSavingState] = useState<"idle" | "saving" | "saving-as">("idle");

  useEffect(() => {
    setIsEditing(false);
    setBrightness(0);
    setContrast(0);
    setBlur(0);
    setSharpen(0);
    setRotation(0);
    setGrayscale(false);
  }, [lightboxIndex]);

  const getPreviewImageUrl = (file: FileType) => {
    return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,c-at_max/${file.path}`;
  };

  const getEditedImageUrl = (file: FileType) => {
    const tr = ['q-90', 'w-1600', 'c-at_max'];
    if (brightness !== 0) tr.push(`e-brightness-${brightness}`);
    if (contrast !== 0) tr.push(`e-contrast-${contrast}`);
    if (blur > 0) tr.push(`bl-${blur}`);
    if (sharpen > 0) tr.push(`e-sharpen-${sharpen}`);
    if (rotation !== 0) tr.push(`rt-${rotation}`);
    if (grayscale) tr.push('e-grayscale');
    
    return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:${tr.join(',')}/${file.path}`;
  };

  const handleSaveEdit = async () => {
    if (lightboxIndex === null) return;
    const file = filteredFiles[lightboxIndex];
    setSavingState("saving");
    try {
      const url = getEditedImageUrl(file);
      const res = await fetch(url);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob, file.name);

      const response = await axios.post(`/api/files/${file.id}/replace`, formData);
      if (response.status === 200) {
        setFiles(files.map(f => f.id === file.id ? response.data : f));
        setIsEditing(false);
        addToast({ title: "Image saved successfully", color: "success" });
      }
    } catch (error) {
      addToast({ title: "Error saving image", color: "danger", description: "Could not save the edited image." });
    } finally {
      setSavingState("idle");
    }
  };

  const handleSaveAsEdit = async () => {
    if (lightboxIndex === null) return;
    const file = filteredFiles[lightboxIndex];
    setSavingState("saving-as");
    try {
      const url = getEditedImageUrl(file);
      const res = await fetch(url);
      const blob = await res.blob();
      const formData = new FormData();
      const newName = file.name.replace(/(\.[^.]+)$/, '_edited$1');
      formData.append("file", blob, newName);
      formData.append("userId", userId);
      if (file.parentId) formData.append("parentId", file.parentId);

      const response = await axios.post(`/api/files/upload`, formData);
      if (response.status === 200) {
        setFiles([response.data, ...files]);
        setIsEditing(false);
        addToast({ title: "Image copy saved successfully", color: "success" });
      }
    } catch (error) {
      addToast({ title: "Error saving image copy", color: "danger", description: "Could not save the copy." });
    } finally {
      setSavingState("idle");
    }
  };

  const handleDownloadEdit = async () => {
    if (lightboxIndex === null) return;
    try {
      const url = getEditedImageUrl(filteredFiles[lightboxIndex]);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = isEditing ? filteredFiles[lightboxIndex].name.replace(/(\.[^.]+)$/, '_edited$1') : filteredFiles[lightboxIndex].name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      addToast({ title: "Download failed", color: "danger" });
    }
  };

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/files?userId=${userId}`);
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      addToast({
        title: "Error Loading Files",
        description: "We couldn't load your files. Please try again later.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch files when userId or refreshTrigger changes
  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger]);

  // Filter files based on active tab and filter out folders
  const filteredFiles = useMemo(() => {
    let result = files;

    if (activeTab === "starred") {
      result = result.filter((file) => file.isStarred && !file.isTrash);
    } else if (activeTab === "trash") {
      result = result.filter((file) => file.isTrash);
    } else {
      result = result.filter((file) => !file.isTrash);
    }

    return result.filter((file) => !file.isFolder);
  }, [files, activeTab]);

  // Count files in trash
  const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash && !file.isFolder).length;
  }, [files]);

  // Count starred files
  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash && !file.isFolder).length;
  }, [files]);

  const handleStarFile = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: file?.isStarred ? "Removed from Starred" : "Added to Starred",
        description: `"${file?.name}" has been ${file?.isStarred ? "removed from" : "added to"
          } your starred files`,
        color: "success",
      });
    } catch (error) {
      console.error("Error starring file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the star status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleTrashFile = async (fileId: string) => {
    try {
      const response = await axios.patch(`/api/files/${fileId}/trash`);
      const responseData = response.data;

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isTrash: !file.isTrash } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: responseData.isTrash ? "Moved to Trash" : "Restored from Trash",
        description: `"${file?.name}" has been ${responseData.isTrash ? "moved to trash" : "restored"
          }`,
        color: "success",
      });
    } catch (error) {
      console.error("Error trashing file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the file status. Please try again.",
        color: "danger",
      });
    }
  };

  // Reset selection on tab change
  useEffect(() => {
    setSelectedFileIds(new Set());
  }, [activeTab]);

  const toggleSelectFile = (fileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedFileIds(new Set());
  };

  const selectAll = () => {
    setSelectedFileIds(new Set(filteredFiles.map((file) => file.id)));
  };

  const handleBulkStar = async () => {
    try {
      addToast({
        title: "Updating Star Status",
        description: `Updating ${selectedFileIds.size} files...`,
        color: "primary",
      });

      const ids = Array.from(selectedFileIds);
      await Promise.all(ids.map(id => axios.patch(`/api/files/${id}/star`)));

      const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
      const allSelectedAreStarred = selectedFiles.every(f => f.isStarred);

      setFiles(
        files.map((file) =>
          selectedFileIds.has(file.id) ? { ...file, isStarred: !allSelectedAreStarred } : file
        )
      );

      addToast({
        title: "Update Successful",
        description: `Successfully updated starred status`,
        color: "success",
      });
      clearSelection();
    } catch (error) {
      console.error("Error bulk starring:", error);
      addToast({
        title: "Bulk Action Failed",
        description: "Failed to update some files. Please try again.",
        color: "danger",
      });
    }
  };

  const handleBulkTrash = async () => {
    try {
      addToast({
        title: "Moving Files to Trash",
        description: `Moving ${selectedFileIds.size} files...`,
        color: "primary",
      });

      const ids = Array.from(selectedFileIds);
      await Promise.all(ids.map(id => axios.patch(`/api/files/${id}/trash`)));

      setFiles(
        files.map((file) =>
          selectedFileIds.has(file.id) ? { ...file, isTrash: true } : file
        )
      );

      addToast({
        title: "Moved to Trash",
        description: `Successfully moved files to trash`,
        color: "success",
      });
      clearSelection();
    } catch (error) {
      console.error("Error bulk trashing:", error);
      addToast({
        title: "Bulk Action Failed",
        description: "Failed to move some files to trash.",
        color: "danger",
      });
    }
  };

  const handleBulkRestore = async () => {
    try {
      addToast({
        title: "Restoring Files",
        description: `Restoring ${selectedFileIds.size} files...`,
        color: "primary",
      });

      const ids = Array.from(selectedFileIds);
      await Promise.all(ids.map(id => axios.patch(`/api/files/${id}/trash`)));

      setFiles(
        files.map((file) =>
          selectedFileIds.has(file.id) ? { ...file, isTrash: false } : file
        )
      );

      addToast({
        title: "Files Restored",
        description: `Successfully restored files from trash`,
        color: "success",
      });
      clearSelection();
    } catch (error) {
      console.error("Error bulk restoring:", error);
      addToast({
        title: "Bulk Action Failed",
        description: "Failed to restore some files.",
        color: "danger",
      });
    }
  };

  const handleBulkDelete = () => {
    if (activeTab !== "trash") {
      handleBulkTrash();
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedFileIds.size > 0) {
        addToast({
          title: "Deleting Files",
          description: `Permanently deleting ${selectedFileIds.size} files...`,
          color: "danger",
        });

        const ids = Array.from(selectedFileIds);
        await Promise.all(ids.map(id => axios.delete(`/api/files/${id}`)));

        setFiles(files.filter((file) => !selectedFileIds.has(file.id)));

        addToast({
          title: "Deletion Complete",
          description: `${ids.length} files permanently deleted`,
          color: "success",
        });
        clearSelection();
        setDeleteModalOpen(false);
      } else if (selectedFile) {
        await handleDeleteFile(selectedFile.id);
      }
    } catch (error) {
      console.error("Error confirming delete:", error);
      addToast({
        title: "Deletion Failed",
        description: "Failed to delete files. Please try again.",
        color: "danger",
      });
    }
  };

  const handleBulkDownload = async () => {
    const filesToDownload = files.filter(f => selectedFileIds.has(f.id));
    if (filesToDownload.length === 0) return;

    addToast({
      title: "Downloading Files",
      description: `Starting downloads for ${filesToDownload.length} files...`,
      color: "primary",
    });

    for (const file of filesToDownload) {
      try {
        let downloadUrl = file.fileUrl;
        if (file.type.startsWith("image/")) {
          downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
        }

        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Failed");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (e) {
        console.error("Failed to download", file.name, e);
      }
    }

    addToast({
      title: "Downloads Started",
      description: `Completed processing files`,
      color: "success",
    });
    clearSelection();
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await axios.delete(`/api/files/${fileId}`);
      if (response.status === 200) {
        // Remove file from local state
        setFiles(files.filter((file) => file.id !== fileId));

        // Show toast
        addToast({
          title: "File Deleted",
          description: `"${selectedFile?.name}" has been permanently deleted`,
          color: "success",
        });

        // Close modal if it was open
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      addToast({
        title: "Deletion Failed",
        description: "We couldn't delete the file. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);

      // Remove all trashed files from local state
      setFiles(files.filter((file) => !file.isTrash));

      // Show toast
      addToast({
        title: "Trash Emptied",
        description: `All ${trashCount} items have been permanently deleted`,
        color: "success",
      });

      // Close modal
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't empty the trash. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      addToast({
        title: "Preparing Download",
        description: `Getting "${file.name}" ready for download...`,
        color: "primary",
      });

      let downloadUrl = file.fileUrl;
      if (file.type.startsWith("image/")) {
        downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
      }

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Failed to download file`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);

      addToast({
        title: "Download Ready",
        description: `"${file.name}" is ready to download.`,
        color: "success",
      });

      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      addToast({
        title: "Download Failed",
        description: "We couldn't download the file. Please try again later.",
        color: "danger",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-8 items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-[#615FFF] rounded-full animate-spin" />
        <span className="text-xs font-mono text-stone-400">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedFileIds.size > 0 ? (
        <div className="flex justify-between items-center border-b border-stone-100 w-full py-2.5 h-[52px]">
          <div className="flex items-center gap-3 text-stone-700 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span>{selectedFileIds.size} Selected</span>
            <button
              onClick={clearSelection}
              className="text-[#615FFF] hover:text-[#4F4DDF] font-bold transition-colors cursor-pointer select-none"
            >
              Clear
            </button>
            <button
              onClick={selectAll}
              className="text-stone-400 hover:text-stone-600 font-bold transition-colors cursor-pointer select-none"
            >
              Select All
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "trash" ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkRestore}
                className="h-7 text-[9px] px-2.5 gap-1 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 hover:border-emerald-300"
              >
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Restore
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkStar}
                  className="h-7 text-[9px] px-2.5 gap-1"
                >
                  <Star className="h-3 w-3 text-stone-500" />
                  Star
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkDownload}
                  className="h-7 text-[9px] px-2.5 gap-1"
                >
                  <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkDelete}
              className="h-7 text-[9px] px-2.5 gap-1 border-red-200 bg-red-50/50 hover:bg-red-50 text-red-700 hover:text-red-800 hover:border-red-300"
            >
              <Trash className="h-3 w-3" />
              {activeTab === "trash" ? "Delete Permanently" : "Trash"}
            </Button>
          </div>
        </div>
      ) : (
        /* Tabs for filtering files */
        <FileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          files={files}
          starredCount={starredCount}
          trashCount={trashCount}
          onEmptyTrash={() => setEmptyTrashModalOpen(true)}
          onUploadClick={onUploadClick}
        />
      )}

      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} onUploadClick={onUploadClick} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredFiles.map((file, index) => (
            <div
              key={file.id}
              onClick={() => setLightboxIndex(index)}
              className={`relative w-full pb-[100%] h-0 rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 ${selectedFileIds.has(file.id)
                ? 'border-[#615FFF] ring-2 ring-[#615FFF]/20 bg-[#615FFF]/5'
                : 'border-stone-200 bg-stone-50 hover:shadow-md group'
                }`}
            >
              {/* Select Checkbox */}
              <div
                onClick={(e) => toggleSelectFile(file.id, e)}
                className={`absolute top-3 left-3 z-30 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${selectedFileIds.has(file.id)
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
                        if (key === "select") toggleSelectFile(file.id);
                        else if (key === "star") handleStarFile(file.id);
                        else if (key === "download") handleDownloadFile(file);
                        else if (key === "restore") handleTrashFile(file.id);
                        else if (key === "delete") {
                          if (activeTab === "trash") {
                            setSelectedFile(file);
                            setDeleteModalOpen(true);
                          } else {
                            handleTrashFile(file.id);
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
                        {selectedFileIds.has(file.id) ? "Deselect File" : "Select File"}
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
          ))}
        </div>
      )}

      {/* Lightbox / Expanded View */}
      {lightboxIndex !== null && filteredFiles[lightboxIndex] && (
        <div className="fixed inset-0 bg-stone-950/95 z-[999] flex flex-col justify-between p-4 md:p-8 backdrop-blur-sm select-none">
          {/* Top Bar */}
          <div className="flex justify-between items-center text-white">
            <div className="text-left">
              <h3 className="text-sm font-mono font-bold truncate max-w-[200px] sm:max-w-md">
                {filteredFiles[lightboxIndex].name}
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                {lightboxIndex + 1} of {filteredFiles.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {filteredFiles[lightboxIndex].type.startsWith("image/") && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-stone-800 border-stone-700 text-white hover:bg-stone-700"
                >
                  {isEditing ? "Exit Editor" : "Edit Image"}
                </Button>
              )}
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 bg-stone-900 hover:bg-stone-850 rounded-full border border-stone-800 transition-colors cursor-pointer text-white focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Showcase Area */}
          <div className={`flex-grow flex items-center justify-between gap-4 py-4 relative ${isEditing ? 'md:mr-80' : ''}`}>
            {/* Previous Button */}
            {!isEditing && (
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredFiles.length - 1
                  )
                }
                className="absolute left-2 md:left-4 z-10 p-3 bg-stone-900/60 hover:bg-stone-900 border border-stone-800/50 rounded-full text-white transition-colors cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Expanded Content */}
            <div className="w-full h-full flex items-center justify-center max-h-[75vh] p-4 transition-all duration-300">
              {filteredFiles[lightboxIndex].type.startsWith("image/") ? (
                <img
                  src={getPreviewImageUrl(filteredFiles[lightboxIndex])}
                  alt={filteredFiles[lightboxIndex].name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-100"
                  style={isEditing ? {
                    filter: `brightness(${100 + brightness}%) contrast(${100 + contrast}%) blur(${blur / 10}px) ${grayscale ? 'grayscale(100%)' : ''}`,
                    transform: `rotate(${rotation}deg)`
                  } : {}}
                />
              ) : filteredFiles[lightboxIndex].type.startsWith("video/") ? (
                <video
                  src={filteredFiles[lightboxIndex].fileUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full text-center gap-4 shadow-2xl">
                  <FileIconLarge type={filteredFiles[lightboxIndex].type} name={filteredFiles[lightboxIndex].name} />
                  <div className="text-center w-full">
                    <h4 className="text-base font-mono font-bold text-white truncate px-4">{filteredFiles[lightboxIndex].name}</h4>
                    <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mt-1">
                      {getFriendlyFileType(filteredFiles[lightboxIndex].type, filteredFiles[lightboxIndex].name)}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleDownloadFile(filteredFiles[lightboxIndex])}
                    className="w-full"
                  >
                    Download File
                  </Button>
                </div>
              )}
            </div>

            {/* Next Button */}
            {!isEditing && (
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null && prev < filteredFiles.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-2 md:right-4 z-10 p-3 bg-stone-900/60 hover:bg-stone-900 border border-stone-800/50 rounded-full text-white transition-colors cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Editor Side Panel */}
          {isEditing && (
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-stone-900 border-l border-stone-800 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 z-20">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <h4 className="text-sm font-bold text-white font-mono uppercase">Image Editor</h4>
                <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 flex-grow">
                {/* Sliders */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                    <span>Brightness</span>
                    <span>{brightness}</span>
                  </div>
                  <input type="range" min="-100" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                    <span>Contrast</span>
                    <span>{contrast}</span>
                  </div>
                  <input type="range" min="-100" max="100" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                    <span>Blur</span>
                    <span>{blur}</span>
                  </div>
                  <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                    <span>Sharpen</span>
                    <span>{sharpen}</span>
                  </div>
                  <input type="range" min="0" max="100" value={sharpen} onChange={(e) => setSharpen(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                {/* Rotation Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Rotation</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`py-1 text-xs font-mono rounded border ${rotation === deg ? 'bg-blue-600 border-blue-500 text-white' : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'}`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Filters</span>
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-stone-300">
                    <input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} className="accent-blue-500 w-4 h-4 rounded" />
                    Grayscale
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <Button 
                  size="sm" 
                  className="w-full bg-[#615FFF] hover:bg-[#5250D8] text-white dark:text-white border-transparent disabled:bg-[#615FFF] dark:disabled:bg-[#615FFF] disabled:opacity-50" 
                  onClick={handleSaveEdit}
                  disabled={savingState !== "idle"}
                >
                  {savingState === "saving" ? "Saving..." : "Save (Replace Original)"}
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-stone-800 border-stone-700 hover:bg-stone-700 text-white dark:text-white disabled:bg-stone-800 dark:disabled:bg-stone-800 disabled:border-stone-700 disabled:opacity-50" 
                  onClick={handleSaveAsEdit}
                  disabled={savingState !== "idle"}
                >
                  {savingState === "saving-as" ? "Saving Copy..." : "Save As Copy"}
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-stone-800 border-stone-700 hover:bg-stone-700 text-white dark:text-white disabled:bg-stone-800 dark:disabled:bg-stone-800 disabled:border-stone-700 disabled:opacity-50" 
                  onClick={handleDownloadEdit}
                  disabled={savingState !== "idle"}
                >
                  Download Edits
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Bar Details */}
          <div className="text-center text-stone-500 font-mono text-xs">
            Size:{" "}
            {filteredFiles[lightboxIndex].size < 1024
              ? `${filteredFiles[lightboxIndex].size} B`
              : filteredFiles[lightboxIndex].size < 1024 * 1024
                ? `${(filteredFiles[lightboxIndex].size / 1024).toFixed(1)} KB`
                : `${(filteredFiles[lightboxIndex].size / (1024 * 1024)).toFixed(1)} MB`}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description={selectedFileIds.size > 0 ? `Are you sure you want to permanently delete these ${selectedFileIds.size} files?` : `Are you sure you want to permanently delete this file?`}
        icon={X}
        iconColor="text-danger"
        confirmText="Delete Permanently"
        confirmColor="danger"
        onConfirm={handleConfirmDelete}
        isDangerous={true}
        warningMessage={
          selectedFileIds.size > 0
            ? `You are about to permanently delete ${selectedFileIds.size} items. These files will be permanently removed from your account and cannot be recovered.`
            : `You are about to permanently delete "${selectedFile?.name}". This file will be permanently removed from your account and cannot be recovered.`
        }
      />

      {/* Empty trash confirmation modal */}
      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description={`Are you sure you want to empty the trash?`}
        icon={Trash}
        iconColor="text-danger"
        confirmText="Empty Trash"
        confirmColor="danger"
        onConfirm={handleEmptyTrash}
        isDangerous={true}
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash. These files will be permanently removed from your account and cannot be recovered.`}
      />
    </div>
  );
}
