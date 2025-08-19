"use client";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyPrice, formatDate } from "@/lib/utils";
import { forwardRef } from "react";

export const InvoicePrint = forwardRef<
  HTMLDivElement,
  {
    data?: any;
  }
>(({ data }, ref) => {
  const baseHeight = 4; // Base height in inches for header, footer, etc.
  const itemHeight = 0.6; // Increased height per item to accommodate images
  const dynamicHeight = baseHeight + (data?.items?.length || 0) * itemHeight;

  return (
    <div
      style={{
        display: "none",
      }}
    >
      <div className="max-w-2xl mx-auto p-4" ref={ref}>
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-3 print:p-2 text-xs">
            {/* Header with Logo */}
            <div className="text-center mb-3">
              {/* <div className="flex justify-center mb-2">
                <img
                  src="/placeholder.svg?height=48&width=48&text=Logo"
                  alt="Restaurant Logo"
                  className="w-12 h-12 object-contain"
                />
              </div> */}
              <div
                className="font-bold text-sm !font-khmer"
                style={{ fontFamily: "'Khmer Moul', serif" }}
              >
                SN សាច់អាំង(រស់ជាតិដើម​ ត្បូងឃ្មុំ)
              </div>
              <div className="text-xs text-gray-600">
                រថភ្លើង, កាកាប២​ ភ្នំពេញ
              </div>
              <div className="text-xs text-gray-600">(+885) 098704006</div>
              <div className="font-bold text-xs">វិក្ក័យបត្រ/Invoice</div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Invoice Info */}
            <div className="mb-2 space-y-1">
              <div className="flex justify-between">
                <span>លេខវិក្ក័យបត្រ:</span>
                <span className="font-mono">{data?.inv_no}</span>
              </div>
              <div className="flex justify-between">
                <span>តុ:</span>
                <span>{data?.table_name}</span>
              </div>
              <div className="flex justify-between">
                <span>កាលបរិច្ឆេទ:</span>
                <span>{formatDate(data?.sale_dt)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Items with Images */}
            <div className="mb-2">
              {data?.items?.map((item: any, index: number) => (
                <div
                  key={item.name || index}
                  className="mb-2 pb-1 border-b border-dotted border-gray-300 last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    {/* Small Item Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.img ||
                          `/placeholder.svg?height=32&width=32&text=${encodeURIComponent(
                            item.name?.substring(0, 3) || "Item"
                          )}`
                        }
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded border"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="truncate pr-2 font-medium">
                          {item.name}
                        </span>
                        <span className="font-mono text-right">
                          {formatCurrencyPrice(
                            item.qty * item.sale_at_price,
                            "KHR"
                          )}
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        {item.qty} x{" "}
                        {formatCurrencyPrice(item.sale_at_price, "KHR")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">
                  {formatCurrencyPrice(data?.ttl_amt, "KHR")}
                </span>
              </div>
              <div className="border-t border-gray-400 pt-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>សរុបប្រាក់:</span>
                  <span className="font-mono">
                    {formatCurrencyPrice(data?.ttl_amt, "KHR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600">
              <div className="mb-1">Thank you for your visit!</div>
              <div>Please come again</div>
            </div>
          </CardContent>
        </Card>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              margin: 0;
              padding: 0;
            }

            .print\\:hidden {
              display: none !important;
            }

            .print\\:shadow-none {
              box-shadow: none !important;
            }

            .print\\:border-none {
              border: none !important;
            }

            .print\\:p-2 {
              padding: 0.5rem !important;
            }

            @page {
              margin: 0.2in;
              size: 3in ${dynamicHeight}in;
            }

            /* Ensure content fits properly */
            .max-w-2xl {
              max-width: none !important;
              width: 100% !important;
            }

            /* Prevent page breaks within items */
            .mb-2 {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Keep header together */
            .text-center.mb-3 {
              page-break-after: avoid;
              break-after: avoid;
            }

            /* Keep totals section together */
            .space-y-1 {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Keep footer together */
            .text-center.text-xs.text-gray-600 {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Prevent orphaned lines */
            * {
              orphans: 3;
              widows: 3;
            }

            /* Keep item details together */
            .flex.justify-between {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Ensure dashed borders don't break */
            .border-t.border-dashed {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Logo and item images styling for print */
            img {
              max-width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }

            /* Item image specific styling */
            .w-8.h-8 {
              width: 2rem !important;
              height: 2rem !important;
              flex-shrink: 0;
            }

            /* Ensure item layout stays intact */
            .flex.items-start.gap-2 {
              display: flex !important;
              align-items: flex-start !important;
              gap: 0.5rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
});

InvoicePrint.displayName = "InvoicePrint";
