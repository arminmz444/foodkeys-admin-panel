import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompanyTimeSeriesWidget widget.
 */
function CompanyTimeSeriesWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();
	
	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.companyStats?.timeSeries || awaitRender) {
		return null;
	}

	const { timeSeries } = stats.companyStats;

	// Check if we have data
	if (!timeSeries.labels || timeSeries.labels.length === 0) {
		return (
			<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
				<Typography className="text-lg font-semibold mb-16">
					روند ثبت شرکت‌های جدید
				</Typography>
				<Typography className="text-center text-secondary py-32">
					داده‌ای برای نمایش وجود ندارد
				</Typography>
			</Paper>
		);
	}

	const chartOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'area',
			toolbar: {
				show: true,
				tools: {
					download: true,
					selection: false,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: false,
					reset: true
				}
			},
			zoom: {
				enabled: true
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.6,
				opacityTo: 0.1,
				stops: [0, 90, 100]
			}
		},
		colors: [theme.palette.primary.main],
		xaxis: {
			categories: timeSeries.labels,
			labels: {
				style: {
					colors: theme.palette.text.secondary
				}
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.secondary
				}
			}
		},
		grid: {
			borderColor: theme.palette.divider
		},
		tooltip: {
			theme: 'dark'
		}
	};

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<Typography className="text-lg font-semibold mb-16">
				روند ثبت شرکت‌های جدید
			</Typography>
			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={timeSeries.series}
					type="area"
					height={300}
				/>
			</div>
		</Paper>
	);
}

export default memo(CompanyTimeSeriesWidget);

