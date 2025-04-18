import { apiService as api } from "app/store/apiService";
// import ProductModel from '../users/product/models/ProductModel';

// Tag types for subscription
const addTagTypes = ["Subscription"];

const SubscriptionsApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: ({ pageNumber, pageSize, search, sort, filter }) => ({
        url: `/subscription?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ""}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ""}`,
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
              ...result.data.map(({ id }) => ({ type: "Subscription", id })),
              { type: "Subscription", id: "LIST" },
            ]
          : [{ type: "Subscription", id: "LIST" }],
      keepUnusedDataFor: 3600,
    }),
    getSubscription: builder.query({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),
    createSubscription: builder.mutation({
      query: (body) => ({
        url: "/subscription/",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response,
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscription", id },
      ],
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscription", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export default SubscriptionsApi;

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = SubscriptionsApi;
