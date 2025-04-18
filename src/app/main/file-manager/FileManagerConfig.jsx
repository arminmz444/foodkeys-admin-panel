import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Files = lazy(() => import('./files/Files.jsx'));
/**
 * The file-manager configuration.
 */
const FileManagerConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'file-manager/files',
			element: <Files />,
			children: [
				{
					path: '',
					element: <Navigate to="files" />
				},
				{
					path: 'files',
					element: <Files />
				}
			]
		}
	]
};
export default FileManagerConfig;
