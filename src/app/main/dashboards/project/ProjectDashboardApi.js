import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['dashboard_widgets'];
const ProjectDashboardApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getDashboardWidgets: build.query({
				query: (params) => ({ 
					url: `/dashboard/widgets`,
					params: params || {}
				}),
				providesTags: ['dashboard_widgets'],
				transformResponse: (response) => {
					// Transform the API response to get the data
					return response?.data || response;
				}
			})
		}),
		overrideExisting: false
	});
export default ProjectDashboardApi;
export const { useGetDashboardWidgetsQuery } = ProjectDashboardApi;
export const selectDashboardWidgets = createSelector(
	ProjectDashboardApi.endpoints.getDashboardWidgets.select(),
	(results) => results.data
);
