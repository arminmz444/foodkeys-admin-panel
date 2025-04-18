import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const CreditManagerAppOutlet = lazy(() => import('./CreditManagerAppOutlet.jsx'));
const CreditManagerApp = lazy(() => import('./CreditManagerApp.jsx'));
/**
 * The CreditManager app config.
 */
const CreditManagerAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/credit-manager',
			element: <CreditManagerAppOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/credit-manager/run" />
				},
				{
					path: 'run/*',
					element: <CreditManagerApp />
				}
			]
		}
	]
};
export default CreditManagerAppConfig;
