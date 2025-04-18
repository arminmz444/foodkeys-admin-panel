import MiniAppRoutes, { getMiniAppRoutes } from './MiniAppRoutes';

// Your existing routes
const MainAppConfig = {
    settings: {
		layout: {
			config: {}
		}
	},
  routes: [
    {
      path: 'miniapps',
      children: [
        {
          path: ':miniappId',
          element: <MiniAppRoutes />
        }
      ]
    },
    
    {
      path: 'banks/food-industry-bank/company/:companyId/miniapps',
      children: [
        {
          path: ':miniappId?',
          element: <MiniAppRoutes />
        }
      ]
    }
  ]
};

export const updateMiniAppRoutes = () => {
  const miniAppRoutes = getMiniAppRoutes();
  
  const routesConfig = MainAppConfig.routes;
  
  const miniappsRouteIndex = routesConfig.findIndex(route => route.path === 'miniapps');
  if (miniappsRouteIndex !== -1) {
    routesConfig[miniappsRouteIndex].children = [
      {
        path: ':miniappId',
        element: <MiniAppRoutes />
      },
      ...miniAppRoutes.map(route => ({
        path: route.path,
        element: route.element
      }))
    ];
  }
  
  return [...routesConfig];
};

export default MainAppConfig;