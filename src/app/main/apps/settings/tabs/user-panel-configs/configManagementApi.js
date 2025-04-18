import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['ConfigList', 'Config', 'EndpointMappingList', 'EndpointMapping'];
export const configManagementApi = api
.enhanceEndpoints({
  addTagTypes
}).injectEndpoints({
  endpoints: (builder) => ({
    getConfigs: builder.query({
      query: ({ category = '', pageNumber = 0, pageSize = 10 }) => ({
        url: '/config/user-panel',
        params: { category, pageNumber, pageSize }
      }),
      providesTags: (result) =>
        (result && result.data && Array.isArray(result.data))
          ? [
              ...result.data.map(({ name }) => ({ type: 'Config', id: name })),
              { type: 'ConfigList', id: 'LIST' }
            ]
          : [{ type: 'ConfigList', id: 'LIST' }],
      keepUnusedDataFor: 3600 
    }),
    updateConfig: builder.mutation({
      query: ({ configName, configData }) => ({
        url: `/configs/${configName}`,
        method: 'PUT',
        body: configData
      }),
      invalidatesTags: (result, error, { configName }) => [
        { type: 'Config', id: configName },
        { type: 'ConfigList', id: 'LIST' }
      ]
    }),
    getEndpointMappings: builder.query({
      query: () => '/endpoints',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'EndpointMapping', id })),
              { type: 'EndpointMappingList', id: 'LIST' }
            ]
          : [{ type: 'EndpointMappingList', id: 'LIST' }],
      keepUnusedDataFor: 3600
    }),
    createEndpointMapping: builder.mutation({
      query: (data) => ({
        url: '/endpoints',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'EndpointMappingList', id: 'LIST' }]
    }),
    updateEndpointMapping: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/endpoints/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'EndpointMapping', id },
        { type: 'EndpointMappingList', id: 'LIST' }
      ]
    }),
    deleteEndpointMapping: builder.mutation({
      query: (id) => ({
        url: `/endpoints/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'EndpointMapping', id },
        { type: 'EndpointMappingList', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetConfigsQuery,
  useUpdateConfigMutation,
  useGetEndpointMappingsQuery,
  useCreateEndpointMappingMutation,
  useUpdateEndpointMappingMutation,
  useDeleteEndpointMappingMutation
} = configManagementApi;

export default configManagementApi;
