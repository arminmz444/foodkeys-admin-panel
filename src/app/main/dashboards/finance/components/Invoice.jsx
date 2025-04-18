import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Paper } from "@material-ui/core";

function Invoice() {
  const [invoiceData, setInvoiceData] = useState({
    sellerName: "فروشنده",
    sellerNationalId: "1234567890",
    sellerEconomicId: "1234567890",
    invoiceDate: "2024-01-01",
    buyerName: "خریدار",
    buyerNationalId: "1234567890",
    buyerEconomicId: "1234567890",
    items: [
      {
        index: 1,
        code: "1234567890",
        description: "شرح خدمت",
        quantity: 1,
        unitPrice: 100000,
        discount: 10000,
        totalAfterDiscount: 90000,
      },
    ],
    totalAfterDiscount: 90000,
    tax: 10000,
    grandTotal: 100000,
  });

  //   useEffect(() => {
  //     // Fetch invoice data from the backend
  //     fetch('/api/v1/invoice/12345') // Use the appropriate endpoint
  //       .then(response => response.json())
  //       .then(data => setInvoiceData(data));
  //   }, []);

  const handlePrint = () => {
    // const printWindow = window.open("", "");
    // const content = document.getElementById("invoice-info").innerHTML;
    // printWindow.document.write(`
    //         <html dir="rtl">
    //         <head><title>فاکتور فروش</title></head>
    //         <body dir="rtl">
    //             <div>${content}</div>
    //         </body>
    //         </html>
    //     `);
    // printWindow.document.close();
    // printWindow.print();
    window.print()
  };

  if (!invoiceData) return <div>Loading...</div>;

  return (
    <Paper className="w-full p-6">
      <div className="w-full p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">فاکتور فروش</div>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            چاپ فاکتور
          </Button>
        </header>

        <div
          id="invoice-info"
          className="flex flex-col md:flex-row justify-between mb-8"
        >
          {/* Seller info */}
          <div className="flex-1 p-4">
            <Typography variant="h6">فروشنده</Typography>
            <div>نام فروشنده: {invoiceData.sellerName}</div>
            <div>شناسه ملی: {invoiceData.sellerNationalId}</div>
            <div>شماره اقتصادی: {invoiceData.sellerEconomicId}</div>
            <div>تاریخ: {invoiceData.invoiceDate}</div>
          </div>

          {/* Buyer info */}
          <div className="flex-1 p-4">
            <Typography variant="h6">خریدار</Typography>
            <div>نام خریدار: {invoiceData.buyerName}</div>
            <div>شناسه ملی: {invoiceData.buyerNationalId}</div>
            <div>شماره اقتصادی: {invoiceData.buyerEconomicId}</div>
            <div>تاریخ: {invoiceData.invoiceDate}</div>
          </div>
        </div>

        {/* Items table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">ردیف</th>
                <th className="border px-4 py-2">کد خدمت</th>
                <th className="border px-4 py-2">شرح خدمت</th>
                <th className="border px-4 py-2">تعداد</th>
                <th className="border px-4 py-2">مبلغ کل</th>
                <th className="border px-4 py-2">تخفیف</th>
                <th className="border px-4 py-2">جمع کل</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.index}</td>
                  <td className="border px-4 py-2">{item.code}</td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.unitPrice}</td>
                  <td className="border px-4 py-2">{item.discount}</td>
                  <td className="border px-4 py-2">
                    {item.totalAfterDiscount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-right">
          <div>جمع کل پس از تخفیف: {invoiceData.totalAfterDiscount}</div>
          <div>جمع مالیات و عوارض: {invoiceData.tax}</div>
          <div>جمع کل: {invoiceData.grandTotal}</div>
        </div>
      </div>
    </Paper>
  );
}

export default Invoice;
