// src/app/configs/ExcelTemplateAppConfig.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy-loaded components
const ExcelTemplateApp = lazy(() => import("./ExcelTemplateApp"));
const TemplateListTab = lazy(() => import("./tabs/TemplateListTab"));
const TemplateDetailsTab = lazy(() => import("./tabs/TemplateDetailsTab"));
const TemplateUploadTab = lazy(() => import("./tabs/TemplateUploadTab"));
const TemplateProcessorTab = lazy(() => import("./tabs/TemplateProcessorTab"));
const CustomExcelTemplateApp = lazy(() => import("./CustomExcelTemplateApp"));

/**
 * The Excel Template app config.
 */
const ExcelTemplateAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "apps/excel-templates",
      element: <ExcelTemplateApp />,
      children: [
        {
          path: "list",
          element: <TemplateListTab />,
        },
        {
          path: "upload",
          element: <TemplateUploadTab />,
        },
        {
          path: "details/:templateId",
          element: <TemplateDetailsTab />,
        },
        {
          path: "processor",
          element: <TemplateProcessorTab />,
        },
        {
          path: "",
          element: <Navigate to="list" />,
        },
      ],
    },
    {
      path: "apps/excel-templates/custom-view",
      element: <CustomExcelTemplateApp />,
      children: [
        {
          path: ":templateId/*",
          element: <TemplateDetailsTab />,
        },
      ],
    },
  ],
};

export default ExcelTemplateAppConfig;