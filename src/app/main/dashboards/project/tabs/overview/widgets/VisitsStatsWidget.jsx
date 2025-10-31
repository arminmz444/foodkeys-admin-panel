import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The VisitsStatsWidget widget.
 */
function VisitsStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.visitStats) {
		return null;
	}

	const { totalVisits, totalCompanyVisits, totalServiceVisits } = stats.visitStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">بازدیدها</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{totalVisits.toLocaleString('fa-IR')}
					</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-indigo-50 dark:bg-indigo-900">
					<FuseSvgIcon className="text-indigo-600 dark:text-indigo-400" size={24}>
						heroicons-outline:eye
					</FuseSvgIcon>
				</div>
			</div>
			<div className="flex flex-col mt-16 space-y-6">
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">بازدید شرکت‌ها</Typography>
					<Typography className="text-sm font-semibold">{totalCompanyVisits.toLocaleString('fa-IR')}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">بازدید خدمات</Typography>
					<Typography className="text-sm font-semibold">{totalServiceVisits.toLocaleString('fa-IR')}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(VisitsStatsWidget);

