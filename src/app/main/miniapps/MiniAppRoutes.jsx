import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import axios from 'axios';
import FuseLoading from '@fuse/core/FuseLoading';

// Create a MiniApp lazy loader
const createMiniAppLoader = (miniappId, companyId) => {
  const MiniAppPage = lazy(() => import('./MiniAppPage'));
  return (
    <Suspense fallback={<FuseLoading />}>
      <MiniAppPage miniappId={miniappId} companyId={companyId} />
    </Suspense>
  );
};

/**
 * MiniApp Routes Manager
 * Dynamically creates routes for MiniApps
 */
class MiniAppRoutesManager {
  constructor() {
    this.routes = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Fetch all published MiniApps
      const response = await axios.get('/api/miniapps?status=published');
      
      if (response.status === 200 && response.data) {
        // Create routes for each MiniApp
        response.data.forEach(miniapp => {
          if (miniapp.routePath && miniapp.clientType === 'ADMIN_PANEL_CLIENT') {
            this.addMiniAppRoute(miniapp);
          }
        });
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize MiniApp routes:', error);
    }
  }

  addMiniAppRoute(miniapp) {
    // Remove leading slash if present
    const path = miniapp.routePath.startsWith('/') 
      ? miniapp.routePath.substring(1) 
      : miniapp.routePath;
    
    // Create a route configuration
    const route = {
      path,
      element: createMiniAppLoader(miniapp.id, miniapp.targetCompanyId),
      meta: {
        miniappId: miniapp.id,
        name: miniapp.name,
        companyId: miniapp.targetCompanyId
      }
    };
    
    // Add to routes array
    this.routes.push(route);
    
    return route;
  }

  getRoutes() {
    return this.routes;
  }

  registerMiniApp(miniappData) {
    return this.addMiniAppRoute(miniappData);
  }

  unregisterMiniApp(miniappId) {
    const index = this.routes.findIndex(route => route.meta?.miniappId === miniappId);
    if (index !== -1) {
      const removed = this.routes.splice(index, 1);
      return removed[0];
    }
    return null;
  }
}

// Create singleton instance
const miniAppRoutesManager = new MiniAppRoutesManager();

// Expose API for managing routes
export const registerMiniApp = (miniappData) => miniAppRoutesManager.registerMiniApp(miniappData);
export const unregisterMiniApp = (miniappId) => miniAppRoutesManager.unregisterMiniApp(miniappId);
export const getMiniAppRoutes = () => miniAppRoutesManager.getRoutes();

// Initialize routes on load
miniAppRoutesManager.initialize();

/**
 * MiniAppRoutes component
 * Dynamically renders routes for MiniApps
 */
function MiniAppRoutes() {
  const routes = useRoutes([
    ...getMiniAppRoutes(),
    { path: '*', element: <Navigate to="/404" /> }
  ]);
  
  return routes;
}

export default MiniAppRoutes;