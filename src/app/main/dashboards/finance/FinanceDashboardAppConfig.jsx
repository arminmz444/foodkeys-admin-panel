// import { lazy } from 'react';
// import Invoice from './components/Invoice';

// const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));
// /**
//  * The finance dashboard app config.
//  */
// const FinanceDashboardAppConfig = {
// 	settings: {
// 		layout: {
// 			config: {}
// 		}
// 	},
// 	routes: [
// 		{
// 			path: 'dashboards/finance',
// 			element: <FinanceDashboardApp />
// 		},
// 		{
// 			path: 'dashboards/finance/invoice/:invoiceId',
// 			element: <Invoice />
// 		}
// 	]
// };
// export default FinanceDashboardAppConfig;

// src/app/main/dashboards/finance/FinanceDashboardAppConfig.jsx
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Invoice from './components/Invoice';
import { TransactionsTable, PaymentsTable } from './components';

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
      path: 'dashboards/finance/transactions',
      element: <TransactionsTable />
    },
    {
      path: 'dashboards/finance/payments',
      element: <PaymentsTable />
    },
    {
      path: 'dashboards/finance/invoice/:invoiceId',
      element: <Invoice />
    },
    {
      path: 'dashboards/finance',
      element: <Navigate to="/dashboards/finance" />
    }
  ]
};

export default FinanceDashboardAppConfig;