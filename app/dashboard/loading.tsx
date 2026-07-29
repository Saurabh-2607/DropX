export default function Loading() {
  return (
    <div className="bg-stone-50 text-stone-800 w-full flex justify-center flex-grow">
      <main className="max-w-6xl w-full px-4 md:px-6 pt-6 pb-12">
        <div className="w-full flex flex-col gap-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-48 bg-stone-200 rounded-lg"></div>
              <div className="h-4 w-64 bg-stone-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-32 bg-stone-200 rounded-lg"></div>
          </div>

          {/* Search/Filter Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-stone-200 rounded-lg"></div>
              <div className="h-10 w-24 bg-stone-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-full sm:w-64 bg-stone-200 rounded-lg"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-3 bg-white border border-stone-200 rounded-xl shadow-sm"
              >
                <div className="w-full aspect-square bg-stone-100 rounded-lg"></div>
                <div className="h-3 w-3/4 bg-stone-200 rounded mt-1"></div>
                <div className="h-2 w-1/2 bg-stone-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
