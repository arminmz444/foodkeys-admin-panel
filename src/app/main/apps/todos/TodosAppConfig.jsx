import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const TodosAppOutlet = lazy(() => import('./TodosAppOutlet.jsx'));
const TodosApp = lazy(() => import('./TodosApp.jsx'));
/**
 * The Todos app config.
 */
const TodosAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/todos',
			element: <TodosAppOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/todos/run" />
				},
				{
					path: 'run/*',
					element: <TodosApp />
				}
			]
		}
	]
};
export default TodosAppConfig;
