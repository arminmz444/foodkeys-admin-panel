// import { apiService as api } from 'app/store/apiService';
// import ProductModel from './product/models/ProductModel';

// export const addTagTypes = [
// 	'eCommerce_products',
// 	'eCommerce_product',
// 	'eCommerce_orders',
// 	'eCommerce_order',
// 	'foodCompanyDetails',
// 	'foodCompanyList',
// 	'foodCompanyRequestList'
// ];
// const FoodIndustryBankApi = api
// 	.enhanceEndpoints({
// 		addTagTypes
// 	})
// 	.injectEndpoints({
// 		endpoints: (build) => ({
// 			getAllFoodIndustryCompanies: build.query({
// 				query: ({ pageNumber, pageSize, search, sort, filter }) => ({
// 					url: `/company/?categoryId=1&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ''}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''}`,
// 					method: 'GET'
// 				}),
// 				transformResponse: (response) => {
// 					const data = { data: response?.data };

// 					if (response && response.pagination) {
// 						data.totalPages = response.pagination.totalPages;
// 						data.totalElements = response.pagination.totalElements;
// 						data.pageSize = response.pagination.pageSize;
// 						data.pageIndex = response.pagination.pageNumber;
// 					}

// 					// console.log(`response: ${JSON.stringify(response)}`);
// 					// console.log(`Data: ${JSON.stringify(data)}`);
// 					return data;
// 				},
// 				providesTags: ['foodCompanyList']
// 			}),
// 			getFoodIndustryCompanyDetails: build.query({
// 				query: (companyId) => ({
// 					url: `/company/${companyId}`
// 				}),
// 				transformResponse: (response) => response?.data,
// 				providesTags: ['foodCompanyList', 'foodCompanyDetails']
// 			}),
// 			getAllFoodIndustryCompanyRequests: build.query({
// 				query: ({ pageNumber, pageSize, search, sort, filter }) => ({
// 					url: `/request/company?categoryId=1&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${(sort && Object.entries(sort)?.length && JSON.stringify(sort)) || ''}&filter=${(filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''}`,
// 					method: 'GET'
// 				}),
// 				transformResponse: (response) => {
// 					const data = { data: response?.data };

// 					if (response && response.pagination) {
// 						data.totalPages = response.pagination.totalPages;
// 						data.totalElements = response.pagination.totalElements;
// 						data.pageSize = response.pagination.pageSize;
// 						data.pageIndex = response.pagination.pageIndex;
// 					}

