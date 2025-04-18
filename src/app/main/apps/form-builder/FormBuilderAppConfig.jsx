import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const FormBuilderAppOutlet = lazy(() => import('./FormBuilderAppOutlet.jsx'));
const FormBuilderApp = lazy(() => import('./FormBuilderApp.jsx'));

/**
 * The FormBuilder app config.
 */
const FormBuilderAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/form-builder',
			element: <FormBuilderAppOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/form-builder/run" />
				},
				{
					path: 'run/*',
					element: <FormBuilderApp />
				}
			]
		}
	]
};
export default FormBuilderAppConfig;
