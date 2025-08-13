"use client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { forwardRef } from "react";

export const InvoicePrint = forwardRef<
  HTMLDivElement,
  {
    invoice?: any;
    totalAmount: any;
    invoiceNo: any;
    saleDate: any;
    tableName: any;
  }
>(({ invoice, totalAmount, invoiceNo, saleDate, tableName }, ref) => {
  const grouped = Object.values(
    invoice.reduce((acc: any, item: any) => {
      const key = `${item.name}_${item.priceAtSale}`;
      if (!acc[key]) {
        acc[key] = { ...item }; // copy original item
      } else {
        acc[key].quantity += item.quantity;
      }
      return acc;
    }, {} as Record<string, (typeof invoice)[number]>)
  ).filter((item: any) => item.quantity !== 0);
  const baseHeight = 4; // Base height in inches for header, footer, etc.
  const itemHeight = 0.4; // Height per item in inches
  const dynamicHeight = baseHeight + grouped.length * itemHeight;
  return (
    <div
      style={{
        display: "none",
      }}
    >
      <div className="max-w-2xl mx-auto p-4" ref={ref}>
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-3 print:p-2 text-xs">
            {/* Header */}
            <div className="text-center mb-3">
              <div className="font-bold text-sm">
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
                <span className="font-mono">{invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span>តុ:</span>
                <span>{tableName}</span>
              </div>
              <div className="flex justify-between">
                <span>កាលបរិច្ឆេទ:</span>
                <span>{formatDate(saleDate)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Items */}
            <div className="mb-2">
              {grouped?.map((item: any) => (
                <div key={item.id} className="mb-1">
                  <div className="flex justify-between">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="font-mono">
                      {item.quantity * item.priceAtSale}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {" "}
                    {item.quantity} x {item.priceAtSale}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">{totalAmount}</span>
              </div>
              {/* {invoice.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-mono"></span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-mono"></span>
                </div> */}
              <div className="border-t border-gray-400 pt-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>សរុបប្រាក់:</span>
                  <span className="font-mono">{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2"></div>

            {/* Payment */}
            {/* <div className="space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span> </span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span className="font-mono"></span>
                </div>
                {invoice.change > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span className="font-mono"></span>
                  </div>
                )}
              </div> */}

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
            .mb-1 {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Keep invoice sections together */
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
          }
        `}</style>
      </div>
    </div>
  );
});

InvoicePrint.displayName = "InvoicePrint";
