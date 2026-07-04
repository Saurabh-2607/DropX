"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal, ModalContent } from "@heroui/modal";
import UserProfile from "@/components/UserProfile";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  const userDetails = {
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    initials: user
      ? `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: user
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.username || user.emailAddress || "User"
      : "User",
    email: user?.emailAddress || "",
  };

  return (
    <header className="sticky top-0 w-full backdrop-blur-lg z-50 flex justify-center bg-stone-50/80 border-b border-stone-200/50">
      <div className="max-w-6xl w-full">
        <div className="lg:grid gap-4 flex items-center lg:grid-cols-3 h-14 w-full py-1 px-4 lg:px-6">
          
          {/* Left: Brand Logo & Icon */}
          <Link href="/" className="flex items-center gap-2 group w-fit hover:opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-stone-800">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 13-2-3-2 3" vectorEffect="non-scaling-stroke"></path>
              <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M14.5 5.5C14.5 8 12 10 12 10S9.5 8 9.5 5.5 10.62 2 12 2s2.5 1 2.5 3.5ZM18.5 15.5C16 15.5 14 13 14 13s2-2.5 4.5-2.5S22 11.62 22 13s-1 2.5-3.5 2.5ZM5.5 15.5C8 15.5 10 13 10 13s-2-2.5-4.5-2.5S2 11.62 2 13s1 2.5 3.5 2.5Z"></path>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M16 22s-3-6-6-9"></path>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M8 22s3-6 6-9"></path>
            </svg>
            <span className="font-mono text-sm font-semibold tracking-[0.08em] text-stone-800 uppercase">
              DROPX
            </span>
          </Link>

          {/* Center Links (hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center gap-2 font-mono">
            <Dropdown>
              <DropdownTrigger>
                <button className="flex font-mono justify-between px-3 py-1 gap-1 rounded-lg items-center uppercase text-sm font-semibold select-none cursor-pointer text-stone-800 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none">
                  Solutions{" "}
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"></path>
                    </svg>
                  </span>
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Solutions dropdown"
                onAction={() => router.push("/dashboard")}
              >
                <DropdownItem key="storage">Media Storage</DropdownItem>
                <DropdownItem key="sharing">Secure Sharing</DropdownItem>
                <DropdownItem key="filters">Quick Filters</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <a
              href="#features"
              className="flex font-mono justify-between px-3 py-1 gap-1 items-center uppercase text-sm font-semibold select-none cursor-pointer rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-stone-800 hover:text-indigo-600"
            >
              Features
            </a>
            <Link
              href="/dashboard"
              className="flex font-mono justify-between px-3 py-1 gap-1 items-center uppercase text-sm font-semibold select-none cursor-pointer rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-stone-800 hover:text-indigo-600"
            >
              Workspace
            </Link>
          </div>

          {/* Right Action buttons */}
          <div className="flex gap-2 lg:gap-4 justify-end items-center flex-1 lg:w-full">
            {(!isLoaded || !isSignedIn) ? (
              <>
                <Button variant="secondary" href="/dashboard">Log in</Button>
                <Button variant="primary" href="/dashboard">Sign up</Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="primary" href="/dashboard">Dashboard</Button>
                <Dropdown>
                  <DropdownTrigger>
                    <button className="focus:outline-none cursor-pointer flex items-center gap-1">
                      <Avatar
                        name={userDetails.initials}
                        size="sm"
                        src={user?.imageUrl || undefined}
                        className="h-8 w-8 border border-stone-200"
                        fallback={<User className="h-4 w-4" />}
                      />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu">
                    <DropdownItem key="profile" onClick={() => setIsProfileModalOpen(true)}>
                      Profile
                    </DropdownItem>
                    <DropdownItem key="signout" color="danger" className="text-danger" onClick={handleSignOut}>
                      Sign out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full border-t border-stone-200 bg-stone-50 py-4 px-6 flex flex-col gap-4 font-mono">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="uppercase text-sm font-semibold text-stone-800"
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="uppercase text-sm font-semibold text-stone-800"
            >
              Workspace
            </Link>
          </div>
        )}
      </div>

      <Modal
        isOpen={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-transparent shadow-none border-none p-0 max-w-md mx-4",
        }}
      >
        <ModalContent>
          <UserProfile onClose={() => setIsProfileModalOpen(false)} />
        </ModalContent>
      </Modal>
    </header>
  );
}
