// src/app/services/ServiceApi.js
import { apiService as api } from "app/store/apiService.js";

const addTagTypes = ["service"];

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
            type: "service",
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
        providesTags: [{ type: "service", id: "SERVICE_ALL_SUBCATEGORIES" }],
      }),
      getServices: build.query({
        query: ({ pageNumber = 0, pageSize = 10 }) => ({
          url: "/service",
          transformResponse: (response) => response?.data,
          params: { pageNumber, pageSize },
        }),
        providesTags: [{ type: "service", id: "LIST" }],
      }),
      getServiceById: build.query({
        query: (serviceId) => ({
          url: `/service/${serviceId}`,
        }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, serviceId) => [
          { type: "service", id: serviceId },
        ],
      }),
      createService: build.mutation({
        query: (newService) => ({
          url: `/service`,
          method: "POST",
          data: newService,
        }),
        invalidatesTags: [{ type: "service", id: "LIST" }],
      }),
      updateService: build.mutation({
        query: ({ id, service }) => ({
          url: `/service/${id}`,
          method: "PUT",
          data: service,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "service", id }, {type: "service", id: "LIST"}],
      }),
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
        providesTags: ["serviceSchemas"],
      }),
      getSubcategoryOptions: build.query({
        query: () => `/subcategory/options`,
        providesTags: ["subcategoryOptions"],
      }),
    }),
    overrideExisting: false,
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
