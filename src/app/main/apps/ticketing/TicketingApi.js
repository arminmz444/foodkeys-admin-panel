import { apiService as api } from "app/store/apiService";

export const addTagTypes = [
  "tickets",
  "ticket",
  "ticket_messages",
  "ticket_message",
  "ticket_categories",
  "ticket_departments",
  "ticket_priorities",
  "user_profile",
];

const TicketsApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTickets: build.query({
        query: (params) => ({
          url: `/ticket/`,
          params,
        }),
        transformResponse: (response) => {
          return response?.data;
        },
        providesTags: (result, error, params) => [
          { type: "tickets", id: "LIST" },
          ...(result?.map(({ id }) => ({ type: "tickets", id })) || [])
        ],
        // Force refetch when parameters change
        keepUnusedDataFor: 0,
      }),
      getTicketById: build.query({
        query: (ticketId) => ({
          url: `/ticket/${ticketId}/`,
        }),
        transformResponse: (response) => {
          return response?.data;
        },
        providesTags: (result, error, id) => [{ type: "ticket", id }],
      }),
      createTicket: build.mutation({
        query: (ticket) => ({
          url: `/ticket/`,
          method: "POST",
          data: ticket,
        }),
        invalidatesTags: [
          { type: "tickets", id: "LIST" },
          "tickets"
        ],
      }),
      updateTicketStatus: build.mutation({
        query: ({ ticketId, status }) => ({
          url: `/ticket/${ticketId}/status`,
          method: "PUT",
          data: { status },
        }),
        invalidatesTags: (result, error, { ticketId }) => [
          { type: "ticket", id: ticketId },
          { type: "tickets", id: "LIST" },
          "tickets",
        ],
      }),
      deleteTicket: build.mutation({
        query: (ticketId) => ({
          url: `/ticket/${ticketId}`,
          method: "DELETE",
        }),
        invalidatesTags: [
          { type: "tickets", id: "LIST" },
          "tickets"
        ],
      }),
      getTicketMessages: build.query({
        query: ({ ticketId, ...params }) => ({
          url: `/ticket/${ticketId}/messages`,
          params,
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, { ticketId }) => [
          { type: "ticket_messages", id: ticketId },
        ],
      }),
      sendTicketMessage: build.mutation({
        query: ({ ticketId, message }) => ({
          url: `/ticket/${ticketId}/messages`,
          method: "POST",
          data: message,
        }),
        invalidatesTags: (result, error, { ticketId }) => [
          { type: "ticket_messages", id: ticketId },
          { type: "ticket", id: ticketId },
          { type: "tickets", id: "LIST" },
          "tickets",
        ],
      }),
      uploadMessageAttachment: build.mutation({
        query: ({ ticketId, messageId, file }) => {
          const formData = new FormData();
          formData.append("file", file);

          return {
            url: `/ticket/${ticketId}/messages/${messageId}/attachments`,
            method: "POST",
            data: formData,
            formData: true,
          };
        },
        invalidatesTags: (result, error, { ticketId, messageId }) => [
          { type: "ticket_message", id: messageId },
          { type: "ticket_messages", id: ticketId },
        ],
      }),
      getTicketCategories: build.query({
        query: () => ({ url: `/ticket/categories` }),
        providesTags: ["ticket_categories"],
      }),
      getTicketDepartments: build.query({
        query: () => ({ url: `/ticket/departments` }),
        providesTags: ["ticket_departments"],
      }),
      getTicketPriorities: build.query({
        query: () => ({ url: `/ticket/priorities` }),
        providesTags: ["ticket_priorities"],
      }),
      getUserProfile: build.query({
        query: () => ({ url: `/user/me` }),
        providesTags: ["user_profile"],
      }),
    }),
    overrideExisting: false,
  });

export default TicketsApi;
export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
  useGetTicketMessagesQuery,
  useSendTicketMessageMutation,
  useUploadMessageAttachmentMutation,
  useGetTicketCategoriesQuery,
  useGetTicketDepartmentsQuery,
  useGetTicketPrioritiesQuery,
  useGetUserProfileQuery,
} = TicketsApi;
