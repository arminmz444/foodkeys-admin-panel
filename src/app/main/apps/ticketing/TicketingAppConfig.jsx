import { lazy } from 'react';
import Chat from './chat/TicketChat';
import TicketingFirstScreen from './TicketingFirstScreen.jsx';

const TicketingApp = lazy(() => import('./TicketingApp.jsx'));
/**
 * The ticketing app config.
 */
const TicketingAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/ticketing',
			element: <TicketingApp />,
			children: [
				{
					path: '',
					element: <TicketingFirstScreen />
				},
				{
					path: ':id',
					element: <Chat />
				}
			]
		}
	]
};
export default TicketingAppConfig;
