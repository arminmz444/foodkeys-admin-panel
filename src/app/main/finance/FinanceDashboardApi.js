import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['finance_dashboard_widgets', 'transactions', 'payments'];

const FinanceDashboardApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      // 1) گرفتن ویجت‌های داشبورد مالی
      getFinanceDashboardWidgets: build.query({
        query: () => ({
          url: '/dashboard/finance/widgets',
          method: 'GET',
        }),
        providesTags: ['finance_dashboard_widgets'],
      }),
      // 2) لیست تمام تراکنش‌ها (ادمین)
      getAllTransactions: build.query({
        query: ({ page = 0, size = 10 }) => ({
          url: `/transaction/all?page=${page}&size=${size}`,
          method: 'GET',
        }),
        providesTags: ['transactions'],
      }),
      // 3) لیست تراکنش‌های کاربر
      getUserTransactions: build.query({
        query: ({ page = 0, size = 10 }) => ({
          url: `/transaction/me?page=${page}&size=${size}`,
          method: 'GET',
        }),
        providesTags: ['transactions'],
      }),
      // 4) لیست تمامی پرداخت‌ها (ادمین)
      getAllPayments: build.query({
        query: ({ page = 0, size = 10 }) => ({
          url: `/payment/all?page=${page}&size=${size}`,
          method: 'GET',
        }),
        providesTags: ['payments'],
      }),
      // 5) لیست پرداخت‌های کاربر
      getUserPayments: build.query({
        query: ({ page = 0, size = 10 }) => ({
          url: `/payment/me?page=${page}&size=${size}`,
          method: 'GET',
        }),
        providesTags: ['payments'],
      }),
      // 6) ساخت فاکتور برای یک پرداخت
      generateBillForPayment: build.mutation({
        query: (paymentId) => ({
          url: `/payment/${paymentId}/bill`,
          method: 'POST',
        }),
        invalidatesTags: ['payments'],
      }),
      // 7) دریافت فایل PDF فاکتور
      getInvoicePdf: build.query({
        query: (paymentId) => ({
          url: `/payment/${paymentId}/invoice`,
          method: 'GET',
          // دریافت به صورت arraybuffer یا blob در صورت نیاز
        }),
      }),
    }),
    overrideExisting: false,
  });

export default FinanceDashboardApi;

export const {
  useGetFinanceDashboardWidgetsQuery,
  useGetAllTransactionsQuery,
  useGetUserTransactionsQuery,
  useGetAllPaymentsQuery,
  useGetUserPaymentsQuery,
  useGenerateBillForPaymentMutation,
  useGetInvoicePdfQuery,
} = FinanceDashboardApi;

// سلکتورهای کمکی
export const selectFinanceDashboardWidgets = createSelector(
  FinanceDashboardApi.endpoints.getFinanceDashboardWidgets.select(),
  (results) => results.data
);
export const selectWidget = (id) =>
  createSelector(selectFinanceDashboardWidgets, (widgets) => {
    return widgets?.[id];
  });
