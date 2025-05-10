"use client";

import { Spinner } from "@/components/ui/spinner";

export default function FileLoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Spinner/>
      <p className="mt-4 text-default-600">Loading your files...</p>
    </div>
  );
}
