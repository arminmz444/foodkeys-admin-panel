// src/app/template/excel/store/ExcelTemplateApi.js
import { apiService as api } from 'app/store/apiService';

export const addTagTypes = [
  'excel_templates',
  'excel_template',
  'generated_excel'
];

const ExcelTemplateApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getExcelTemplates: build.query({
        query: () => ({ url: `/template/excel` }),
        providesTags: ['excel_templates']
      }),
      
      getExcelTemplate: build.query({
        query: (templateId) => ({ url: `/template/excel/${templateId}` }),
        providesTags: (result, error, templateId) => [{ type: 'excel_template', id: templateId }]
      }),
      
      uploadExcelTemplate: build.mutation({
        query: (formData) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.file);
          uploadFormData.append('name', formData.data.name);
          uploadFormData.append('description', formData.data.description);
          
          return {
            url: `/template/excel`,
            method: 'POST',
            data: uploadFormData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };
        },
        invalidatesTags: ['excel_templates']
      }),
      
      updateExcelTemplate: build.mutation({
        query: (queryArg) => ({
          url: `/template/excel/${queryArg.id}`,
          method: 'PUT',
          data: queryArg.data
        }),
        invalidatesTags: (result, error, { id }) => [
          'excel_templates', 
          { type: 'excel_template', id }
        ]
      }),
      
      deleteExcelTemplate: build.mutation({
        query: (templateId) => ({
          url: `/template/excel/${templateId}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, templateId) => [
          'excel_templates', 
          { type: 'excel_template', id: templateId }
        ]
      }),
      
      downloadExcelTemplate: build.query({
        query: (templateId) => ({
          url: `/template/excel/${templateId}/download`,
          responseHandler: async (response) => {
            const blob = await response.blob();
            return blob;
          },
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          cache: 'no-cache'
        }),
        // No tags since this is a download operation
      }),
      
      generateExcel: build.mutation({
        query: (queryArg) => ({
          url: `/template/excel/generate`,
          method: 'POST',
          body: queryArg,
          responseHandler: (response) => response.blob(),
        }),
        invalidatesTags: ['generated_excel']
      })
    }),
    overrideExisting: false
  });

export default ExcelTemplateApi;

export const {
  useGetExcelTemplatesQuery,
  useGetExcelTemplateQuery,
  useUploadExcelTemplateMutation,
  useUpdateExcelTemplateMutation,
  useDeleteExcelTemplateMutation,
  useLazyDownloadExcelTemplateQuery, // Lazy query for download (triggered on demand)
  useGenerateExcelMutation
} = ExcelTemplateApi;