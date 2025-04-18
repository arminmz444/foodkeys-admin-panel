import { apiService as api } from "app/store/apiService";

// Tag types for templates
const addTagTypes = ["Template", "EmailTemplate", "SmsTemplate"];

const TemplatesApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    // Email Templates
    getEmailTemplates: builder.query({
      query: ({ pageNumber, pageSize, search, sort, filter }) => ({
        url: `/email-templates?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ""}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ""}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const data = { data: response?.data };
        if (response && response.pagination) {
          data.totalPages = response.pagination.totalPages;
          data.totalElements = response.pagination.totalElements;
          data.pageSize = response.pagination.pageSize;
          data.pageIndex = response.pagination.pageIndex;
        }
        return data;
      },
      providesTags: (result) =>
        (result && result.data && Array.isArray(result.data))
          ? [
              ...result.data.map(({ id }) => ({ type: "EmailTemplate", id })),
              { type: "EmailTemplate", id: "LIST" },
            ]
          : [{ type: "EmailTemplate", id: "LIST" }],
      keepUnusedDataFor: 3600,
    }),
    getEmailTemplate: builder.query({
      query: (id) => ({
        url: `/email-templates/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "EmailTemplate", id }],
    }),
    createEmailTemplate: builder.mutation({
      query: (body) => ({
        url: "/email-templates/",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: [{ type: "EmailTemplate", id: "LIST" }],
    }),
    updateEmailTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/email-templates/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "EmailTemplate", id },
      ],
    }),
    deleteEmailTemplate: builder.mutation({
      query: (id) => ({
        url: `/email-templates/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: [{ type: "EmailTemplate", id: "LIST" }],
    }),

    // SMS Templates
    getSmsTemplates: builder.query({
      query: ({ pageNumber, pageSize, search, sort, filter }) => ({
        url: `/sms-templates?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ""}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ""}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const data = { data: response?.data };
        if (response && response.pagination) {
          data.totalPages = response.pagination.totalPages;
          data.totalElements = response.pagination.totalElements;
          data.pageSize = response.pagination.pageSize;
          data.pageIndex = response.pagination.pageIndex;
        }
        return data;
      },
      providesTags: (result) =>
        (result && result.data && Array.isArray(result.data))
          ? [
              ...result.data.map(({ id }) => ({ type: "SmsTemplate", id })),
              { type: "SmsTemplate", id: "LIST" },
            ]
          : [{ type: "SmsTemplate", id: "LIST" }],
      keepUnusedDataFor: 3600,
    }),
    getSmsTemplate: builder.query({
      query: (id) => ({
        url: `/sms-templates/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "SmsTemplate", id }],
    }),
    createSmsTemplate: builder.mutation({
      query: (body) => ({
        url: "/sms-templates/",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: [{ type: "SmsTemplate", id: "LIST" }],
    }),
    updateSmsTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sms-templates/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "SmsTemplate", id },
      ],
    }),
    deleteSmsTemplate: builder.mutation({
      query: (id) => ({
        url: `/sms-templates/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: [{ type: "SmsTemplate", id: "LIST" }],
    }),

    // Smart Text Variables
    getSmartTextVariables: builder.query({
      query: () => ({
        url: "/smart-text-variables",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["SmartTextVariables"],
    }),

    // Recipients
    getRecipients: builder.query({
      query: () => ({
        url: "/recipients",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["Recipients"],
    }),
    addRecipient: builder.mutation({
      query: (body) => ({
        url: "/recipients",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Recipients"],
    }),
    deleteRecipient: builder.mutation({
      query: (id) => ({
        url: `/recipients/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Recipients"],
    }),

    // Test sending
    sendTestEmail: builder.mutation({
      query: (body) => ({
        url: "/send-test-email",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
    }),
    sendTestSms: builder.mutation({
      query: (body) => ({
        url: "/send-test-sms",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
  overrideExisting: false,
});

export default TemplatesApi;

export const {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  
  useGetSmsTemplatesQuery,
  useGetSmsTemplateQuery,
  useCreateSmsTemplateMutation,
  useUpdateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
  
  useGetSmartTextVariablesQuery,
  
  useGetRecipientsQuery,
  useAddRecipientMutation,
  useDeleteRecipientMutation,
  
  useSendTestEmailMutation,
  useSendTestSmsMutation,
} = TemplatesApi;