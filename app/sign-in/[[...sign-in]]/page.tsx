import SignInForm from "@/components/SignInForm";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
      {/* Use the unified Navbar component */}
      <Navbar />

      <main className="flex-1 flex justify-center items-center py-10 px-6">
        <SignInForm />
      </main>

      <footer className="py-6 border-t border-[#E2DFD8]/40">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C8880]">
            &copy; {new Date().getFullYear()} &bull; DROPX INC.
          </p>
        </div>
      </footer>
    </div>
  );
}
