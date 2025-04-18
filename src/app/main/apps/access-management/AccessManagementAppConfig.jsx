import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AccessManagementAppOutlet = lazy(
  () => import("./AccessManagementAppOutlet.jsx")
);
const AccessManagementApp = lazy(() => import("./AccessManagementApp.jsx"));
/**
 * The AccessManagementAppConfig app config.
 */
const AccessManagementAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/access-manager",
      element: <AccessManagementAppOutlet />,
      children: [
        {
          path: "",
          element: <Navigate to="/apps/access-manager/run" />,
        },
        {
          path: "run/*",
          element: <AccessManagementApp />,
        },
      ],
    },
  ],
};
export default AccessManagementAppConfig;
