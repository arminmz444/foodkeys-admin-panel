import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ServiceBank = lazy(() => import('./ServicesBank'));
const Product = lazy(() => import('./product/Product'));
const Services = lazy(() => import('./services/Services'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The Services Industry Bank configuration.
 */
const ServicesBankConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'banks/service',
			element: <ServiceBank />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <Services />
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
export default ServicesBankConfig;
