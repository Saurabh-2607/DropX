import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";
import { CloudUpload } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Serialize the user data to avoid passing the Clerk User object directly
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 selection:bg-indigo-500 selection:text-white">
      <Navbar user={serializedUser} />

      <main className="flex-grow max-w-6xl w-full mx-auto pt-6 pb-12">
        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ""
          }
        />
      </main>

      <footer className="border-t border-stone-200 py-6 bg-white">
        <div className="max-w-6xl w-full mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-stone-800">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 13-2-3-2 3" vector-effect="non-scaling-stroke"></path>
              <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" vector-effect="non-scaling-stroke" d="M14.5 5.5C14.5 8 12 10 12 10S9.5 8 9.5 5.5 10.62 2 12 2s2.5 1 2.5 3.5ZM18.5 15.5C16 15.5 14 13 14 13s2-2.5 4.5-2.5S22 11.62 22 13s-1 2.5-3.5 2.5ZM5.5 15.5C8 15.5 10 13 10 13s-2-2.5-4.5-2.5S2 11.62 2 13s1 2.5 3.5 2.5ZM16 22s-3-6-6-9" vector-effect="non-scaling-stroke"></path>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" vector-effect="non-scaling-stroke" d="M8 22s3-6 6-9"></path>
            </svg>
            <span className="font-mono text-xs font-semibold tracking-[0.08em] text-stone-800 uppercase">
              DROPX
            </span>
          </div>
          <p className="text-[10px] font-mono text-stone-400">
            &copy; {new Date().getFullYear()} DropX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
