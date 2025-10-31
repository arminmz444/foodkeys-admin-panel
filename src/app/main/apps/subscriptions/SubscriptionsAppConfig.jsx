import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const SubscriptionsApp = lazy(() => import('./SubscriptionsApp'));

const SubscriptionsAppConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: 'apps/subscriptions',
			element: <SubscriptionsApp />,
		},
		{
			path: '',
			element: <Navigate to="subscriptions" />,
		},
	],
};

export default SubscriptionsAppConfig;

