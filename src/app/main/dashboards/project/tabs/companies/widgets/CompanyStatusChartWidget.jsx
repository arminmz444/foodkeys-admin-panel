import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompanyStatusChartWidget widget.
 */
function CompanyStatusChartWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();
	
	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.companyStats || awaitRender) {
		return null;
	}

	const { percentageByStatus } = stats.companyStats;
	
	// Status label mapping to Persian
	const statusLabelMap = {
		'PENDING': 'در انتظار تایید',
		'VERIFIED': 'تایید شده',
		'DENIED': 'رد شده',
		'ARCHIVED': 'آرشیو شده',
		'DELETED': 'حذف شده',
		'UPDATED': 'بروزرسانی شده',
		'PUBLISHED': 'منتشر شده',
		'REVISION': 'بازبینی',
		'SUBMIT': 'ارسال شده'
	};
	
	// Prepare data for chart
	const rawData = Object.entries(percentageByStatus || {}).map(([key, value]) => ({
		key: key,
		label: statusLabelMap[key] || key,
		value: value
	}));
	
	// Round percentages so they sum to 100 while maintaining order
	const roundPercentages = (data) => {
		const sum = data.reduce((acc, item) => acc + item.value, 0);
		const rounded = data.map((item, index) => ({
			index: index,
			label: item.label,
			rounded: Math.floor(item.value),
			remainder: item.value - Math.floor(item.value)
		}));
		
		let currentSum = rounded.reduce((acc, item) => acc + item.rounded, 0);
		const difference = Math.round(sum) - currentSum;
		
		// Sort by remainder descending to find which items to increment
		const sortedByRemainder = [...rounded].sort((a, b) => b.remainder - a.remainder);
		
		// Mark which indices should get +1
		const indicesToIncrement = new Set();
		for (let i = 0; i < difference; i++) {
			indicesToIncrement.add(sortedByRemainder[i].index);
		}
		
		// Apply increments while maintaining original order
		return rounded.map((item, i) => 
			item.rounded + (indicesToIncrement.has(i) ? 1 : 0)
		);
	};
	
	const labels = rawData.map(item => item.label);
	const series = roundPercentages(rawData);

	const chartOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'donut',
			toolbar: {
				show: false
			}
		},
		labels: labels,
		colors: ['#EAB308', '#22C55E', '#EF4444', '#6B7280', '#3B82F6', '#A855F7', '#6366F1', '#F97316'],
		legend: {
			position: 'bottom',
			fontSize: '12px'
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'مجموع',
							fontSize: '14px',
							formatter: () => {
								return stats.companyStats.summary.total.toString();
							}
						}
					}
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${Math.round(val)}%`
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter: (val) => `${Math.round(val)}%`
			}
		},
		stroke: {
			colors: [theme.palette.background.paper]
		}
	};

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<Typography className="text-lg font-semibold mb-16">
				توزیع درصدی وضعیت‌ها
			</Typography>
			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={series}
					type="donut"
					height={300}
				/>
			</div>
		</Paper>
	);
}

export default memo(CompanyStatusChartWidget);

