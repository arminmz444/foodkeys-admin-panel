import { lazy } from 'react';
import UserView from './user/UserView.jsx';
import UserForm from './user/UserForm.jsx';

const UserApp = lazy(() => import('./UserApp.jsx'));

/**
 * The Users app configuration.
 */
const UserAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/users',
			element: <UserApp />,
			children: [
				{
					path: ':id',
					element: <UserView />
				},
				{
					path: ':id/edit',
					element: <UserForm />
				}
			]
		}
	]
};
export default UserAppConfig;
