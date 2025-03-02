import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MessageManagerOutlet = lazy(() => import('./MessageManagerOutlet.jsx'));
const MessageManagerApp = lazy(() => import('./MessageManagerApp.jsx'));
/**
 * The Excel app config.
 */
const ExcelAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/message-manager',
			element: <MessageManagerOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/message-manager/run" />
				},
				{
					path: 'run/*',
					element: <MessageManagerApp />
				}
			]
		}
	]
};
export default ExcelAppConfig;
