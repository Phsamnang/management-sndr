export default function TableSelectionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-20">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:p-4">
        {/* Header Skeleton */}
        <header className="mb-4 sm:mb-6">
          <div className="text-center sm:text-left">
            <div className="h-6 sm:h-8 md:h-10 w-48 sm:w-64 bg-gray-300 rounded animate-pulse mb-2 mx-auto sm:mx-0" />
            <div className="h-4 sm:h-5 w-64 sm:w-80 bg-gray-300 rounded animate-pulse mx-auto sm:mx-0" />
          </div>
        </header>

        <div className="space-y-4 sm:space-y-6">
          {/* Category Sections Skeleton */}
          {[...Array(4)].map((_, categoryIndex) => (
            <section key={categoryIndex}>
              {/* Category Header Skeleton */}
              <div className="mb-2 sm:mb-3 flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 sm:h-5 md:h-6 w-20 sm:w-24 bg-gray-300 rounded animate-pulse" />
              </div>

              {/* Table Cards Grid Skeleton */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {[...Array(6)].map((_, tableIndex) => (
                  <div
                    key={tableIndex}
                    className="border-2 border-gray-200 rounded-lg bg-white animate-pulse"
                  >
                    <div className="p-2 sm:p-3 text-center">
                      <div className="mb-1 h-4 sm:h-5 md:h-6 w-16 sm:w-20 bg-gray-300 rounded mx-auto" />
                      <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-300 rounded mx-auto mb-1" />
                      <div className="h-3 w-14 sm:w-18 bg-gray-300 rounded mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4">
        <div className="mx-auto max-w-6xl">
          <div className="w-full h-12 sm:h-14 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
