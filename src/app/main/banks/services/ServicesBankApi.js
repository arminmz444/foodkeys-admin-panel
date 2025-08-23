// src/app/services/ServiceApi.js
import { apiService as api } from "app/store/apiService.js";

const addTagTypes = ["Services", "ServiceSchemas"];

export const serviceApi = api
  .enhanceEndpoints({ addTagTypes })
  .injectEndpoints({
    endpoints: (build) => ({
      getServicesSubCategoriesByCategoryId: build.query({
        query: ({ pageNumber = 0, pageSize = 10 }) => ({
          url: "/service/subcategory",
          transformResponse: (response) => response?.data,
          params: { pageNumber, pageSize },
        }),
        providesTags: [
          {
            type: "Services",
            id: "SERVICE_SUBCATEGORIES_BY_CATEGORY_ID_" + "4",
          },
        ],
      }),
      getServicesSubCategories: build.query({
        query: ({ pageNumber = 0, pageSize = 10 }) => ({
          url: "/service/subcategory",
          transformResponse: (response) => response?.data,
          params: { pageNumber, pageSize },
        }),
        providesTags: [{ type: "Services", id: "SERVICE_ALL_SUBCATEGORIES" }],
      }),
      getServices: build.query({
        query: ({ pageNumber = 0, pageSize = 10 }) => ({
          url: "/service",
          transformResponse: (response) => response?.data,
          params: { pageNumber, pageSize },
        }),
        providesTags: [{ type: "Services", id: "LIST" }],
      }),
      getServiceById: build.query({
        query: (serviceId) => ({
          url: `/service/${serviceId}`,
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, serviceId) => [
          { type: "Services", id: serviceId },
        ],
      }),
      // createService: build.mutation({
      //   query: (newService) => ({
      //     url: `/service`,
      //     method: "POST",
      //     data: newService,
      //   }),
      //   invalidatesTags: [{ type: "service", id: "LIST" }],
      // }),
      // updateService: build.mutation({
      //   query: ({ id, service }) => ({
      //     url: `/service/${id}`,
      //     method: "PUT",
      //     data: service,
      //   }),
      //   invalidatesTags: (result, error, { id }) => [{ type: "service", id }, {type: "service", id: "LIST"}],
      // }),
      deleteService: build.mutation({
        query: (id) => ({
          url: `/service/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "service", id }, {type: "service", id: "LIST"}],
      }),
      getServiceSchemas: build.query({
        query: ({ pageSize, pageNumber }) =>
          `/service/schema?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        providesTags: ["ServiceSchemas"],
      }),
      getSubcategoryOptions: build.query({
        query: () => `/subcategory/options`,
        providesTags: ["subcategoryOptions"],
      }),
  
    // getServices: build.query({
    //   query: ({ page = 0, size = 10, categoryId = null, subCategoryId = null }) => {
    //     let queryParams = `?page=${page}&pageSize=${size}`;
    //     if (categoryId) queryParams += `&categoryId=${categoryId}`;
    //     if (subCategoryId) queryParams += `&subCategoryId=${subCategoryId}`;
    //     return `service${queryParams}`;
    //   },
    //   transformResponse: (response) => response.data,
    //   providesTags: ['Services']
    // }),
    
    // Get service by ID
    // getServiceById: build.query({
    //   query: (id) => `service/${id}`,
    //   transformResponse: (response) => response.data,
    //   providesTags: (result, error, id) => [{ type: 'Services', id }]
    // }),
    
    // Create new service
    createService: build.mutation({
      query: (newService) => ({
        url: 'service',
        method: 'POST',
        data: newService
      }),
      invalidatesTags: ['Services']
    }),
    
    // Update service
    updateService: build.mutation({
      query: ({ id, service }) => ({
        url: `service/${id}`,
        method: 'PUT',
        data: service
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Services', id }, 'Services']
    }),
    
    // // Delete service
    // deleteService: build.mutation({
    //   query: (id) => ({
    //     url: `service/${id}`,
    //     method: 'DELETE'
    //   }),
    //   invalidatesTags: ['Services']
    // }),
    
    // // Get subcategory options
    // getSubcategoryOptions: build.query({
    //   query: () => 'subcategory/options?categoryId=4&pageSize=100',
    //   transformResponse: (response) => response.data,
    //   providesTags: ['ServiceCategories']
    // }),
    
    // Get subcategory schema
    getSubcategorySchema: build.query({
      query: (subCategoryId) => `subcategory/${subCategoryId}/schema`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'ServiceSchemas', id }]
    }),
    
    // Publish service
    publishService: build.mutation({
      query: (serviceId) => ({
        url: `service/${serviceId}/publish/`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Services', id }, 'Services']
    }),
    overrideExisting: false,
  })
  });

export const {
  useGetServicesQuery,
  useGetServicesSubCategoriesByCategoryIdQuery,
  useGetServicesSubCategoriesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceSchemasQuery,
  useGetSubcategoryOptionsQuery,
} = serviceApi;
