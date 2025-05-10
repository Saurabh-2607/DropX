"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Upload, X, FileUp, AlertTriangle, FolderPlus } from "lucide-react";
import { toast } from "sonner";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

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
            setProgress(percentCompleted);
          }
        },
      });

      toast("Upload Successful", {
        description: `${file.name} has been uploaded successfully.`,
      });

      clearFile();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      toast("Upload Failed", {
        description: "We couldn't upload your file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast("Invalid Folder Name", {
        description: "Please enter a valid folder name.",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      toast("Folder Created", {
        description: `Folder "${folderName}" has been created successfully.`,
      });

      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast("Folder Creation Failed", {
        description: "We couldn't create the folder. Please try again.",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                type="text"
                placeholder="My Images"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="ghost">Cancel</Button>
              <Button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !folderName.trim()}
              >
                {creatingFolder ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <FileUp className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      <Card
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? "border-red-500 bg-red-50"
            : file
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        }`}
      >
        {!file ? (
          <CardContent className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-blue-500" />
            <div>
              <p className="text-gray-600">
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">Images up to 5MB</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </CardContent>
        ) : (
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <FileUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="text-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && (
              <Progress
                value={progress}
                className="max-w-full"
              />
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || !!error}
              className="w-full"
            >
              {uploading ? (
                <span>
                  <span className="loader mr-2"></span>Uploading... {progress}%
                </span>
              ) : (
                "Upload Image"
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
