import { lazy } from 'react';
import Invoice from './components/Invoice';

const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));
/**
 * The finance dashboard app config.
 */
const FinanceDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboards/finance',
			element: <FinanceDashboardApp />
		},
		{
			path: 'dashboards/finance/invoice/:invoiceId',
			element: <Invoice />
		}
	]
};
export default FinanceDashboardAppConfig;
