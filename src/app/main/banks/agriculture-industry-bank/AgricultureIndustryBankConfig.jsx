import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

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
			path: 'banks/agriculture-industry',
			element: <AgricultureIndustryBank />,
			children: [
				{
					path: '',
					element: <Navigate to="companies" />
				},
				{
					path: 'companies',
					element: <Companies />
				}
			]
		}
	]
};
export default AgricultureIndustryBankConfig;
