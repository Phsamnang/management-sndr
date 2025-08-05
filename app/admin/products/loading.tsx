import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MenusLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header Skeleton */}
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Filters Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>



    

        {/* Stats Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Table Header Skeleton */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50">
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Status",
                    "Actions",
                  ].map((header, index) => (
                    <div
                      key={header}
                      className={`col-span-${
                        index === 3 || index === 6 ? "1" : "2"
                      }`}
                    >
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Table Body Skeleton */}
                <div className="divide-y">
                  {[...Array(8)].map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-12 gap-4 p-4">
                      {/* Order ID */}
                      <div className="col-span-2 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </div>

                      {/* Customer */}
                      <div className="col-span-2 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                      </div>

                      {/* Items */}
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
