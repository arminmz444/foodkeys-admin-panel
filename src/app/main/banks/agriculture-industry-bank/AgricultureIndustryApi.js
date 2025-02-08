import { apiService as api } from 'app/store/apiService';
import CompanyModel from './company/models/CompanyModel.js';

export const addTagTypes = ['eCommerce_products', 'eCommerce_product', 'eCommerce_orders', 'eCommerce_order'];
const AgricultureIndustryApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAllCompanies: build.query({
				query: () => ({
					url: '/company/?categoryId=2',
					method: 'GET'
				}),
				transformResponse: (response) => response?.data,
				providesTags: ['agricultureCompanyList']
			}),
			getAllCompanyRequests: build.query({
				query: () => ({
					url: '/request/company',
					method: 'GET'
				}),
				transformResponse: (response) => response?.data,
				providesTags: ['agricultureCompanyRequestList']
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
					data: CompanyModel(newProduct)
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
export default AgricultureIndustryApi;
export const {
	useGetAllCompaniesQuery,
	useGetAllCompanyRequestsQuery,
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
} = AgricultureIndustryApi;
