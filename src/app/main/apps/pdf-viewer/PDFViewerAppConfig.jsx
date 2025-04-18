import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const PDFViewerOutlet = lazy(() => import('./PDFViewerOutlet.jsx'));
const PDFViewerApp = lazy(() => import('./PDFViewerApp.jsx'));
const PDFViewerAppV2 = lazy(() => import('./PDFViewerAppV2.jsx'));
/**
 * The PDFViewer app config.
 */
const PDFViewerAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/pdf-viewer',
			element: <PDFViewerOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/pdf-viewer/run" />
				},
				{
					path: 'v2/run/*',
					element: <PDFViewerAppV2 />
				},
				{
					path: 'run/*',
					element: <PDFViewerApp />
				}
			]
		}
	]
};
export default PDFViewerAppConfig;
