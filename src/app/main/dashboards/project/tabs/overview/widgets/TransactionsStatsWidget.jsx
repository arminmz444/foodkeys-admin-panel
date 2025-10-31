import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The TransactionsStatsWidget widget.
 */
function TransactionsStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.transactionStats) {
		return null;
	}

	const { totalCount, successfulCount, failedCount, pendingCount } = stats.transactionStats;
	const successRate = totalCount > 0 ? ((successfulCount / totalCount) * 100).toFixed(1) : 0;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<div className="flex items-center justify-center w-48 h-48 rounded-full bg-teal-50 dark:bg-teal-900">
						<FuseSvgIcon className="text-teal-600 dark:text-teal-400" size={24}>
							heroicons-outline:credit-card
						</FuseSvgIcon>
					</div>
					<div className="mr-12">
						<Typography className="text-sm font-medium text-secondary">تراکنش‌ها</Typography>
						<Typography className="text-3xl font-bold tracking-tight mt-4">
							{totalCount}
						</Typography>
					</div>
				</div>
				<div className="flex flex-col items-end">
					<Typography className="text-sm text-secondary">نرخ موفقیت</Typography>
					<Typography className="text-2xl font-bold text-green-600 mt-4">
						{successRate}%
					</Typography>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-12 mt-8">
				<div className="flex flex-col items-center p-12 rounded-lg bg-green-50 dark:bg-green-900/20">
					<Typography className="text-xs text-secondary">موفق</Typography>
					<Typography className="text-lg font-bold text-green-600 mt-4">{successfulCount}</Typography>
				</div>
				<div className="flex flex-col items-center p-12 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
					<Typography className="text-xs text-secondary">در انتظار</Typography>
					<Typography className="text-lg font-bold text-yellow-600 mt-4">{pendingCount}</Typography>
				</div>
				<div className="flex flex-col items-center p-12 rounded-lg bg-red-50 dark:bg-red-900/20">
					<Typography className="text-xs text-secondary">ناموفق</Typography>
					<Typography className="text-lg font-bold text-red-600 mt-4">{failedCount}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(TransactionsStatsWidget);

