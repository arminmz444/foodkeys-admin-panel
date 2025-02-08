import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Company = lazy(() => import('./company/Company'));
const RequestsList = lazy(() => import('./requests/RequestsList'));
const Companies = lazy(() => import('./companies/Companies'));
const AgricultureIndustryBank = lazy(() => import('./AgricultureIndustryBank'));
/**
 * The Agriculture Industry Bank configuration.
 */
const AgricultureIndustryBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/agriculture-industry/',
			element: <AgricultureIndustryBank />,
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
					path: 'requests/*',
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
export default AgricultureIndustryBankConfig;
