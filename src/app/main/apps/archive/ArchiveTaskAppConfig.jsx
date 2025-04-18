import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ArchiveTaskApp = lazy(() => import('./ArchiveTaskApp'));
const ArchiveTaskDetailsPage = lazy(() => import('./ArchiveTaskDetailsPage'));

const ArchiveTaskAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/archive-tasks',
      element: <ArchiveTaskApp />,
    },
    {
      path: 'apps/archive-tasks/:taskId',
      element: <ArchiveTaskDetailsPage />,
    },
    {
      path: 'apps/archive-tasks/entity/:entityType/:entityId',
      element: <ArchiveTaskApp />,
    },
    {
      path: '',
      element: <Navigate to="archive-tasks" />,
    },
  ],
};

export default ArchiveTaskAppConfig;