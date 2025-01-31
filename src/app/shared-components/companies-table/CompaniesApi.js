import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['Companies'];

const CompaniesApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCompanies: build.query({
				query: ({ pageNumber = 1, pageSize = 10, categoryId, search = '' }) => ({
					url: `/api/v1/company/`,
					params: { pageNumber, pageSize, categoryId, search },
					// headers: {
					// 	Authorization: `Bearer ${localStorage.getItem('accessToken')}`
					// }
				}),
				providesTags: ['Companies']
			})
		}),
		overrideExisting: false
	});

export default CompaniesApi;
export const { useGetCompaniesQuery } = CompaniesApi;
