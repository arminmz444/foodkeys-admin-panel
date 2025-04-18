import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MediaBank = lazy(() => import('./MediaBank'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The Media Industry Bank configuration.
 */
const MediaBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/media',
			element: <MediaBank />,
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
export default MediaBankConfig;
