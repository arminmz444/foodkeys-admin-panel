import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const UserApp = lazy(() => import('./UserApp.jsx'));
const UserList = lazy(() => import('./UserList.jsx'));
const Product = lazy(() => import('./product/Product.jsx'));
const Products = lazy(() => import('./products/Products.jsx'));
const Order = lazy(() => import('./order/Order.jsx'));
const Orders = lazy(() => import('./orders/Orders.jsx'));
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
					path: ':userId/details',
					element: <Product />
				},
				// {
				// 	path: '/',
				// 	element: <Product />
				// },
				{
					path: 'list',
					element: <Orders />
				},
				{
					path: 'payments/:orderId',
					element: <Order />
				}
			]
		}
	]
};
export default UserAppConfig;
