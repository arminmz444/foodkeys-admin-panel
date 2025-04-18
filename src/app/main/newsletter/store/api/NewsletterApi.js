// src/./store/api/NewsletterApi.js
import { apiService as api } from 'app/store/apiService';

export const addTagTypes = [
  'newsletter',
  'newsletters',
  'newsletter_stats',
  'subscribers',
  'pending_newsletters'
];

const NewsletterApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getNewsletters: build.query({
        query: ({ pageNumber = 1, pageSize = 10 }) => ({
          url: `/newsletter?pageNumber=${pageNumber}&pageSize=${pageSize}`,
          method: 'GET'
        }),
        transformResponse: (response) => {
          return {
            data: response?.data,
            pagination: response?.pagination
          };
        },
        providesTags: ['newsletters']
      }),
      
      getNewsletter: build.query({
        query: (id) => ({
          url: `/newsletter/${id}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, id) => [{ type: 'newsletter', id }]
      }),
      
      createNewsletter: build.mutation({
        query: (newsletterData) => ({
          url: '/newsletter',
          method: 'POST',
          data: newsletterData
        }),
        invalidatesTags: ['newsletters', 'newsletter_stats']
      }),
      
      updateNewsletter: build.mutation({
        query: ({ id, newsletterData }) => ({
          url: `/newsletter/${id}`,
          method: 'PUT',
          data: newsletterData
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'newsletter', id },
          'newsletters',
          'newsletter_stats'
        ]
      }),
      
      deleteNewsletter: build.mutation({
        query: (id) => ({
          url: `/newsletter/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['newsletters', 'newsletter_stats']
      }),
      
      sendNewsletter: build.mutation({
        query: (id) => ({
          url: `/newsletter/${id}/send`,
          method: 'POST'
        }),
        invalidatesTags: (result, error, id) => [
          { type: 'newsletter', id },
          'newsletters',
          'newsletter_stats',
          'pending_newsletters'
        ]
      }),
      
      getPendingNewsletters: build.query({
        query: () => ({
          url: '/newsletter/pending',
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['pending_newsletters']
      }),
      
      subscribeToNewsletter: build.mutation({
        query: (subscriberData) => ({
          url: '/newsletter/subscribe',
          method: 'POST',
          data: subscriberData
        }),
        invalidatesTags: ['subscribers', 'newsletter_stats']
      }),
      
      unsubscribeFromNewsletter: build.mutation({
        query: (subscriberData) => ({
          url: '/newsletter/unsubscribe',
          method: 'POST',
          data: subscriberData
        }),
        invalidatesTags: ['subscribers', 'newsletter_stats']
      }),
      
      getSubscribers: build.query({
        query: () => ({
          url: '/newsletter/subscribers',
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['subscribers']
      }),
      
      getNewsletterStats: build.query({
        query: () => ({
          url: '/newsletter/stats',
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['newsletter_stats']
      })
    }),
    overrideExisting: false
  });

export default NewsletterApi;
export const {
  useGetNewslettersQuery,
  useGetNewsletterQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
  useSendNewsletterMutation,
  useGetPendingNewslettersQuery,
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
  useGetSubscribersQuery,
  useGetNewsletterStatsQuery
} = NewsletterApi;