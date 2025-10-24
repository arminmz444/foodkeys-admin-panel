import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import CreateServiceSchemaForm from '@/app/main/banks/services/service-schemas/CreateServiceSchemaForm.jsx';
import ServiceRequestsPage from './requests/ServiceRequestsPage';

const ServiceBank = lazy(() => import('./ServicesBank'));
// const Product = lazy(() => import('./product/Product'));
const Services = lazy(() => import('./services/Services'));
const ServiceSubCategories = lazy(() => import('./subcategories/SubCategories'));
const ServiceSchemaCreator = lazy(() => import('./subcategories/ServiceSchemaCreator'));

const ServiceDetails = lazy(() => import('./services/ServiceDetails'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
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
					path: ':id/details',
					element: <ServiceDetails />,
				},
				{
					path: '',
					element: <Services />
				},
				{
                    path: 'subcategory',
                    element: <ServiceSubCategories />
                },
                {
                    path: 'subcategory/:id/schema',
                    element: <ServiceSchemaCreator />
                },
				{
					path: 'schema',
					element: <CreateServiceSchemaForm />
				},
				{
					path: 'requests',
					element: <ServiceRequestsPage />
				}
			]
		}
	]
};
export default ServicesBankConfig;
