import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const WhiteboardOutlet = lazy(() => import('./WhiteboardOutlet.jsx'));
const WhiteboardApp = lazy(() => import('./WhiteboardApp.jsx'));
/**
 * The Whiteboard app config.
 */
const WhiteboardAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/whiteboard',
			element: <WhiteboardOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/whiteboard/run" />
				},
				{
					path: 'run/*',
					element: <WhiteboardApp />
				}
			]
		}
	]
};
export default WhiteboardAppConfig;
