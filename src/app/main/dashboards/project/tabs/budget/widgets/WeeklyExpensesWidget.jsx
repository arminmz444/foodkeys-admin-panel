import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import IconButton from "@mui/material/IconButton";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import { useGetProjectDashboardWidgetsQuery } from "../../../ProjectDashboardApi";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

/**
 * The MonthlyExpensesWidget widget.
 */
function WeeklyExpensesWidget() {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const widget = widgets?.weeklyExpenses;

	if (!widget) {
		return null;
	}

	const { amount, series, labels } = widget;
	const theme = useTheme();
	const chartOptions = {
		chart: {
			animations: {
				enabled: false,
			},
			fontFamily: "inherit",
			foreColor: "inherit",
			height: "100%",
			type: "line",
			sparkline: {
				enabled: true,
			},
		},
		colors: [theme.palette.secondary.main],
		stroke: {
			curve: "smooth",
		},
		tooltip: {
			theme: "dark",
		},
		xaxis: {
			type: "category",
			categories: labels,
		},
		yaxis: {
			labels: {
				formatter: (val) => `$${val}`,
			},
		},
	};
	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex items-start justify-between">
				<div className="text-lg font-medium tracking-tight leading-6 truncate">
					اشتراک ماهانه
				</div>
				<div className="ml-8 -mt-8 -mr-12">
					<IconButton
						aria-label="more"
						id="long-button"
						aria-controls={open ? "long-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-haspopup="true"
						onClick={handleClick}
					>
						<FuseSvgIcon size={20}>heroicons-solid:dots-vertical</FuseSvgIcon>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							<MenuItem onClick={handleClose}>ویرایش</MenuItem>
							<MenuItem onClick={handleClose}>حذف</MenuItem>
						</Menu>
					</IconButton>
				</div>
			</div>
			<div className="flex justify-between items-center mt-4">
				<div className="flex flex-col">
					<div className="text-6xl font-900 tracking-tight leading-tight">
						6,000,000 <span className="text-xl">تومان</span>
						{/* {amount.toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})} */}
					</div>
					{/* <div className="flex items-center">
						<Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
							<span> بانک تولیدکنندگان</span>
						</Typography>
					</div> */}
				</div>
				<div className="flex animate-pulse flex-col justify-center text-xl items-center px-20 ml-32 rounded-full bg-green-500 text-white py-5 font-600">
					فعال
					{/* <ReactApexChart
						className="flex-auto w-full h-64"
						options={chartOptions}
						series={_.cloneDeep(series)}
						type={chartOptions?.chart?.type}
						height={chartOptions?.chart?.height}
					/> */}
				</div>
			</div>
		</Paper>
		// <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
		//   <div className="flex items-start justify-between">
		//     <div className="text-lg font-medium tracking-tight leading-6 truncate">
		//       Weekly Expenses
		//     </div>
		//     <div className="ml-8 -mt-8 -mr-12">
		//       <IconButton>
		//         <FuseSvgIcon size={20}>heroicons-solid:dots-vertical</FuseSvgIcon>
		//       </IconButton>
		//     </div>
		//   </div>
		//   <div className="flex items-center mt-4">
		//     <div className="flex flex-col">
		//       <div className="text-3xl font-semibold tracking-tight leading-tight">
		//         {amount.toLocaleString("en-US", {
		//           style: "currency",
		//           currency: "USD",
		//         })}
		//       </div>
		//       <div className="flex items-center">
		//         <FuseSvgIcon className="mr-4 text-green-500" size={20}>
		//           heroicons-solid:trending-down
		//         </FuseSvgIcon>
		//         <Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
		//           <span className="text-green-500">2%</span>
		//           <span> below projected</span>
		//         </Typography>
		//       </div>
		//     </div>
		//     <div className="flex flex-col flex-auto ml-32">
		//       <ReactApexChart
		//         className="flex-auto w-full h-64"
		//         options={chartOptions}
		//         series={_.cloneDeep(series)}
		//         type={chartOptions?.chart?.type}
		//         height={chartOptions?.chart?.height}
		//       />
		//     </div>
		//   </div>
		// </Paper>
	);
}

export default WeeklyExpensesWidget;
