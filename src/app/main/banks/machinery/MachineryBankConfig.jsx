import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MachineryIndustryBank = lazy(() => import('./MachineryIndustryBank.jsx'));
const Company = lazy(() => import('./product/Product'));
const Companies = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The Machinery Bank configuration.
 */
const MachineryBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/machinery',
			element: <MachineryIndustryBank />,
			children: [
				{
					path: '',
					element: <Navigate to="products" />
				},
				{
					path: 'companies',
					element: <Companies />
				},
				{
					path: 'companies/:productId/*',
					element: <Company />
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
export default MachineryBankConfig;
