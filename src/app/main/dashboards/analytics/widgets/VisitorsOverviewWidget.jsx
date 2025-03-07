import { alpha, ThemeProvider, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { selectContrastMainTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import Typography from '@mui/material/Typography';

import { private_safeDarken } from '@mui/system/colorManipulator';
import { useAppSelector } from 'app/store/hooks';
import _ from '@lodash';
import { selectWidget } from '../AnalyticsDashboardApi';

/**
 * The visitors overview widget.
 */
function VisitorsOverviewWidget() {
	const theme = useTheme();
	const contrastTheme = useAppSelector(selectContrastMainTheme(theme.palette.primary.dark));
	const widget = useAppSelector(selectWidget('visitors'));

	if (!widget) {
		return null;
	}

	const { series, ranges } = widget;
	const [tabValue, setTabValue] = useState(0);
	const currentRange = Object.keys(ranges)[tabValue];
	const chartOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			width: '100%',
			height: '100%',
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [contrastTheme.palette.secondary.light],
		dataLabels: {
			enabled: false
		},
		fill: {
			colors: [contrastTheme.palette.secondary.dark]
		},
		grid: {
			show: true,
			borderColor: alpha(contrastTheme.palette.primary.contrastText, 0.1),
			padding: {
				top: 10,
				bottom: -40,
				left: 0,
				right: 0
			},
			position: 'back',
			xaxis: {
				lines: {
					show: true
				}
			}
		},
		stroke: {
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			},
			y: {
				formatter: (value) => `${value}`
			}
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			crosshairs: {
				stroke: {
					color: contrastTheme.palette.secondary.main,
					dashArray: 0,
					width: 2
				}
			},
			labels: {
				offsetY: -20,
				style: {
					colors: contrastTheme.palette.primary.contrastText
				}
			},
			tickAmount: 20,
			tooltip: {
				enabled: false
			},
			type: 'datetime'
		},
		yaxis: {
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			},
			min: (min) => min - 750,
			max: (max) => max + 250,
			tickAmount: 5,
			show: false
		}
	};
	return (
		<ThemeProvider theme={contrastTheme}>
			<Box
				className="sm:col-span-2 lg:col-span-3 dark flex flex-col flex-auto shadow rounded-2xl overflow-hidden"
				sx={{
					background: private_safeDarken(contrastTheme.palette.primary.main, 0.1),
					color: contrastTheme.palette.primary.contrastText
				}}
			>
				<div className="flex items-center justify-between mt-40 ml-40 mr-24 sm:mr-40">
					<div className="flex flex-col">
						<Typography
							sx={{
								color: contrastTheme.palette.primary.contrastText
							}}
							className="mr-16 text-2xl md:text-3xl font-semibold tracking-tight leading-7"
						>
							Visitors Overview
						</Typography>
						<Typography
							className="font-medium"
							sx={{
								color: alpha(contrastTheme.palette.primary.contrastText, 0.7)
							}}
						>
							Number of unique visitors
						</Typography>
					</div>
					<div className="mt-12 sm:mt-0 sm:ml-8">
						<Tabs
							value={tabValue}
							onChange={(_ev, value) => setTabValue(value)}
							indicatorColor="secondary"
							textColor="inherit"
							variant="scrollable"
							scrollButtons={false}
							className="-mx-4 min-h-40"
							classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
							TabIndicatorProps={{
								children: (
									<Box
										sx={{ backgroundColor: contrastTheme.palette.primary.contrastText }}
										className="w-full h-full rounded-full opacity-10"
									/>
								)
							}}
						>
							{Object.entries(ranges).map(([key, label]) => (
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									sx={{
										color: contrastTheme.palette.primary.contrastText
									}}
									key={key}
									label={label}
								/>
							))}
						</Tabs>
					</div>
				</div>

				<div className="flex flex-col flex-auto h-320">
					<ReactApexChart
						options={chartOptions}
						series={_.cloneDeep(series[currentRange])}
						type={chartOptions?.chart?.type}
						height={chartOptions?.chart?.height}
					/>
				</div>
			</Box>
		</ThemeProvider>
	);
}

export default VisitorsOverviewWidget;
