import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The ServiceSubCategoryWidget widget.
 */
function ServiceSubCategoryWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();
	
	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.serviceStats || awaitRender) {
		return null;
	}

	const { bySubCategory } = stats.serviceStats;
	
	// Check if we have data
	if (!bySubCategory || Object.keys(bySubCategory).length === 0) {
		return (
			<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
				<Typography className="text-lg font-semibold mb-16">
					خدمات بر اساس زیرگروه
				</Typography>
				<Typography className="text-center text-secondary py-32">
					داده‌ای برای نمایش وجود ندارد
				</Typography>
			</Paper>
		);
	}

	const labels = Object.keys(bySubCategory);
	const series = Object.values(bySubCategory);

	const chartOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'bar',
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				horizontal: true,
				distributed: true,
				barHeight: '70%'
			}
		},
		colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
		dataLabels: {
			enabled: true,
			style: {
				fontSize: '12px'
			}
		},
		legend: {
			show: false
		},
		xaxis: {
			categories: labels,
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
				خدمات بر اساس زیرگروه
			</Typography>
			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={[{ name: 'تعداد', data: series }]}
					type="bar"
					height={200}
				/>
			</div>
		</Paper>
	);
}

export default memo(ServiceSubCategoryWidget);

