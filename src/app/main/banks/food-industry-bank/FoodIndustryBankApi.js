import { apiService as api } from 'app/store/apiService';
import ProductModel from './product/models/ProductModel';

export const addTagTypes = [
	'eCommerce_products',
	'eCommerce_product',
	'eCommerce_orders',
	'eCommerce_order',
	'foodCompanyDetails',
	'foodCompanyList',
	'foodCompanyRequestList'
];
const FoodIndustryBankApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAllFoodIndustryCompanies: build.query({
				query: ({ pageNumber, pageSize, search, sort, filter }) => ({
					url: `/company/?categoryId=1&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ''}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''}`,
					method: 'GET'
				}),
				transformResponse: (response) => {
					const data = { data: response?.data };

					if (response && response.pagination) {
						data.totalPages = response.pagination.totalPages;
						data.totalElements = response.pagination.totalElements;
						data.pageSize = response.pagination.pageSize;
						data.pageIndex = response.pagination.pageNumber;
					}

					// console.log(`response: ${JSON.stringify(response)}`);
					// console.log(`Data: ${JSON.stringify(data)}`);
					return data;
				},
				providesTags: ['foodCompanyList']
			}),
			getFoodIndustryCompanyDetails: build.query({
				query: (companyId) => ({
					url: `/company/${companyId}`
				}),
				transformResponse: (response) => response?.data,
				providesTags: ['foodCompanyList', 'foodCompanyDetails']
			}),
			getAllFoodIndustryCompanyRequests: build.query({
				query: ({ pageNumber, pageSize, search, sort, filter }) => ({
					url: `/request/company?categoryId=1&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ''}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''}`,
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
				providesTags: ['foodCompanyRequestList']
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
export default FoodIndustryBankApi;
export const {
	useGetAllFoodIndustryCompaniesQuery,
	useGetAllFoodIndustryCompanyRequestsQuery,
	useGetFoodIndustryCompanyDetailsQuery,
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
} = FoodIndustryBankApi;
