import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const UserApp = lazy(() => import('./UserApp.jsx'));
const UserList = lazy(() => import('./UserList.jsx'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The Users app configuration.
 */
const UserAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/users',
			element: <UserApp />,
			children: [
				{
					path: '',
					element: <Navigate to="userList" />
				},
				{
					path: 'list',
					element: <UserList />
				},
				{
					path: 'products/:productId/*',
					element: <Product />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				{
					path: 'orders/:orderId',
					element: <Order />
				}
			]
		}
	]
};
export default UserAppConfig;
