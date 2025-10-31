import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The ServicesStatsWidget widget.
 */
function ServicesStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.serviceStats) {
		return null;
	}

	const { total } = stats.serviceStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">خدمات</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{total}
					</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-purple-50 dark:bg-purple-900">
					<FuseSvgIcon className="text-purple-600 dark:text-purple-400" size={24}>
						heroicons-outline:briefcase
					</FuseSvgIcon>
				</div>
			</div>
			<Typography className="text-sm text-secondary mt-16">
				مجموع خدمات ثبت شده در سیستم
			</Typography>
		</Paper>
	);
}

export default memo(ServicesStatsWidget);

