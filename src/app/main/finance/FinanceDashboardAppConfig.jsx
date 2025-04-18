import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ECommerceApp = lazy(() => import('./FinanceDashboardApp.jsx'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('@/app/main/finance/payments/Files'));
/**
 * The E-Commerce app configuration.
 */
const FinanceDashboardAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/e-commerce',
			element: <ECommerceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="products" />
				},
				{
					path: 'products',
					element: <Products />
				},
				{
					path: 'companies/:productId/*',
					element: <Product />
				},
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
export default FinanceDashboardAppConfig;
