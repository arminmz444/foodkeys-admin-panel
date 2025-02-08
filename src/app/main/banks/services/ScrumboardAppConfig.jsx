import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ScrumboardApp = lazy(() => import('./ScrumboardApp.jsx'));
const Board = lazy(() => import('./board/Board.jsx'));
const Boards = lazy(() => import('@/app/main/banks/services/services/Boards.jsx'));
/**
 * The scrumboard app config.
 */
const ScrumboardAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/scrumboard',
			element: <ScrumboardApp />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/scrumboard/boards" />
				},
				{
					path: 'boards',
					element: <Boards />
				},
				{
					path: 'boards/:boardId',
					element: <Board />
				}
			]
		}
	]
};
export default ScrumboardAppConfig;
