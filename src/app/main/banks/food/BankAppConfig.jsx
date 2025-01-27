import { lazy } from "react";
import { Navigate } from "react-router-dom";
import BankApp from "./BankApp";

// const Product = lazy(() => import("./new/CreateCompany"));
const CreateCompany = lazy(() => import("./new/CreateCompany"));
// const Order = lazy(() => import("./order/Order"));
// const Orders = lazy(() => import("./orders/Orders"));
/**
 * The E-Commerce app configuration.
 */
const category = "food";

const BankAppConfig = {
	settings: {
		layout: {},
	},
	routes: [
		{
			path: `banks/${category}`,
			element: <BankApp />,
			children: [
				{
					path: "",
					element: <Navigate to="products" />,
				},
				{
					path: "createCompany",
					element: <CreateCompany />,
				},
				{
					path: "products/:productId/*",
					element: <CreateCompany />,
				},
				// {
				// 	path: "orders",
				// 	element: <Orders />,
				// },
				// {
				// 	path: "orders/:orderId",
				// 	element: <Order />,
				// },
			],
		},
	],
};
export default BankAppConfig;
