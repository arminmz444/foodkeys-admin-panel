import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The ServiceStatsWidget widget.
 */
function ServiceStatsWidget() {
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
			<div className="flex items-center justify-center w-64 h-64 rounded-full bg-purple-50 dark:bg-purple-900 mx-auto mb-16">
				<FuseSvgIcon className="text-purple-600 dark:text-purple-400" size={32}>
					heroicons-outline:briefcase
				</FuseSvgIcon>
			</div>
			<div className="text-center">
				<Typography className="text-sm font-medium text-secondary">
					مجموع خدمات
				</Typography>
				<Typography className="text-5xl font-bold tracking-tight mt-8 text-purple-600">
					{total}
				</Typography>
			</div>
		</Paper>
	);
}

export default memo(ServiceStatsWidget);

