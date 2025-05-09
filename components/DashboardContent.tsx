"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, User } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "@/components/UserProfile";
import { useSearchParams } from "next/navigation";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Set the active tab based on URL parameter
  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-900">
          Hi,{" "}
          <span className="text-primary">
            {userName?.length > 10
              ? `${userName?.substring(0, 10)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className="text-default-600 mt-2 text-lg">
          Your images are waiting for you.
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(key) => setActiveTab(key)}>
        <TabsList className="grid grid-cols-2 gap-4">
          <TabsTrigger value="files">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span className="font-medium">My Files</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex gap-3">
                  <FileUp className="h-5 w-5 text-primary" />
                  <CardTitle>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadForm
                    userId={userId}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Your Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileList
                    userId={userId}
                    refreshTrigger={refreshTrigger}
                    onFolderChange={handleFolderChange}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
