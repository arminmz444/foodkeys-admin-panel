import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const FoosIndustryBank = lazy(() => import('./FoodIndustryBank'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The Food Industry Bank configuration.
 */
const FoodIndustryBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/food-industry',
			element: <FoosIndustryBank />,
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
export default FoodIndustryBankConfig;
