import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const AnnouncementBuilderOutlet = lazy(() => import('./AnnouncementBuilderOutlet.jsx'));
const AnnouncementBuilderApp = lazy(() => import('./AnnouncementBuilderApp.jsx'));
/**
 * The AnnouncementBuilder app config.
 */
const AnnouncementBuilderAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: "apps/announcement-builder",
			element: <AnnouncementBuilderOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/announcement-builder/run" />
				},
				{
					path: 'run/*',
					element: <AnnouncementBuilderApp />
				}
			]
		}
	]
};
export default AnnouncementBuilderAppConfig;
