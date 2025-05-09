"use client";

import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CloudUpload, ChevronDown, User, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-menu-button="true"]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`bg-default-50 border-b border-default-200 sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 z-10">
            <CloudUpload className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DropX</h1>
          </Link>

          <div className="hidden md:flex gap-4 items-center">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                {!isOnDashboard && (
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={user?.imageUrl || undefined}
                          alt={userDetails.displayName}
                        />
                        <AvatarFallback>
                          {userDetails.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{userDetails.displayName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard?tab=profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                    >
                      My Files
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-danger"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SignedIn>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              <Avatar>
                <AvatarImage
                  src={user?.imageUrl || undefined}
                  alt={userDetails.displayName}
                />
                <AvatarFallback>{userDetails.initials}</AvatarFallback>
              </Avatar>
            </SignedIn>
            <button
              className="z-50 p-2"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              data-menu-button="true"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-default-700" />
              ) : (
                <Menu className="h-6 w-6 text-default-700" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-default-50 z-40 flex flex-col pt-20 px-6 shadow-xl transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <SignedOut>
              <div className="flex flex-col gap-4 items-center">
                <Link
                  href="/sign-in"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 py-4 border-b border-default-200">
                  <Avatar>
                    <AvatarImage
                      src={user?.imageUrl || undefined}
                      alt={userDetails.displayName}
                    />
                    <AvatarFallback>{userDetails.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userDetails.displayName}</p>
                    <p className="text-sm text-default-500">
                      {userDetails.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {!isOnDashboard && (
                    <Link
                      href="/dashboard"
                      className="py-2 px-3 hover:bg-default-100 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard?tab=profile"
                    className="py-2 px-3 hover:bg-default-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="py-2 px-3 text-left text-danger hover:bg-danger-50 rounded-md transition-colors mt-4"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
