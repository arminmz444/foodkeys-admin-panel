// src/features/serviceSchemas/ServiceSchemaApi.js

import { apiService } from 'app/apiService';

export const serviceSchemaApi = apiService.injectEndpoints({
	endpoints: (builder) => ({
		// 1. Fetch all schemas
		getServiceSchemas: builder.query({
			query: () => '/service-schemas',
			providesTags: ['ServiceSchemas']
		}),

		// 2. Get schema by ID
		getServiceSchemaById: builder.query({
			query: (id) => `/service-schemas/${id}`
		}),

		// 3. Create a new schema
		createServiceSchema: builder.mutation({
			query: (payload) => ({
				url: '/service-schemas',
				method: 'POST',
				body: payload
			}),
			invalidatesTags: ['ServiceSchemas']
		}),

		// 4. Update schema
		updateServiceSchema: builder.mutation({
			query: ({ id, ...rest }) => ({
				url: `/service-schemas/${id}`,
				method: 'PUT',
				body: rest
			}),
			invalidatesTags: ['ServiceSchemas']
		}),

		// 5. Deploy schema => create ES index
		deployServiceSchema: builder.mutation({
			query: (id) => ({
				url: `/service-schemas/${id}/deploy`,
				method: 'POST'
			})
		})
	}),
	overrideExisting: false
});

export const {
	useGetServiceSchemasQuery,
	useGetServiceSchemaByIdQuery,
	useCreateServiceSchemaMutation,
	useUpdateServiceSchemaMutation,
	useDeployServiceSchemaMutation
} = serviceSchemaApi;
