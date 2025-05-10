"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, Shield, ArrowRight } from "lucide-react";

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="h-6 w-6 text-primary" />
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="text-center py-10">
          <div className="mb-6">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <p className="text-lg font-medium">Not Signed In</p>
            <p className="text-muted-foreground mt-2">
              Please sign in to access your profile
            </p>
          </div>
          <Button 
            onClick={() => router.push("/sign-in")}
            className="px-8"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
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
      router.push("/");
    });
  };

  return (
    <Card className="max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            {user.imageUrl ? (
              <AvatarImage src={user.imageUrl} alt={fullName} />
            ) : (
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            )}
          </Avatar>
          <h3 className="text-xl font-semibold">{fullName}</h3>
          {user.emailAddresses && user.emailAddresses.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
          {userRole && (
            <Badge 
              className="mt-3"
              variant="secondary"
            >
              {userRole}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Account Status</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Email Verification</span>
            </div>
            <Badge 
              variant="outline" 
              className={
                user.emailAddresses?.[0]?.verification?.status === "verified"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            >
              {user.emailAddresses?.[0]?.verification?.status === "verified"
                ? "Verified"
                : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
