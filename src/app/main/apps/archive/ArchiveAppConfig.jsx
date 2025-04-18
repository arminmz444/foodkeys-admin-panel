import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ArchiveApp = lazy(() => import('./ArchiveApp'));
const ArchiveDetailsPage = lazy(() => import('./ArchiveDetailsPage'));

const ArchiveAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/archive',
      element: <ArchiveApp />,
    },
    {
      path: 'apps/archive/:archiveId',
      element: <ArchiveDetailsPage />,
    },
    {
      path: 'apps/archive/entity/:entityType/:entityId',
      element: <ArchiveApp />,
    },
    {
      path: '',
      element: <Navigate to="archive" />,
    },
  ],
};

export default ArchiveAppConfig;