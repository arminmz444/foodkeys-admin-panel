import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The RequestsStatsWidget widget.
 */
function RequestsStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.requestStats) {
		return null;
	}

	const { totalPending, totalResolved, totalDenied, averageResponseTimeHours } = stats.requestStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">درخواست‌ها</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{totalPending}
					</Typography>
					<Typography className="text-xs text-secondary mt-4">در انتظار بررسی</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-red-50 dark:bg-red-900">
					<FuseSvgIcon className="text-red-600 dark:text-red-400" size={24}>
						heroicons-outline:support
					</FuseSvgIcon>
				</div>
			</div>
			<div className="flex flex-col mt-16 space-y-6">
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">حل شده</Typography>
					<Typography className="text-sm font-semibold text-green-600">{totalResolved}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">رد شده</Typography>
					<Typography className="text-sm font-semibold text-red-600">{totalDenied}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">میانگین پاسخ‌گویی</Typography>
					<Typography className="text-sm font-semibold">{averageResponseTimeHours.toFixed(1)} ساعت</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(RequestsStatsWidget);

