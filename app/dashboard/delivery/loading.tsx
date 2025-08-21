import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function DeliveryLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-gray-100">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md p-2 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
            <Skeleton className="h-4 w-12 sm:w-16" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-24 sm:h-6 sm:w-48 mb-1" />
              <Skeleton className="h-3 w-32 sm:w-64 hidden sm:block" />
            </div>
          </div>
          <Skeleton className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </header>

      {/* Desktop Table Skeleton */}
      <div className="hidden lg:block flex-1 container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          {/* Table Header Skeleton */}
          <div className="sticky top-0 z-10 bg-white border-b p-2">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="p-2 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-4 p-2 border rounded">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="lg:hidden flex-1 p-3">
        <div className="space-y-2 h-[calc(100vh-140px)] overflow-auto">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-7 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur-md p-2 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 sm:h-3 sm:w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </footer>
    </div>
  );
}