// 					// console.log(`response: ${JSON.stringify(response)}`);
// 					// console.log(`Data: ${JSON.stringify(data)}`);
// 					return data;
// 				},
// 				providesTags: ['foodCompanyRequestList']
// 			}),
// 			getECommerceProducts: build.query({
// 				query: () => ({ url: `/mock-api/ecommerce/products` }),
// 				providesTags: ['eCommerce_products']
// 			}),
// 			deleteECommerceProducts: build.mutation({
// 				query: (productIds) => ({
// 					url: `/mock-api/ecommerce/products`,
// 					method: 'DELETE',
// 					data: productIds
// 				}),
// 				invalidatesTags: ['eCommerce_products']
// 			}),
// 			getECommerceProduct: build.query({
// 				query: (productId) => ({
// 					url: `/mock-api/ecommerce/products/${productId}`
// 				}),
// 				providesTags: ['eCommerce_product', 'eCommerce_products']
// 			}),
// 			createECommerceProduct: build.mutation({
// 				query: (newProduct) => ({
// 					url: `/mock-api/ecommerce/products`,
// 					method: 'POST',
// 					data: ProductModel(newProduct)
// 				}),
// 				invalidatesTags: ['eCommerce_products', 'eCommerce_product']
// 			}),
// 			updateECommerceProduct: build.mutation({
// 				query: (product) => ({
// 					url: `/mock-api/ecommerce/products/${product.id}`,
// 					method: 'PUT',
// 					data: product
// 				}),
// 				invalidatesTags: ['eCommerce_product', 'eCommerce_products']
// 			}),
// 			deleteECommerceProduct: build.mutation({
// 				query: (productId) => ({
// 					url: `/mock-api/ecommerce/products/${productId}`,
// 					method: 'DELETE'
// 				}),
// 				invalidatesTags: ['eCommerce_product', 'eCommerce_products']
// 			}),
// 			getECommerceOrders: build.query({
// 				query: () => ({ url: `/mock-api/ecommerce/orders` }),
// 				providesTags: ['eCommerce_orders']
// 			}),
// 			getECommerceOrder: build.query({
// 				query: (orderId) => ({ url: `/mock-api/ecommerce/orders/${orderId}` }),
// 				providesTags: ['eCommerce_order']
// 			}),
// 			updateECommerceOrder: build.mutation({
// 				query: (order) => ({
// 					url: `/mock-api/ecommerce/orders/${order.id}`,
// 					method: 'PUT',
// 					data: order
// 				}),
// 				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
// 			}),
// 			deleteECommerceOrder: build.mutation({
// 				query: (orderId) => ({
// 					url: `/mock-api/ecommerce/orders/${orderId}`,
// 					method: 'DELETE'
// 				}),
// 				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
// 			}),
// 			deleteECommerceOrders: build.mutation({
// 				query: (ordersId) => ({
// 					url: `/mock-api/ecommerce/orders`,
// 					method: 'DELETE',
// 					data: ordersId
// 				}),
// 				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
// 			})
// 		}),
// 		overrideExisting: false
// 	});
// export default FoodIndustryBankApi;
// export const {
// 	useGetAllFoodIndustryCompaniesQuery,
// 	useGetAllFoodIndustryCompanyRequestsQuery,
// 	useGetFoodIndustryCompanyDetailsQuery,
// 	useGetECommerceProductsQuery,
// 	useDeleteECommerceProductsMutation,
// 	useGetECommerceProductQuery,
// 	useUpdateECommerceProductMutation,
// 	useDeleteECommerceProductMutation,
// 	useGetECommerceOrdersQuery,
// 	useGetECommerceOrderQuery,
// 	useUpdateECommerceOrderMutation,
// 	useDeleteECommerceOrderMutation,
// 	useDeleteECommerceOrdersMutation,
// 	useCreateECommerceProductMutation
// } = FoodIndustryBankApi;

// FoodIndustryBankApi.js - Modified with archive endpoints
import { apiService as api } from 'app/store/apiService';
import ProductModel from './product/models/ProductModel';

