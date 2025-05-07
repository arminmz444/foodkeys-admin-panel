import { apiService as api } from 'app/store/apiService';

// Tag types for bundle
const addTagTypes = ['FileServiceTypes'];

const FileServiceTypeEntityApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
	endpoints: (builder) => ({
		getFileServiceTypes: builder.query({
      query: () => ({
        url: '/file-service-type',
        method: 'GET',
		
      }),
	  transformResponse: (response) => {
		return response.data;
	},
      providesTags: ['FileServiceTypes'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(
            showMessage({
              message: 'خطا در دریافت انواع فایل سرویس',
              variant: 'error',
            })
          );
        }
      },
    }),
    
    getFileServiceTypeByName: builder.query({
      query: (name) => ({
        url: `/file-service-type/${name}`,
        method: 'GET',
      }),
      providesTags: (result, error, name) => [{ type: 'FileServiceTypes', id: name }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(
            showMessage({
              message: 'خطا در دریافت نوع فایل سرویس',
              variant: 'error',
            })
          );
        }
      },
    }),
    
    createFileServiceType: builder.mutation({
      query: (fileServiceType) => ({
        url: '/file-service-type',
        method: 'POST',
        data: fileServiceType,
      }),
      invalidatesTags: ['FileServiceTypes'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            showMessage({
              message: 'نوع فایل سرویس با موفقیت ایجاد شد',
              variant: 'success',
            })
          );
        } catch (error) {
          dispatch(
            showMessage({
              message: 'خطا در ایجاد نوع فایل سرویس',
              variant: 'error',
            })
          );
        }
      },
    }),
    
    updateFileServiceType: builder.mutation({
      query: (fileServiceType) => ({
        url: `/file-service-type/${fileServiceType.name}`,
        method: 'PUT',
        data: fileServiceType,
      }),
      invalidatesTags: (result, error, { name }) => [
        'FileServiceTypes',
        { type: 'FileServiceTypes', id: name },
      ],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            showMessage({
              message: 'نوع فایل سرویس با موفقیت بروزرسانی شد',
              variant: 'success',
            })
          );
        } catch (error) {
          dispatch(
            showMessage({
              message: 'خطا در بروزرسانی نوع فایل سرویس',
              variant: 'error',
            })
          );
        }
      },
    }),
    
    deleteFileServiceType: builder.mutation({
      query: (name) => ({
        url: `/file-service-type/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FileServiceTypes'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            showMessage({
              message: 'نوع فایل سرویس با موفقیت حذف شد',
              variant: 'success',
            })
          );
        } catch (error) {
          dispatch(
            showMessage({
              message: 'خطا در حذف نوع فایل سرویس',
              variant: 'error',
            })
          );
        }
      },
    }),
  }),
  overrideExisting: false,
});

export default FileServiceTypeEntityApi;

export const {
	useGetFileServiceTypesQuery,
	useGetFileServiceTypeByNameQuery,
	useCreateFileServiceTypeMutation,
	useUpdateFileServiceTypeMutation,
	useDeleteFileServiceTypeMutation,
} = FileServiceTypeEntityApi;
