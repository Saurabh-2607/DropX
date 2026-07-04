"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, Shield, ArrowRight, X } from "lucide-react";

interface UserProfileProps {
  onClose?: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <Spinner size="lg" color="default" className="text-[#615FFF]" />
        <p className="mt-4 text-stone-500 font-mono text-xs uppercase tracking-wider">Loading your profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto border border-stone-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-stone-100">
          <div className="flex gap-3 items-center">
            <User className="h-5 w-5 text-[#615FFF]" />
            <h2 className="text-lg font-bold text-stone-800 font-mono uppercase tracking-wider">User Profile</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer focus:outline-none">
              <X className="h-5 w-5" />
            </button>
          )}
        </CardHeader>
        <CardBody className="text-center py-10 px-6">
          <div className="mb-6">
            <Avatar name="Guest" size="lg" className="mx-auto mb-4 bg-stone-100 text-stone-600" />
            <p className="text-lg font-semibold text-stone-800">Not Signed In</p>
            <p className="text-stone-500 text-sm mt-2">
              Please sign in to access your profile
            </p>
          </div>
          <Button
            onClick={() => {
              if (onClose) onClose();
              router.push("/sign-in");
            }}
            className="px-8 bg-[#615FFF] hover:bg-[#4f4dcf] text-white font-mono uppercase text-xs font-bold tracking-wider rounded-lg h-10 transition-colors"
            endContent={<ArrowRight className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </CardBody>
      </Card>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.primaryEmailAddress?.emailAddress || "";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const userRole = user.publicMetadata.role as string | undefined;

  const handleSignOut = () => {
    signOut(() => {
      if (onClose) onClose();
      router.push("/");
    });
  };

  return (
    <Card className="max-w-md mx-auto border border-stone-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-stone-100">
        <div className="flex gap-3 items-center">
          <User className="h-5 w-5 text-[#615FFF]" />
          <h2 className="text-lg font-bold text-stone-800 font-mono uppercase tracking-wider">User Profile</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        )}
      </CardHeader>
      <CardBody className="py-6 px-6">
        <div className="flex flex-col items-center text-center mb-6">
          {user.imageUrl ? (
            <Avatar
              src={user.imageUrl}
              alt={fullName}
              size="lg"
              className="mb-4 h-24 w-24 border border-stone-100"
            />
          ) : (
            <Avatar
              name={initials}
              size="lg"
              className="mb-4 h-24 w-24 text-lg bg-stone-100 text-stone-600"
            />
          )}
          <h3 className="text-xl font-semibold text-stone-800">{fullName}</h3>
          {user.emailAddresses && user.emailAddresses.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-stone-500 text-sm">
              <Mail className="h-4 w-4 text-stone-400" />
              <span>{email}</span>
            </div>
          )}
          {userRole && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#615FFF]/10 text-[#615FFF] border border-[#615FFF]/20 mt-3">
              {userRole}
            </span>
          )}
        </div>

        <div className="border-t border-stone-100 my-4" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-stone-700">
              <Shield className="h-4 w-4 text-[#615FFF]/70" />
              <span className="font-medium text-sm">Account Status</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
              Active
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-stone-700">
              <Mail className="h-4 w-4 text-[#615FFF]/70" />
              <span className="font-medium text-sm">Email Verification</span>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
              user.emailAddresses?.[0]?.verification?.status === "verified"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}>
              {user.emailAddresses?.[0]?.verification?.status === "verified"
                ? "Verified"
                : "Pending"}
            </span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50">
        {onClose ? (
          <Button
            onClick={onClose}
            className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-850 font-mono uppercase text-xs font-bold tracking-wider rounded-lg h-10 transition-colors"
          >
            Close
          </Button>
        ) : (
          <div></div>
        )}
        <Button
          onClick={handleSignOut}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-mono uppercase text-xs font-bold tracking-wider rounded-lg h-10 transition-colors"
          startContent={<LogOut className="h-4 w-4" />}
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
