import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Categories = lazy(() => import('./Categories'));
const CategoryDetails = lazy(() => import('./CategoryDetails'));
const CategoryForm = lazy(() => import('./CategoryForm'));
const CategoriesOutlet = lazy(() => import('./CategoriesOutlet'));
const SubCategories = lazy(() => import('./sub-category/SubCategories'));
/**
 * The CategoriesOutlet configuration.
 */
const CategoriesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'category/',
			element: <CategoriesOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <Categories />
				},
				{
					path: 'subcategory/',
					element: <Navigate to="subcategory/list" />
				},
				{
					path: 'subcategory/list',
					element: <SubCategories />
				},
				{
					path: ':categoryId/details',
					element: <CategoryDetails />
				},
				{
					path: ':categoryId/edit',
					element: <CategoryForm type="EDIT" />
				},
				{
					path: ':categoryId/add',
					element: <CategoryForm type="ADD" />
				}
			]
		}
	]
};
export default CategoriesConfig;
