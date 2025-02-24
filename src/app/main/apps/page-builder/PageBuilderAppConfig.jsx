import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const PageBuilderApp = lazy(() => import('./PageBuilderApp.jsx'));
const PageBuilderAppOutlet = lazy(() => import('./PageBuilderAppOutlet.jsx'));
/**
 * The PageBuilder app config.
 */
const PageBuilderAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/page-builder',
			element: <PageBuilderAppOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/page-builder/run" />
				},
				{
					path: 'run/*',
					element: <PageBuilderApp />
				}
			]
		}
	]
};
export default PageBuilderAppConfig;
