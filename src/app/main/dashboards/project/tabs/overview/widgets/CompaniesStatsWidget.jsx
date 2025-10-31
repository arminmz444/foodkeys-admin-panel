import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The CompaniesStatsWidget widget.
 */
function CompaniesStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.companyStats) {
		return null;
	}

	const { summary } = stats.companyStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">شرکت‌ها</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{summary.total}
					</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-blue-50 dark:bg-blue-900">
					<FuseSvgIcon className="text-blue-600 dark:text-blue-400" size={24}>
						heroicons-outline:office-building
					</FuseSvgIcon>
				</div>
			</div>
			<div className="flex flex-col mt-16 space-y-6">
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">در انتظار تایید</Typography>
					<Typography className="text-sm font-semibold">{summary.pending}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">تایید شده</Typography>
					<Typography className="text-sm font-semibold text-green-600">{summary.verified}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">رد شده</Typography>
					<Typography className="text-sm font-semibold text-red-600">{summary.denied}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(CompaniesStatsWidget);

