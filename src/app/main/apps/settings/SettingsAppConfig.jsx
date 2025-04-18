import { lazy } from "react";
import { Navigate } from "react-router-dom";

const WebsiteConfigsPageTab = lazy(
	() => import("./tabs/website-configs/WebsiteConfigsPageTab")
);
const SubscriptionTab = lazy(() => import("./tabs/subscription/SubscriptionTab"));
const DiscountTab = lazy(() => import("./tabs/discount/DiscountTab"));
const BundleList = lazy(() => import("./tabs/bundles/BundleList"));
const BundlePageTab = lazy(() => import("./tabs/bundles/BundleTab"));

const ConfigSchemasTab = lazy(() => import("./tabs/website-configs/ConfigSchemasTab"));
const ConfigRecordsTab = lazy(() => import("./tabs/website-configs/ConfigRecordsTab"));
const ServiceSchemasTab = lazy(() => import("./tabs/website-configs/ServiceSchemasTab"));
const ServiceRecordsTab = lazy(() => import("./tabs/website-configs/ServiceRecordsTab"));
const ClientManagementTab = lazy(() => import("./tabs/website-configs/ClientManagementTab"));
const UserPanelConfigsPageTab = lazy(() => import("./tabs/user-panel-configs/UserPanelConfigsPageTab"))


// const WebsiteConfigSettings = lazy(
// 	() => import("./website-config-settings/WebsiteConfigSettings")
// );
const SettingsApp = lazy(() => import("./SettingsApp"));
const CustomSettingsApp = lazy(() => import("./CustomSettingsApp"));
const HomePageTab = lazy(() => import("./tabs/HomePageTab"));
const AboutUsPageTab = lazy(() => import("./tabs/AboutUsPageTab"));
const AccountTab = lazy(() => import("./tabs/AccountTab"));
const SecurityTab = lazy(() => import("./tabs/SecurityTab"));
const PlanBillingTab = lazy(() => import("./tabs/PlanBillingTab"));
const NotificationsTab = lazy(() => import("./tabs/NotificationsTab"));
const TeamTab = lazy(() => import("./tabs/TeamTab"));
/**
 * The Settings app config.
 */
const SettingsAppConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: "apps/settings",
			element: <SettingsApp />,
			children: [
				{
					path: "about-us-page",
					element: <AboutUsPageTab />,
				},
				{
					path: "homepage",
					element: <HomePageTab />,
				},
				{
					path: "website-configs",
					element: <WebsiteConfigsPageTab />,
				},
				{
					path: "user-panel-configs",
					element: <UserPanelConfigsPageTab />,
				},
				{
					path: "configs/schemas",
					element: <ConfigSchemasTab />,
				 },
				 {
					path: "configs/records",
					element: <ConfigRecordsTab />,
				 },
				 {
					path: "services/schemas",
					element: <ServiceSchemasTab />,
				 },
				 {
					path: "services/records",
					element: <ServiceRecordsTab />,
				 },
				 {
					path: "clients",
					element: <ClientManagementTab />,
				 },
				{
					path: "bundle",
					element: <BundlePageTab />,
				},
				{
					path: "subscription",
					element: <SubscriptionTab />,
				},
				{
					path: "discount",
					element: <DiscountTab />,
				},
				{
					path: "account",
					element: <AccountTab />,
				},
				{
					path: "security",
					element: <SecurityTab />,
				},
				{
					path: "plan-billing",
					element: <PlanBillingTab />,
				},
				{
					path: "security",
					element: <SecurityTab />,
				},
				{
					path: "notifications",
					element: <NotificationsTab />,
				},
				{
					path: "team",
					element: <TeamTab />,
				},
				{
					path: "",
					element: <Navigate to="account" />,
				},
			],
		},
		{
			path: "apps/settings/bundle",
			element: <CustomSettingsApp />,
			children: [
				{
					path: ":subCategoryId/*",
					element: <BundleList />,
				},
			],
		},
	],
};
export default SettingsAppConfig;
