import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Categories from '@/app/main/category/Categories.jsx';


const CategoriesOutlet = lazy(() => import('./CategoriesOutlet.jsx'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The CategoriesOutlet configuration.
 */
const CategoriesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'categories',
			element: <CategoriesOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="categories" />
				},
				{
					path: 'categories/list',
					element: <Categories />
				},
				{
					path: 'categories/:categoryId/details',
					element: <CategoryDetails />
				},
				{
					path: 'categories/:categoryId/edit',
					element: <CategoryForm type="EDIT" />
				},
				{
					path: 'categories/:categoryId/add',
					element: <CategoryForm type="ADD" />
				}
			]
		}
	]
};
export default CategoriesConfig;
