import { apiService as api } from 'app/store/apiService';

// Tag types for bundle
const addTagTypes = ['Bundle', 'BundleSubCategory', 'BundleCategory'];

const BundlesApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
	endpoints: (builder) => ({
		getBundles: builder.query({
			query: ({ pageNumber, pageSize, search, sort, filter, subCategoryId }) => {
				let url = `/bundle?pageNumber=${pageNumber}&pageSize=${pageSize}`;

				if (search) url += `&search=${search}`;
				if (sort && Object.entries(sort)?.length) url += `&sort=${JSON.stringify(sort)}`;
				if (filter && Object.entries(filter)?.length) url += `&filter=${JSON.stringify(filter)}`;
				if (subCategoryId) url += `&subCategoryId=${subCategoryId}`;

				return {
					url,
					method: 'GET'
				};
			},
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
						...result.data.map(({ id }) => ({ type: 'Bundle', id })),
						{ type: 'Bundle', id: 'LIST' }
					]
					: [{ type: 'Bundle', id: 'LIST' }],
			keepUnusedDataFor: 3600
		}),

		getBundle: builder.query({
			query: (id) => ({
				url: `/bundle/${id}`,
				method: 'GET'
			}),
			transformResponse: (response) => response?.data,
			providesTags: (result, error, id) => [{ type: 'Bundle', id }]
		}),

		createBundle: builder.mutation({
			query: (bundle) => ({
				url: '/bundle/',
				method: 'POST',
				data: bundle
			}),
			transformResponse: (response) => response?.data,
			invalidatesTags: [
				{ type: 'Bundle', id: 'LIST' },
				{ type: 'BundleSubCategory', id: 'LIST' }
			]
		}),

		updateBundle: builder.mutation({
			query: ({ id, ...body }) => ({
				url: `/bundle/${id}`,
				method: 'PUT',
				body
			}),
			transformResponse: (response) => response?.data,
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Bundle', id },
				{ type: 'Bundle', id: 'LIST' }
			]
		}),

		deleteBundle: builder.mutation({
			query: (id) => ({
				url: `/bundle/${id}`,
				method: 'DELETE'
			}),
			transformResponse: (response) => response?.data,
			invalidatesTags: (result, error, id) => [
				{ type: 'Bundle', id },
				{ type: 'Bundle', id: 'LIST' },
				{ type: 'BundleSubCategory', id: 'LIST' }
			]
		}),

		activateOrDeactivateBundle: builder.mutation({
			query: ({ id, status }) => ({
				url: `/bundle/${id}/status`,
				method: 'PUT',
				body: { status }
			}),
			transformResponse: (response) => response?.data,
			invalidatesTags: (result, error, { id }) => [

				(result && result.subCategoryId) ?
					[{ type: 'Bundle', id },
						{ type: 'Bundle', id: 'LIST' },
						{ type: 'BundleSubCategory', id: 'LIST' },
						{ type: 'BundleSubCategory', id: resutl.subCategoryId }]
					: [{ type: 'Bundle', id }, { type: 'Bundle', id: 'LIST' }, {
						type: 'BundleSubCategory',
						id: 'LIST'
					}]
			]
		}),

		getBundlesOfSubCategory: builder.query({
			query: ({ subCategoryId, pageNumber, pageSize }) => ({
				url: `/bundle/subcategory/${subCategoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
				method: 'GET'
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
			providesTags: (result, error, { subCategoryId }) => [
				{ type: 'BundleSubCategory', id: subCategoryId },
				{ type: 'Bundle', id: 'LIST' }
			]
		}),

		getSubCategoryInfo: builder.query({
			query: (subCategoryId) => ({
				url: `/bundle/subcategory/${subCategoryId}/info`,
				method: 'GET'
			}),
			transformResponse: (response) => response?.data
			// providesTags: (result, error, subCategoryId) => [
			// 	{ type: 'BundleSubCategory', id: `${subCategoryId}` }
			// ]
		}),

		getBundleCategories: builder.query({
			query: ({ pageNumber, pageSize }) => ({
				url: `/category/options?pageNumber=${pageNumber}&pageSize=${pageSize}`,
				method: 'GET'
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
			providesTags: [{ type: 'Category', id: `LIST` }]
		}),
		// getBundleSubCategoriesInfinite: builder.infiniteQuery({
		// 	query: ({ categoryId, pageParam, pageSize }) => ({
		// 		url: `/bundle/subcategory?categoryId=${categoryId}`,
		// 		params: { categoryId, pageNumber: pageParam, pageSize }
		// 	}),
		// 	infiniteQueryOptions: {
		// 		initialPageParam: 1,
		// 		getNextPageParam: (lastPage, allPages, lastPageParam) => {
		// 			return lastPage.data?.length === 0 ? undefined : lastPageParam + 1;
		// 		},
		// 		getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
		// 			return firstPageParam <= 1 ? undefined : firstPageParam - 1;
		// 		}
		// 	}
		// }),

		getBundleSubCategories: builder.query({
			query: ({ categoryId, pageNumber, pageSize }) => {
				// let url = `/bundle/subcategory?pageNumber=${pageNumber}&pageSize=${pageSize}`;
				let url = `/bundle/subcategory?pageNumber=${pageNumber}&pageSize=${pageSize}`;
				if (categoryId) url += `&categoryId=${categoryId}`;
				return {
					url,
					method: 'GET'
				};
			},
			transformResponse: (response) => {
				const data = { data: response?.data };
				const pagination = response?.pagination;
				if (pagination) {
					data.totalPages = pagination.totalPages;
					data.totalElements = pagination.totalElements;
					data.pageSize = pagination.pageSize;
					data.pageIndex = pagination.pageIndex;
					data.pageNumber = pagination.pageNumber;
				}

				return data;
			},
			providesTags: [{ type: 'Bundle', id: `SUB_CATEGORIES_LIST` }]
		})
	}),
	overrideExisting: false
});

export default BundlesApi;

export const {
	useGetBundlesQuery,
	useGetBundleQuery,
	useCreateBundleMutation,
	useUpdateBundleMutation,
	useDeleteBundleMutation,
	useActivateOrDeactivateBundleMutation,
	useGetBundlesOfSubCategoryQuery,
	useGetSubCategoryInfoQuery,
	useGetBundleCategoriesQuery,
	useGetBundleSubCategoriesQuery
} = BundlesApi;
