import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ActivityLogManagerAppOutlet = lazy(() => import('./ActivityLogManagerAppOutlet.jsx'));
const ActivityLogManagerApp = lazy(() => import('./ActivityLogManagerApp.jsx'));
/**
 * The ActivityLogManagerApp app config.
 */
const ActivityLogManagerAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/activity-log-manager',
			element: <ActivityLogManagerAppOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/activity-log-manager/run" />
				},
				{
					path: 'run/*',
					element: <ActivityLogManagerApp />
				}
			]
		}
	]
};
export default ActivityLogManagerAppConfig;
