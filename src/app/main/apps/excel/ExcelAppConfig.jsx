import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ExcelOutlet from '@/app/main/apps/excel/ExcelOutlet.jsx';

const ExcelApp = lazy(() => import('./ExcelApp.jsx'));
/**
 * The Excel app config.
 */
const ExcelAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/excel',
			element: <ExcelOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/excel/run" />
				},
				{
					path: 'run/*',
					element: <ExcelApp />
				}
			]
		}
	]
};
export default ExcelAppConfig;
