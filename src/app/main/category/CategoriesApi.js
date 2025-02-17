import { apiService as api } from 'app/store/apiService';
import ProductModel from '../users/product/models/ProductModel';

// Tag types for category
const addTagTypes = ['categoryList', 'eCommerce_products',
	'eCommerce_product',
	'eCommerce_orders',
	'eCommerce_order', 'category'];

const CategoryApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
	endpoints: (builder) => ({
		getECommerceProducts: builder.query({
			query: () => ({ url: `/mock-api/ecommerce/products` }),
			providesTags: ['eCommerce_products']
		}),
		deleteECommerceProducts: builder.mutation({
			query: (productIds) => ({
				url: `/mock-api/ecommerce/products`,
				method: 'DELETE',
				data: productIds
			}),
			invalidatesTags: ['eCommerce_products']
		}),
		getECommerceProduct: builder.query({
			query: (productId) => ({
				url: `/mock-api/ecommerce/products/${productId}`
			}),
			providesTags: ['eCommerce_product', 'eCommerce_products']
		}),
		createECommerceProduct: builder.mutation({
			query: (newProduct) => ({
				url: `/mock-api/ecommerce/products`,
				method: 'POST',
				data: ProductModel(newProduct)
			}),
			invalidatesTags: ['eCommerce_products', 'eCommerce_product']
		}),
		updateECommerceProduct: builder.mutation({
			query: (product) => ({
				url: `/mock-api/ecommerce/products/${product.id}`,
				method: 'PUT',
				data: product
			}),
			invalidatesTags: ['eCommerce_product', 'eCommerce_products']
		}),
		deleteECommerceProduct: builder.mutation({
			query: (productId) => ({
				url: `/mock-api/ecommerce/products/${productId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['eCommerce_product', 'eCommerce_products']
		}),
		getECommerceOrders: builder.query({
			query: () => ({ url: `/mock-api/ecommerce/orders` }),
			providesTags: ['eCommerce_orders']
		}),
		getECommerceOrder: builder.query({
			query: (orderId) => ({ url: `/mock-api/ecommerce/orders/${orderId}` }),
			providesTags: ['eCommerce_order']
		}),
		updateECommerceOrder: builder.mutation({
			query: (order) => ({
				url: `/mock-api/ecommerce/orders/${order.id}`,
				method: 'PUT',
				data: order
			}),
			invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
		}),
		deleteECommerceOrder: builder.mutation({
			query: (orderId) => ({
				url: `/mock-api/ecommerce/orders/${orderId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
		}),
		deleteECommerceOrders: builder.mutation({
			query: (ordersId) => ({
				url: `/mock-api/ecommerce/orders`,
				method: 'DELETE',
				data: ordersId
			}),
			invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
		}),
		// GET /category => fetch all categories
		getCategories: builder.query({
			query: ({ pageNumber, pageSize, search, sort, filter }) => ({
				url: `/category?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ''}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''}`,
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

				// console.log(`response: ${JSON.stringify(response)}`);
				// console.log(`Data: ${JSON.stringify(data)}`);
				return data;
			},
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

		createCategory: builder.mutation({
			query: (newCat) => ({
				url: '/category/',
				method: 'POST',
				data: newCat
			}),
			transformResponse: (response) => response,
			// onMutate: (newUserInfo: User) => {
			// 	queryClient.setQueryData(
			// 		['users'],
			// 		(prevUsers: any) =>
			// 			[
			// 				...prevUsers,
			// 				{
			// 					...newUserInfo,
			// 					id: (Math.random() + 1).toString(36).substring(7),
			// 				},
			// 			] as User[],
			// );
			// },
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
			invalidatesTags: (result, error, { id }) => [{ type: 'category', id }, 'categoryList']
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
	useDeleteCategoryMutation,
	useGetECommerceProductsQuery,
	useDeleteECommerceProductsMutation,
	useGetECommerceProductQuery,
	useUpdateECommerceProductMutation,
	useDeleteECommerceProductMutation,
	useGetECommerceOrdersQuery,
	useGetECommerceOrderQuery,
	useUpdateECommerceOrderMutation,
	useDeleteECommerceOrderMutation,
	useDeleteECommerceOrdersMutation,
	useCreateECommerceProductMutation,
} = CategoryApi;