export const addTagTypes = [
  'foodCompanyDetails',
  'foodCompanyList',
  'foodCompanyRequestList',
  'companyArchives',
  'archiveTypes'
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

          return data;
        },
        providesTags: ['foodCompanyList']
      }),
      getEmployeeCommentsByEntity: build.query({
        query: ({ entityType, entityId, pageNumber, pageSize }) => ({
          url: `/employee/comment/entity/${entityType}/${entityId}/page`,
          method: 'GET',
          params: { 
            pageNumber: pageNumber || 1,
            pageSize: pageSize || 10
          }
        }),
        // transformResponse: (response) => {
        //   return response?.data || [];
        // },
        providesTags: ['employeeComments']
      }),

      getEmployeeCommentById: build.query({
        query: (commentId) => ({
          url: `/employee/comment/${commentId}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, id) => [{ type: 'employeeComments', id }]
      }),

      addEmployeeComment: build.mutation({
        query: (commentData) => ({
          url: `/employee/comment`,
          method: 'POST',
          data: commentData
        }),
        invalidatesTags: ['employeeComments']
      }),

      updateEmployeeComment: build.mutation({
        query: ({ id, commentData }) => ({
          url: `/employee/comment/${id}`,
          method: 'PUT',
          data: commentData
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'employeeComments', id },
          'employeeComments'
        ]
      }),

      deleteEmployeeComment: build.mutation({
        query: (commentId) => ({
          url: `/employee/comment/${commentId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['employeeComments']
      }),
      getFoodIndustryCompanyDetails: build.query({
        query: (companyId) => ({
          url: `/company/${companyId}`
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['foodCompanyList', 'foodCompanyDetails']
      }),

      updateCompanyLocation: build.mutation({
      query: ({ companyId, locationData }) => ({
        url: `companies/${companyId}/location`,
        method: 'PUT',
        data: locationData,
      }),
      invalidatesTags: (result, error, { companyId }) => [
        { type: 'FoodIndustryCompany', id: companyId },
      ],
    }),
      
    uploadGalleryFiles: build.mutation({
      query: ({ files, fileServiceType }) => {
        // Create a new FormData instance
        const formData = new FormData();
        
        // Append each file to the formData
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        
        // Append the fileServiceType parameter
        formData.append('fileServiceType', fileServiceType);
        
        return {
          url: '/file',  // Changed to match your backend's actual endpoint
          method: 'POST',
          // Don't set Content-Type header manually - fetchBaseQuery will set it correctly with boundary
          data: formData,  // Use 'body' instead of 'data' for formData
          formData: true,  // Signal that this is a formData request
        };
      },
    }),
    
    getCompanyGalleryFiles: build.query({
      query: (companyId) => `food-industry-bank/companies/${companyId}/gallery-files`,
      providesTags: (result, error, companyId) => [
        { type: 'GalleryFiles', id: companyId },
      ],
    }),
    
    updateGalleryFileMetadata: build.mutation({
      query: ({ fileId, metadata }) => ({
        url: `/file/${fileId}/metadata`,
        method: 'PUT',
        data: { metadata },  // Changed from 'data' to 'body'
      }),
      invalidatesTags: (result, error, { companyId }) => [
        { type: 'GalleryFiles', id: companyId },
      ],
    }),
    
    deleteGalleryFile: build.mutation({
      query: (fileId) => ({
        url: `/v1/file/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { companyId }) => [
        { type: 'GalleryFiles', id: companyId },
      ],
    }),
    
    saveCompanyGalleryFiles: build.mutation({
      query: ({ companyId, galleryFiles }) => ({
        url: `food-industry-bank/companies/${companyId}/gallery-files`,
        method: 'POST',
        data: { galleryFiles },  // Changed from 'data' to 'body'
      }),
      invalidatesTags: (result, error, { companyId }) => [
        { type: 'GalleryFiles', id: companyId },
        { type: 'FoodIndustryCompany', id: companyId },
      ],
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

          return data;
        },
        providesTags: ['foodCompanyRequestList']
      }),
      
      getCompanyRequests: build.query({
        query: ({ pageNumber = 1, pageSize, search, sort, filter, categoryId }) => ({
          url: `/request/company`,
          method: 'GET',
          params: {
            pageNumber: pageNumber !== 0 ? pageNumber : 1,
            pageSize: pageSize || 10,
            search: search || '',
            categoryId: categoryId || 1,
            sort: (sort && Object.entries(sort)?.length && JSON.stringify(sort)) || '',
            filter: (filter && Object.entries(filter)?.length && JSON.stringify(filter)) || ''
          }
        }),
        transformResponse: (response) => {
          const data = { data: response?.data };

          if (response && response.pagination) {
            data.totalPages = response.pagination.totalPages;
            data.totalElements = response.pagination.totalElements;
            data.pageSize = response.pagination.pageSize;
            data.pageIndex = response.pagination.pageNumber;
          }

          return data;
        },
        providesTags: ['companyRequests']
      }),

      getCompanyRequestById: build.query({
        query: (requestId) => ({
          url: `/request/${requestId}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, id) => [{ type: 'companyRequest', id }]
      }),

      answerCompanySubmitRequest: build.mutation({
        query: ({ companyId, requestId, answerData }) => ({
          url: `/request/${requestId}/company/${companyId}`,
          method: 'POST',
          data: answerData
        }),
        invalidatesTags: ['companyRequests', 'companyRequest']
      }),

      answerCompanyRevisionRequest: build.mutation({
        query: ({ companyId, requestId, answerData }) => ({
          url: `/company/${companyId}/revision/${requestId}`,
          method: 'PUT',
          data: answerData
        }),
        invalidatesTags: ['companyRequests', 'companyRequest']
      }),

      // Get categories for filter dropdown
      getCategories: build.query({
        query: () => ({
          url: '/category',
          method: 'GET'
        }),
        transformResponse: (response) => response?.data || []
      }),

      // Get request workflow history
      getRequestWorkflow: build.query({
        query: (requestId) => ({
          url: `/request/${requestId}/workflow`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data || []
      }),

      // Add employee comment to a request
      addRequestComment: build.mutation({
        query: ({ requestId, comment }) => ({
          url: `/request/${requestId}/comment`,
          method: 'POST',
          data: { comment }
        }),
        invalidatesTags: (result, error, { requestId }) => [
          { type: 'companyRequest', id: requestId },
          'companyRequests'
        ]
      }),

      // Get company details
      getCompanyDetails: build.query({
        query: (companyId) => ({
          url: `/company/${companyId}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data
      }),
      // Archive-related endpoints
      getCompanyArchives: build.query({
        query: (companyId) => ({
          url: `/archives/entity/Company/${companyId}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['companyArchives']
      }),
      
      getArchiveById: build.query({
        query: (archiveId) => ({
          url: `/archives/${archiveId}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data
      }),
      
      compareArchives: build.query({
        query: ({ archiveId1, archiveId2 }) => ({
          url: `/archives/compare?archiveId1=${archiveId1}&archiveId2=${archiveId2}`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data
      }),
      
      createArchiveTask: build.mutation({
        query: (taskData) => ({
          url: `/archive-tasks`,
          method: 'POST',
          data: taskData
        }),
        invalidatesTags: ['companyArchives']
      }),
      
      rollbackToArchive: build.mutation({
        query: ({ archiveId, reason }) => ({
          url: `/archives/rollback/${archiveId}`,
          method: 'POST',
          params: { reason }
        }),
        invalidatesTags: ['companyArchives', 'foodCompanyDetails']
      }),
      
      getArchiveTypes: build.query({
        query: () => ({
          url: `/archives/types`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['archiveTypes']
      }),
      
      getCompanyVersionHistory: build.query({
        query: (companyId) => ({
          url: `/company/${companyId}/version`,
          method: 'GET'
        }),
        transformResponse: (response) => response?.data,
        providesTags: ['companyArchives']
      }),
      
      restoreCompanyVersion: build.mutation({
        query: ({ companyId, versionId }) => ({
          url: `/company/${companyId}/version/${versionId}/restore`,
          method: 'POST'
        }),
        invalidatesTags: ['companyArchives', 'foodCompanyDetails']
      })
    }),
    overrideExisting: false
  });

export default FoodIndustryBankApi;
export const {
  useGetCompanyGalleryFilesQuery,
  useUploadGalleryFilesMutation,
  useUpdateGalleryFileMetadataMutation,
  useDeleteGalleryFileMutation,
  useSaveCompanyGalleryFilesMutation,
  useGetAllFoodIndustryCompaniesQuery,
  useGetAllFoodIndustryCompanyRequestsQuery,
  useGetFoodIndustryCompanyDetailsQuery,
  useGetCompanyArchivesQuery,
  useGetArchiveByIdQuery,
  useCompareArchivesQuery,
  useCreateArchiveTaskMutation,
  useRollbackToArchiveMutation,
  useGetArchiveTypesQuery,
  useGetCompanyVersionHistoryQuery,
  useRestoreCompanyVersionMutation,
  useGetEmployeeCommentsByEntityQuery,
  useGetEmployeeCommentByIdQuery,
  useAddEmployeeCommentMutation,
  useUpdateEmployeeCommentMutation,
  useDeleteEmployeeCommentMutation,
  useGetCompanyRequestsQuery,
  useGetCompanyRequestByIdQuery,
  useAnswerCompanySubmitRequestMutation,
  useAnswerCompanyRevisionRequestMutation,
  useGetCategoriesQuery,
  useGetRequestWorkflowQuery,
  useAddRequestCommentMutation,
  useGetCompanyDetailsQuery
} = FoodIndustryBankApi;