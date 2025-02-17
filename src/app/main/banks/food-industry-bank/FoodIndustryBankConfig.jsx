import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Company = lazy(() => import('./company/Company'));
const RequestsList = lazy(() => import('./requests/RequestsList'));
const Companies = lazy(() => import('./companies/Companies'));
const FoodIndustryBank = lazy(() => import('./FoodIndustryBank'));
/**
 * The Food Industry Bank configuration.
 */
const FoodIndustryBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/Food-industry/',
			element: <FoodIndustryBank />,
			children: [
				{
					path: '',
					element: <Navigate to="company/list" />
				},
				{
					path: 'company/',
					element: <Navigate to="company/list" />
				},
				{
					path: 'company/list',
					element: <Companies />
				},
				{
					path: 'company/:companyId/*',
					element: <Company />
				},
				{
					path: 'request/*',
					element: <RequestsList />
				}

				// {
				// 	path: 'company',
				// 	element: <CompaniesList />
				// },
				// {
				// 	path: 'company/:id/details',
				// 	element: <Company />
				// }
			]
		}
	]
};
export default FoodIndustryBankConfig;
