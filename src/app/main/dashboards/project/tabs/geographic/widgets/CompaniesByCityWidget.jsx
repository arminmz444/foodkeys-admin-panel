import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompaniesByCityWidget widget.
 */
function CompaniesByCityWidget() {
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

	const { companiesByCity } = stats.geographicStats;
	
	// Check if we have data
	if (!companiesByCity || Object.keys(companiesByCity).length === 0) {
		return (
			<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
				<Typography className="text-lg font-semibold mb-16">
					شرکت‌ها بر اساس شهر
				</Typography>
				<Typography className="text-center text-secondary py-32">
					داده‌ای برای نمایش وجود ندارد
				</Typography>
			</Paper>
		);
	}

	// Sort and get top 10 cities
	const sortedCities = Object.entries(companiesByCity)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10);

	const labels = sortedCities.map(([city]) => city);
	const series = sortedCities.map(([, count]) => count);

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
				horizontal: false,
				columnWidth: '60%',
				distributed: true
			}
		},
		colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'],
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
				},
				rotate: -45
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.secondary
				}
			},
			title: {
				text: 'تعداد شرکت‌ها'
			}
		},
		grid: {
			borderColor: theme.palette.divider
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter: (val) => `${val} شرکت`
			}
		}
	};

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<Typography className="text-lg font-semibold mb-16">
				10 شهر برتر از نظر تعداد شرکت
			</Typography>
			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={[{ name: 'تعداد شرکت', data: series }]}
					type="bar"
					height={300}
				/>
			</div>
		</Paper>
	);
}

export default memo(CompaniesByCityWidget);

