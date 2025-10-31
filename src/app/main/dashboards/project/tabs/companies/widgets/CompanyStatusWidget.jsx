import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompanyStatusWidget widget.
 */
function CompanyStatusWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.companyStats) {
		return null;
	}

	const { summary } = stats.companyStats;

	const statusItems = [
		{ label: 'در انتظار تایید', value: summary.pending, color: 'text-yellow-600' },
		{ label: 'تایید شده', value: summary.verified, color: 'text-green-600' },
		{ label: 'رد شده', value: summary.denied, color: 'text-red-600' },
		{ label: 'آرشیو شده', value: summary.archived, color: 'text-gray-600' },
		{ label: 'منتشر شده', value: summary.published, color: 'text-blue-600' },
		{ label: 'بروزرسانی شده', value: summary.updated, color: 'text-purple-600' },
		{ label: 'ارسال شده', value: summary.submit, color: 'text-indigo-600' },
		{ label: 'بازبینی', value: summary.revision, color: 'text-orange-600' },
	];

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between mb-16">
				<Typography className="text-lg font-semibold">
					وضعیت شرکت‌ها
				</Typography>
				<Typography className="text-3xl font-bold text-blue-600">
					{summary.total}
				</Typography>
			</div>
			<div className="grid grid-cols-2 gap-12">
				{statusItems.map((item) => (
					<div key={item.label} className="flex flex-col p-12 rounded-lg bg-gray-50 dark:bg-gray-800">
						<Typography className="text-xs text-secondary mb-4">{item.label}</Typography>
						<Typography className={`text-xl font-bold ${item.color}`}>
							{item.value}
						</Typography>
					</div>
				))}
			</div>
		</Paper>
	);
}

export default memo(CompanyStatusWidget);

