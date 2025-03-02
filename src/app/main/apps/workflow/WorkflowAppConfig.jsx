import { lazy } from "react";
import { Navigate } from "react-router-dom";

const WorkflowOutlet = lazy(() => import("./WorkflowOutlet.jsx"));
const WorkflowApp = lazy(() => import("./WorkflowApp.jsx"));
/**
 * The Workflow app config.
 */
const WorkflowAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/workflows",
      element: <WorkflowOutlet />,
      children: [
        {
          path: "",
          element: <Navigate to="/apps/workflows/run" />,
        },
        {
          path: "run/*",
          element: <WorkflowApp />,
        },
      ],
    },
  ],
};
export default WorkflowAppConfig;
