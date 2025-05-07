import apiService from 'app/store/apiService';
import { setSelectedEmailTemplate, setSelectedSmsTemplate } from './templatesSlice';

// Define tag types for invalidation
const TAGS = {
  EMAIL_TEMPLATE: 'EmailTemplate',
  SMS_TEMPLATE: 'SmsTemplate',
  RECIPIENT: 'Recipient',
  TEMPLATE_TYPE: 'TemplateType'
};

// Optimized templates API with better caching
export const templatesApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getTemplateTypes: builder.query({
      query: (medium) => ({
        url: medium 
          ? `/message-template/types?medium=${medium}` 
          : '/message-template/types',
        method: 'GET',
      }),
      providesTags: [{ type: TAGS.TEMPLATE_TYPE, id: 'LIST' }],
      transformResponse: (response) => {
        if (!response?.data) {
          return [];
        }
        return response.data;
      },
    }),
    getRecipients: builder.query({
      query: (medium) => ({
        url: medium 
          ? `/api/v1/recipients?medium=${medium}` 
          : '/api/v1/recipients',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TAGS.RECIPIENT, id })),
              { type: TAGS.RECIPIENT, id: 'LIST' },
            ]
          : [{ type: TAGS.RECIPIENT, id: 'LIST' }],
    }),
    
    addRecipient: builder.mutation({
      query: (recipient) => ({
        url: '/api/v1/recipients',
        method: 'POST',
        data: recipient,
      }),
      invalidatesTags: [{ type: TAGS.RECIPIENT, id: 'LIST' }],
    }),
    
    updateRecipient: builder.mutation({
      query: (recipient) => ({
        url: `/api/v1/recipients/${recipient.id}`,
        method: 'PUT',
        data: recipient,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: TAGS.RECIPIENT, id },
        { type: TAGS.RECIPIENT, id: 'LIST' },
      ],
    }),
    
    deleteRecipient: builder.mutation({
      query: (id) => ({
        url: `/api/v1/recipients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: TAGS.RECIPIENT, id },
        { type: TAGS.RECIPIENT, id: 'LIST' },
      ],
    }),
    sendBulkEmail: builder.mutation({
      query: (data) => ({
        url: '/api/v1/message-templates/bulk/email',
        method: 'POST',
        data,
      }),
    }),
    
    sendBulkSms: builder.mutation({
      query: (data) => ({
        url: '/api/v1/message-templates/bulk/sms',
        method: 'POST',
        data,
      }),
    }),
    testSendEmail: builder.mutation({
      query: (data) => ({
        url: '/api/v1/message-templates/test/email',
        method: 'POST',
        data,
      }),
    }),
    
    testSendSms: builder.mutation({
      query: (data) => ({
        url: '/api/v1/message-templates/test/sms',
        method: 'POST',
        data,
      }),
    }),
    getEmailTemplates: builder.query({
      query: (params) => ({
        url: '/message-template/email',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: TAGS.EMAIL_TEMPLATE, id })),
              { type: TAGS.EMAIL_TEMPLATE, id: 'LIST' },
            ]
          : [{ type: TAGS.EMAIL_TEMPLATE, id: 'LIST' }],
      // Normalize response format
      transformResponse: (response) => {
        if (!response?.data) {
          return { data: [] };
        }
        return response;
      },
      // Optimized fetch settings
      keepUnusedDataFor: 300, // 5 minutes
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Initialize selected template if needed
          if (data?.data?.length > 0) {
            // Find system templates first
            const systemTemplates = data.data.filter(template => template.isSystem);
            if (systemTemplates.length > 0) {
              dispatch(setSelectedEmailTemplate(systemTemplates[0]));
            } else if (data.data.length > 0) {
              dispatch(setSelectedEmailTemplate(data.data[0]));
            }
          }
        } catch (err) {
          // Error handling
        }
      }
    }),
    
    getEmailTemplateById: builder.query({
      query: (id) => ({
        url: `/message-template/email/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: TAGS.EMAIL_TEMPLATE, id }],
    }),
    
    createEmailTemplate: builder.mutation({
      query: (template) => ({
        url: '/message-template',
        method: 'POST',
        data: {
          ...template,
          medium: 'EMAIL',
          templateType: template.templateType?.toUpperCase(),
          createdAt: null,
          updatedAt: null,
        },
      }),
      invalidatesTags: [{ type: TAGS.EMAIL_TEMPLATE, id: 'LIST' }],
    }),
    
    updateEmailTemplate: builder.mutation({
      query: (template) => ({
        url: `/message-template/${template.id}`,
        method: 'PUT',
        data: {
          ...template,
          templateType: template.templateType?.toUpperCase(),
          createdAt: null,
          updatedAt: null,
        },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: TAGS.EMAIL_TEMPLATE, id },
        { type: TAGS.EMAIL_TEMPLATE, id: 'LIST' },
      ],
    }),
    
    deleteEmailTemplate: builder.mutation({
      query: (id) => ({
        url: `/message-template/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: TAGS.EMAIL_TEMPLATE, id },
        { type: TAGS.EMAIL_TEMPLATE, id: 'LIST' },
      ],
    }),
    
    // SMS templates endpoints
    getSmsTemplates: builder.query({
      query: (params) => ({
        url: '/message-template/sms',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: TAGS.SMS_TEMPLATE, id })),
              { type: TAGS.SMS_TEMPLATE, id: 'LIST' },
            ]
          : [{ type: TAGS.SMS_TEMPLATE, id: 'LIST' }],
      // Normalize response format
      transformResponse: (response) => {
        if (!response?.data) {
          return { data: [] };
        }
        return response;
      },
      // Optimized fetch settings
      keepUnusedDataFor: 300, // 5 minutes
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Initialize selected template if needed
          if (data?.data?.length > 0) {
            // Find system templates first
            const systemTemplates = data.data.filter(template => template.isSystem);
            if (systemTemplates.length > 0) {
              dispatch(setSelectedSmsTemplate(systemTemplates[0]));
            } else if (data.data.length > 0) {
              dispatch(setSelectedSmsTemplate(data.data[0]));
            }
          }
        } catch (err) {
          // Error handling
        }
      }
    }),
    
    getSmsTemplateById: builder.query({
      query: (id) => ({
        url: `/api/v1/message-templates/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: TAGS.SMS_TEMPLATE, id }],
    }),
    
    createSmsTemplate: builder.mutation({
      query: (template) => ({
        url: '/api/v1/message-templates',
        method: 'POST',
        data: {
          ...template,
          medium: 'SMS'
        },
      }),
      invalidatesTags: [{ type: TAGS.SMS_TEMPLATE, id: 'LIST' }],
    }),
    
    updateSmsTemplate: builder.mutation({
      query: (template) => ({
        url: `/api/v1/message-templates/${template.id}`,
        method: 'PUT',
        data: template,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: TAGS.SMS_TEMPLATE, id },
        { type: TAGS.SMS_TEMPLATE, id: 'LIST' },
      ],
    }),
    
    deleteSmsTemplate: builder.mutation({
      query: (id) => ({
        url: `/api/v1/message-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: TAGS.SMS_TEMPLATE, id },
        { type: TAGS.SMS_TEMPLATE, id: 'LIST' },
      ],
    }),
  }),
  // Override default settings for this specific api
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetTemplateTypesQuery,
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useGetSmsTemplatesQuery,
  useGetSmsTemplateByIdQuery,
  useCreateSmsTemplateMutation,
  useUpdateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
  useTestSendSmsMutation,
  useTestSendEmailMutation,
  useGetRecipientsQuery,
  useAddRecipientMutation,
  useUpdateRecipientMutation,
  useDeleteRecipientMutation,
  useSendBulkEmailMutation,
  useSendBulkSmsMutation
} = templatesApi;