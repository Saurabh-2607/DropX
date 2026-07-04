"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
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
        <h2 className="font-cooper text-4xl font-normal leading-tight text-stone-900 tracking-tight">
          Hi,{" "}
          <span className="text-[#615FFF] italic">
            {userName?.length > 10
              ? `${userName?.substring(0, 10)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className="text-stone-500 mt-2 text-base font-sans">
          Your images are waiting for you.
        </p>
      </div>

      <Tabs
        aria-label="Dashboard Tabs"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        classNames={{
          tabList: "gap-6 border-b border-stone-200",
          tab: "py-3 text-stone-600 hover:text-stone-900 data-[selected=true]:text-[#615FFF] font-mono uppercase text-xs font-bold tracking-wider",
          cursor: "bg-[#615FFF] h-[2px]",
        }}
      >
        <Tab
          key="files"
          title={
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>My Files</span>
            </div>
          }
        >
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-stone-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex gap-3 px-6 pt-6 pb-2 border-b border-stone-100">
                  <FileUp className="h-5 w-5 text-[#615FFF]" />
                  <h2 className="text-lg font-bold text-stone-800 font-mono uppercase tracking-wider">Upload</h2>
                </CardHeader>
                <CardBody className="p-6">
                  <FileUploadForm
                    userId={userId}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border border-stone-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex gap-3 px-6 pt-6 pb-2 border-b border-stone-100">
                  <FileText className="h-5 w-5 text-[#615FFF]" />
                  <h2 className="text-lg font-bold text-stone-800 font-mono uppercase tracking-wider">Your Files</h2>
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
          </div>
        </Tab>

        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </div>
          }
        >
          <div className="mt-8">
            <UserProfile />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
