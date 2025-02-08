import { apiService as api } from 'app/store/apiService';

// Tag types for category
const addTagTypes = ['categoryList', 'category'];

const CategoryApi = api
	.enhanceEndpoints({ addTagTypes })
	.injectEndpoints({
		endpoints: (builder) => ({
			// GET /category => fetch all categories
			getCategories: builder.query({
				query: () => ({
					url: '/category',
					method: 'GET'
				}),
				transformResponse: (response) => response?.data,
				providesTags: ['categoryList']
			}),

			// GET /category/{id} => fetch single category
			getCategory: builder.query({
				query: (id) => ({
					url: `/category/${id}`,
					method: 'GET'
				}),
				transformResponse: (response) => response?.data,
				providesTags: (result, error, id) => [{ type: 'category', id }]
			}),

			// POST /category => create new category
			createCategory: builder.mutation({
				query: (newCat) => ({
					url: '/category',
					method: 'POST',
					data: newCat
				}),
				transformResponse: (response) => response?.data,
				invalidatesTags: ['categoryList']
			}),

			// PUT /category/{id} => update existing category
			updateCategory: builder.mutation({
				query: ({ id, ...rest }) => ({
					url: `/category/${id}`,
					method: 'PUT',
					data: rest
				}),
				transformResponse: (response) => response?.data,
				invalidatesTags: (result, error, { id }) => [
					{ type: 'category', id },
					'categoryList'
				]
			}),

			// DELETE /category/{id} => delete existing category
			deleteCategory: builder.mutation({
				query: (id) => ({
					url: `/category/${id}`,
					method: 'DELETE'
				}),
				transformResponse: (response) => response?.data,
				invalidatesTags: ['categoryList']
			})
		}),
		overrideExisting: false
	});

export default CategoryApi;

export const {
	useGetCategoriesQuery,
	useGetCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation
} = CategoryApi;
