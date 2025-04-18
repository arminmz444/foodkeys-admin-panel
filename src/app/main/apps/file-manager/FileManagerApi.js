// import { apiService as api } from 'app/store/apiService';
//
// export const addTagTypes = ['file_manager_folder'];
// const FileManagerApi = api
// 	.enhanceEndpoints({
// 		addTagTypes
// 	})
// 	.injectEndpoints({
// 		endpoints: (build) => ({
// 			getFileManagerFolder: build.query({
// 				query: (folderId) => ({ url: `/mock-api/file-manager/${folderId}` }),
// 				providesTags: ['file_manager_folder']
// 			}),
// 			updateFileManagerFolder: build.mutation({
// 				query: (queryArg) => ({
// 					url: `/mock-api/file-manager/${queryArg.folderId}`,
// 					method: 'PUT',
// 					body: queryArg.fileManagerItem
// 				}),
// 				invalidatesTags: ['file_manager_folder']
// 			}),
// 			deleteFileManagerFolder: build.mutation({
// 				query: (folderId) => ({
// 					url: `/mock-api/file-manager/${folderId}`,
// 					method: 'DELETE'
// 				}),
// 				invalidatesTags: ['file_manager_folder']
// 			})
// 		}),
// 		overrideExisting: false
// 	});
// export default FileManagerApi;
// export const { useGetFileManagerFolderQuery, useUpdateFileManagerFolderMutation, useDeleteFileManagerFolderMutation } =
// 	FileManagerApi;

import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['file_manager_folder'];

const FileManagerApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
	endpoints: (build) => ({
		// Fetch list of files and folders from API
		getFileManagerFolder: build.query({
			query: (folderId) => ({ url: `/file-system/09144226139/list`, params: {path: folderId} }),
			providesTags: ['file_manager_folder']
		}),

		// Update folder metadata
		updateFileManagerFolder: build.mutation({
			query: (queryArg) => ({
				url: `/file-system/${queryArg.folderId}`,
				method: 'PUT',
				body: queryArg.fileManagerItem
			}),
			invalidatesTags: ['file_manager_folder']
		}),

		// Delete folder
		deleteFileManagerFolder: build.mutation({
			query: (folderId) => ({
				url: `/file-system/${folderId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['file_manager_folder']
		})
	}),
	overrideExisting: false
});

export default FileManagerApi;
export const { useGetFileManagerFolderQuery, useUpdateFileManagerFolderMutation, useDeleteFileManagerFolderMutation } =
	FileManagerApi;
