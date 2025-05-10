"use client";

import { useEffect, useState, useMemo } from "react";
import { Folder, Star, Trash, X, ExternalLink } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  // Define the FileType interface
  interface FileType {
    id: string;
    name: string;
    type: string;
    size: number;
    createdAt: string;
    isFolder: boolean;
    isStarred: boolean;
    isTrash: boolean;
    path?: string;
    fileUrl?: string;
  }
  
    const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error Loading Files", {
        description: "We couldn't load your files. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch files when userId, refreshTrigger, or currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // Filter files based on active tab
  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrash);
      case "trash":
        return files.filter((file) => file.isTrash);
      case "all":
      default:
        return files.filter((file) => !file.isTrash);
    }
  }, [files, activeTab]);

  // Count files in trash
  const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash).length;
  }, [files]);

  // Count starred files
  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash).length;
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
      if (!file?.isStarred) {
        toast.success("Added to Starred", {
          description: `"${file?.name}" has been added to your starred files`,
        });
      } else {
        toast.success("Removed from Starred", {
          description: `"${file?.name}" has been removed from your starred files`,
        });
      }
    } catch (error) {
      console.error("Error starring file:", error);
      toast.error("Action Failed", {
        description: "We couldn't update the star status. Please try again.",
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
      if (responseData.isTrash) {
        toast.success("Moved to Trash", {
          description: `"${file?.name}" has been moved to trash`,
        });
      } else {
        toast.success("Restored from Trash", {
          description: `"${file?.name}" has been restored`,
        });
      }
    } catch (error) {
      console.error("Error trashing file:", error);
      toast.error("Action Failed", {
        description: "We couldn't update the file status. Please try again.",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      // Store file info before deletion for the toast message
      const fileToDelete = files.find((f) => f.id === fileId);
      const fileName = fileToDelete?.name || "File";

      // Send delete request
      const response = await axios.delete(`/api/files/${fileId}/delete`);

      if (response.data.success) {
        // Remove file from local state
        setFiles(files.filter((file) => file.id !== fileId));

        // Show success toast
        toast.success("File Permanently Deleted", {
          description: `"${fileName}" has been permanently removed`,
        });

        // Close modal if it was open
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Deletion Failed", {
        description: "We couldn't delete the file. Please try again later.",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);

      // Remove all trashed files from local state
      setFiles(files.filter((file) => !file.isTrash));

      // Show toast
      toast.success("Trash Emptied", {
        description: `All ${trashCount} items have been permanently deleted`,
      });

      // Close modal
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      toast.error("Action Failed", {
        description: "We couldn't empty the trash. Please try again later.",
      });
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    const toastId = toast.loading("Preparing Download", {
      description: `Getting "${file.name}" ready for download...`,
    });

    try {
      // For images, we can use the ImageKit URL directly with optimized settings
      if (file.type.startsWith("image/")) {
        const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
        if (!imageKitEndpoint) {
          throw new Error("ImageKit endpoint not configured");
        }

        const downloadUrl = `${imageKitEndpoint}/tr:q-100,orig-true/${file.path}`;

        // Fetch the image first to ensure it's available
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`);
        }

        // Get the blob data
        const blob = await response.blob();

        // Create a download link
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);

        // Update toast
        toast.success("Download Ready", {
          id: toastId,
          description: `"${file.name}" is ready to download.`,
        });

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        // For other file types, use the fileUrl directly
        if (!file.fileUrl) {
          throw new Error("File URL is undefined");
        }
        const response = await fetch(file.fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.statusText}`);
        }

        // Get the blob data
        const blob = await response.blob();

        // Create a download link
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);

        // Update toast
        toast.success("Download Ready", {
          id: toastId,
          description: `"${file.name}" is ready to download.`,
        });

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download Failed", {
        id: toastId,
        description: "We couldn't download the file. Please try again later.",
      });
    }
  };

  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
      if (!imageKitEndpoint) {
        toast.error("Configuration Error", {
          description: "Image viewer is not properly configured",
        });
        return;
      }

      const optimizedUrl = `${imageKitEndpoint}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(optimizedUrl, "_blank");
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);

    if (onFolderChange) {
      onFolderChange(folderId);
    }
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      const newFolderId =
        newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolder(newFolderId);

      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);

      if (onFolderChange) {
        onFolderChange(null);
      }
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      setCurrentFolder(newFolderId);

      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  };

  const handleItemClick = (file: FileType) => {
    if (file.isFolder) {
      navigateToFolder(file.id, file.name);
    } else if (file.type.startsWith("image/")) {
      openImageViewer(file);
    }
  };

  if (loading) {
    return <FileLoadingState />;
  }

  return (
    <div className="space-y-6">
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      <Separator className="my-4" />

      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card className="border border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden sm:table-cell">Added</TableHead>
                    <TableHead className="w-[240px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow
                      key={file.id}
                      className={`hover:bg-muted transition-colors ${
                        file.isFolder || file.type.startsWith("image/")
                          ? "cursor-pointer"
                          : ""
                      }`}
                      onClick={() => handleItemClick(file)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon file={{ ...file, path: file.path ?? "" }} />
                          <div>
                            <div className="font-medium flex items-center gap-2 text-foreground">
                              <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                                {file.name}
                              </span>
                              <TooltipProvider>
                                {file.isStarred && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Star
                                        className="h-4 w-4 text-yellow-400"
                                        fill="currentColor"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>Starred</TooltipContent>
                                  </Tooltip>
                                )}
                                {file.isFolder && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Folder className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>Folder</TooltipContent>
                                  </Tooltip>
                                )}
                                {file.type.startsWith("image/") && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>Click to view image</TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {formatDistanceToNow(new Date(file.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs text-muted-foreground">
                          {file.isFolder ? "Folder" : file.type}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-foreground">
                          {file.isFolder
                            ? "-"
                            : file.size < 1024
                              ? `${file.size} B`
                              : file.size < 1024 * 1024
                                ? `${(file.size / 1024).toFixed(1)} KB`
                                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <div className="text-foreground">
                            {formatDistanceToNow(new Date(file.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(file.createdAt), "MMMM d, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <FileActions
                          file={file}
                          onStar={handleStarFile}
                          onTrash={handleTrashFile}
                          onDelete={(file) => {
                            setSelectedFile(file);
                            setDeleteModalOpen(true);
                          }}
                          onDownload={handleDownloadFile}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description={`Are you sure you want to permanently delete this file?`}
        icon={X}
        iconColor="text-destructive"
        confirmText="Delete Permanently"
        confirmColor="destructive"
        onConfirm={() => {
          if (selectedFile) {
            handleDeleteFile(selectedFile.id);
          }
        }}
        isDangerous={true}
        warningMessage={`You are about to permanently delete "${selectedFile?.name}". This file will be permanently removed from your account and cannot be recovered.`}
      />

      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description={`Are you sure you want to empty the trash?`}
        icon={Trash}
        iconColor="text-destructive"
        confirmText="Empty Trash"
        confirmColor="destructive"
        onConfirm={handleEmptyTrash}
        isDangerous={true}
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash. These files will be permanently removed from your account and cannot be recovered.`}
      />
    </div>
  );
}