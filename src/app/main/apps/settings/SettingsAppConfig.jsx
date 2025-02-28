import { lazy } from "react";
import { Navigate } from "react-router-dom";
import BundlePageTab from "./tabs/bundles/BundleTab";
import BundleList from "./tabs/bundles/BundleList";
import DiscountTab from "./tabs/discount/DiscountTab";
import SubscriptionTab from "./tabs/subscription/SubscriptionTab";

const WebsiteConfigSettings = lazy(
	() => import("./website-config-settings/WebsiteConfigSettings")
);
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
					path: "bundle-setting",
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
					path: "website-config",
					element: <WebsiteConfigSettings />,
				},
				{
					path: "",
					element: <Navigate to="account" />,
				},
			],
		},
		{
			path: "apps/settings/bundle-setting",
			element: <CustomSettingsApp />,
			children: [
				{
					path: ":bankId/*",
					element: <BundleList />,
				},
			],
		},
	],
};
export default SettingsAppConfig;
