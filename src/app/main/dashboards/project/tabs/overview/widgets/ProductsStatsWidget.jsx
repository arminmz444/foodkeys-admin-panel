import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The ProductsStatsWidget widget.
 */
function ProductsStatsWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.productStats) {
		return null;
	}

	const { total, outsourced, nonOutsourced } = stats.productStats;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-sm font-medium text-secondary">محصولات</Typography>
					<Typography className="text-3xl font-bold tracking-tight mt-8">
						{total}
					</Typography>
				</div>
				<div className="flex items-center justify-center w-48 h-48 rounded-full bg-green-50 dark:bg-green-900">
					<FuseSvgIcon className="text-green-600 dark:text-green-400" size={24}>
						heroicons-outline:cube
					</FuseSvgIcon>
				</div>
			</div>
			<div className="flex flex-col mt-16 space-y-6">
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">برون سپاری</Typography>
					<Typography className="text-sm font-semibold">{outsourced}</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography className="text-sm text-secondary">غیر برون سپاری</Typography>
					<Typography className="text-sm font-semibold">{nonOutsourced}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(ProductsStatsWidget);

