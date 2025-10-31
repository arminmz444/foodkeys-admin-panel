import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompaniesByProvinceWidget widget.
 */
function CompaniesByProvinceWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();
	
	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.geographicStats || awaitRender) {
		return null;
	}

	const { companiesByProvince } = stats.geographicStats;
	
	// Check if we have data
	if (!companiesByProvince || Object.keys(companiesByProvince).length === 0) {
		return (
			<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
				<Typography className="text-lg font-semibold mb-16">
					شرکت‌ها بر اساس استان
				</Typography>
				<Typography className="text-center text-secondary py-32">
					داده‌ای برای نمایش وجود ندارد
				</Typography>
			</Paper>
		);
	}

	const labels = Object.keys(companiesByProvince);
	const series = Object.values(companiesByProvince);

	const chartOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'pie',
			toolbar: {
				show: false
			}
		},
		labels: labels,
		colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6'],
		legend: {
			position: 'bottom',
			fontSize: '12px'
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${val.toFixed(1)}%`
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter: (val) => `${val} شرکت`
			}
		},
		stroke: {
			colors: [theme.palette.background.paper]
		}
	};

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<Typography className="text-lg font-semibold mb-16">
				شرکت‌ها بر اساس استان
			</Typography>
			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={series}
					type="pie"
					height={300}
				/>
			</div>
		</Paper>
	);
}

export default memo(CompaniesByProvinceWidget);

