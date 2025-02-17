import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const EPubApp = lazy(() => import('./EPubApp.jsx'));
const EPubOutlet = lazy(() => import('./EPubOutlet.jsx'));
/**
 * The EPub app config.
 */
const EPubAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/epub',
			element: <EPubOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/epub/run" />
				},
				{
					path: 'run/*',
					element: <EPubApp />
				}
			]
		}
	]
};
export default EPubAppConfig;
