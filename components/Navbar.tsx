"use client";

import { useClerk, useAuth, useUser } from "@clerk/nextjs";
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
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  const activeUser = user || (clerkUser ? {
    id: clerkUser.id,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    username: clerkUser.username,
    emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress,
  } : null);

  const isActuallySignedIn = !!activeUser;

  const userDetails = {
    fullName: activeUser
      ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`.trim()
      : "",
    initials: activeUser
      ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: activeUser
      ? activeUser.firstName && activeUser.lastName
        ? `${activeUser.firstName} ${activeUser.lastName}`
        : activeUser.firstName || activeUser.username || activeUser.emailAddress || "User"
      : "User",
    email: activeUser?.emailAddress || "",
  };

  return (
    <header className="sticky top-0 w-full backdrop-blur-lg z-50 flex justify-center">
      <div className="max-w-6xl w-full">
        <div className={`gap-4 flex items-center h-14 w-full py-1 px-4 md:px-6 ${
          isActuallySignedIn 
            ? "justify-between" 
            : "lg:grid lg:grid-cols-3"
        }`}>
          
          {/* Left: Brand Logo & Icon */}
          <Link href="/" className="flex items-center gap-2 group w-fit hover:opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 71 72" fill="currentColor" className="text-stone-800">
              <path fillRule="evenodd" clipRule="evenodd" d="M25.0753 25.4554C19.9752 22.6862 14.313 20.4515 9.32073 20.4515C-3.16641 20.4515 -3.04727 51.3383 9.32073 51.3383C14.2772 51.3383 19.894 49.1355 24.9654 46.3939C22.2207 51.4684 20.0144 57.0903 20.0144 62.0507C20.0144 74.4187 50.9012 74.5378 50.9012 62.0507C50.9012 57.0856 48.6908 51.4578 45.9425 46.3795C51.0208 49.1278 56.6486 51.3383 61.6137 51.3383C73.9817 51.3383 74.1008 20.4515 61.6137 20.4515C56.6935 20.4515 51.1227 22.622 46.0806 25.3357C48.8055 20.2818 50.989 14.6925 50.989 9.75775C50.989 -2.61026 20.1022 -2.72939 20.1022 9.75775C20.1022 14.7315 22.3203 20.3702 25.0753 25.4554Z" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="font-mono text-sm font-semibold tracking-[0.08em] text-stone-800 uppercase">
              DROPX
            </span>
          </Link>

          {/* Center Links (hidden on mobile, and hidden when logged in) */}
          {!isActuallySignedIn && (
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
          )}

          {/* Right Action buttons */}
          <div className="flex gap-2 lg:gap-4 justify-end items-center flex-1 lg:w-full">
            {!isActuallySignedIn ? (
              <>
                <Button variant="secondary" href="/sign-in">Log in</Button>
                <Button variant="primary" href="/sign-up">Sign up</Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-stone-600 hidden sm:inline-block">
                  {userDetails.displayName}
                </span>
                <Dropdown>
                  <DropdownTrigger>
                    <button className="focus:outline-none cursor-pointer flex items-center gap-1">
                      <Avatar
                        name={userDetails.initials}
                        size="sm"
                        src={activeUser?.imageUrl || undefined}
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

            {/* Mobile menu trigger (only when logged out) */}
            {!isActuallySignedIn && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1 text-stone-600 hover:text-stone-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu drawer (only when logged out) */}
        {isMobileMenuOpen && !isActuallySignedIn && (
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
