import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full sm:w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table Skeleton */}
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
  );
}
