import { apiService as api } from 'app/store/apiService.js';
import ProductModel from './product/models/ProductModel.js';

export const addTagTypes = [
	'users_list',
	'eCommerce_products',
	'eCommerce_product',
	'eCommerce_orders',
	'eCommerce_order',
	'user'
];
const UserApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			// GET /user/ => returns list of users
			getUsersList: build.query({
				query: () => ({
					url: `/user/`,
					method: 'GET'
				}),
				providesTags: ['users_list']
			}),
			// GET /user/{id} => returns single user
			getUser: build.query({
				query: (id) => ({
					url: `/user/${id}`,
					method: 'GET'
				}),
				providesTags: (result, error, id) => [{ type: 'user', id }]
			}),
			// POST /user/ => create a new user
			createUser: build.mutation({
				query: (newUser) => ({
					url: `/user/`,
					method: 'POST',
					data: newUser
				}),
				invalidatesTags: ['users_list', 'user']
			}),
			// PUT /user/{id} => update an existing user
			updateUser: build.mutation({
				query: ({ id, ...rest }) => ({
					url: `/user/${id}`,
					method: 'PUT',
					data: rest
				}),
				invalidatesTags: (result, error, { id }) => [{ type: 'user', id }, 'users_list']
			}),
			// DELETE /user/{id} => delete a user
			deleteUser: build.mutation({
				query: (id) => ({
					url: `/user/${id}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['users_list']
			}),
			getECommerceProducts: build.query({
				query: () => ({ url: `/mock-api/ecommerce/products` }),
				providesTags: ['eCommerce_products']
			}),
			deleteECommerceProducts: build.mutation({
				query: (productIds) => ({
					url: `/mock-api/ecommerce/products`,
					method: 'DELETE',
					data: productIds
				}),
				invalidatesTags: ['eCommerce_products']
			}),
			getECommerceProduct: build.query({
				query: (productId) => ({
					url: `/mock-api/ecommerce/products/${productId}`
				}),
				providesTags: ['eCommerce_product', 'eCommerce_products']
			}),
			createECommerceProduct: build.mutation({
				query: (newProduct) => ({
					url: `/mock-api/ecommerce/products`,
					method: 'POST',
					data: ProductModel(newProduct)
				}),
				invalidatesTags: ['eCommerce_products', 'eCommerce_product']
			}),
			updateECommerceProduct: build.mutation({
				query: (product) => ({
					url: `/mock-api/ecommerce/products/${product.id}`,
					method: 'PUT',
					data: product
				}),
				invalidatesTags: ['eCommerce_product', 'eCommerce_products']
			}),
			deleteECommerceProduct: build.mutation({
				query: (productId) => ({
					url: `/mock-api/ecommerce/products/${productId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['eCommerce_product', 'eCommerce_products']
			}),
			getECommerceOrders: build.query({
				query: () => ({ url: `/mock-api/ecommerce/orders` }),
				providesTags: ['eCommerce_orders']
			}),
			getECommerceOrder: build.query({
				query: (orderId) => ({ url: `/mock-api/ecommerce/orders/${orderId}` }),
				providesTags: ['eCommerce_order']
			}),
			updateECommerceOrder: build.mutation({
				query: (order) => ({
					url: `/mock-api/ecommerce/orders/${order.id}`,
					method: 'PUT',
					data: order
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			}),
			deleteECommerceOrder: build.mutation({
				query: (orderId) => ({
					url: `/mock-api/ecommerce/orders/${orderId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			}),
			deleteECommerceOrders: build.mutation({
				query: (ordersId) => ({
					url: `/mock-api/ecommerce/orders`,
					method: 'DELETE',
					data: ordersId
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			})
		}),
		overrideExisting: false
	});

export default UserApi;
export const {
	useGetUsersListQuery,
	useGetUserQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
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
	useCreateECommerceProductMutation
} = UserApi;
