import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The UsersStatsWidget widget.
 */
function UsersStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.userStats) {
		return null;
	}

	const { total, active, verified, unverified } = stats.userStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">کاربران</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{total}
					</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-orange-50 dark:bg-orange-900">
					<FuseSvgIcon className="text-orange-600 dark:text-orange-400" size={24}>
						heroicons-outline:users
					</FuseSvgIcon>
				</div>
			</div>
			<div className="flex flex-col mt-16 space-y-6">
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">فعال</Typography>
					<Typography className="text-sm font-semibold text-green-600">{active}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">تایید شده / تایید نشده</Typography>
					<Typography className="text-sm font-semibold">{verified} / {unverified}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(UsersStatsWidget);

