import { lazy } from "react";
import { Navigate } from "react-router-dom";

const WorkflowBuilderOutlet = lazy(() => import("./WorkflowBuilderOutlet.jsx"));
const WorkflowBuilderApp = lazy(() => import("./WorkflowBuilderApp.jsx"));
const EnhancedWorkflowBuilderApp = lazy(() => import("../workflow/EnhancedWorkflowApp.jsx"));
/**
 * The Excel app config.
 */
const WorkflowBuilderAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/workflow-builder",
      element: <WorkflowBuilderOutlet />,
      children: [
        {
          path: "",
          element: <Navigate to="/apps/workflow-builder/run" />,
        },
        {
          path: "run/*",
          element: <WorkflowBuilderApp />,
        },
      ],
    },
  ],
};
export default WorkflowBuilderAppConfig;
