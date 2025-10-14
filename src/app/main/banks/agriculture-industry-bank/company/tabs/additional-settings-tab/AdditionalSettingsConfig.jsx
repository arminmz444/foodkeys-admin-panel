import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const AdditionalSettingsPageLayout = lazy(() => import('./AdditionalSettingsPageLayout'));
/**
 * More Settings Config
 */
const AdditionalSettingsConfig = {
	routes: [
		// {
		// 	path: 'additional-settings',
		// 	element: <Navigate to="/additional-settings" />
		// },
		// {
		// 	path: 'additional-settings/mock-api',
		// 	element: <MockApiDoc />
		// },
		{
			path: 'additional-settings',
			element: <AdditionalSettingsPageLayout />,
		}
	]
};
export default AdditionalSettingsConfig;
