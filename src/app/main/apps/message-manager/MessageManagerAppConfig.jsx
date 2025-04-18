import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MessageManagerOutlet = lazy(() => import('./MessageManagerOutlet.jsx'));
const MessageManagerApp = lazy(() => import('./MessageManagerApp.jsx'));
/**
 * The Message Manager app config.
 */
const MessageManagerAppConfig = {
	settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: true,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
	routes: [
		{
			path: 'apps/message-manager',
			element: <MessageManagerOutlet />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/message-manager/run/" />
				},
				{
					path: 'run/*',
					element: <MessageManagerApp />
				}
			]
		}
	]
};
export default MessageManagerAppConfig;
