import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Bundles = lazy(() => import('./Bundles.jsx'));
const BundlesOutlet = lazy(() => import('./BundlesOutlet'));
const Subscriptions = lazy(() => import('./subscriptions/Subscriptions'));
/**
 * The BundlesOutlet configuration.
 */
const BundlesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'bundle/',
			element: <BundlesOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <Bundles />
				},
				{
					path: 'subscription',
					element: <Navigate to="subscription/list" />
				},
				{
					path: 'subscription/list',
					element: <Subscriptions />
				}
				// {
				// 	path: ':bundleId/details',
				// 	element: <CategoryDetails />
				// },
				// {
				// 	path: ':bundleId/edit',
				// 	element: <CategoryForm type="EDIT" />
				// },
				// {
				// 	path: ':categoryId/add',
				// 	element: <CategoryForm type="ADD" />
				// }
			]
		}
	]
};
export default BundlesConfig;
