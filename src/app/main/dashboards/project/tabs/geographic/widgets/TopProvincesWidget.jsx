import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The TopProvincesWidget widget.
 */
function TopProvincesWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.geographicStats?.topProvinces) {
		return null;
	}

	const { topProvinces } = stats.geographicStats;

	if (!topProvinces || topProvinces.length === 0) {
		return (
			<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
				<Typography className="text-lg font-semibold mb-16">
					برترین استان‌ها
				</Typography>
				<Typography className="text-center text-secondary py-32">
					داده‌ای برای نمایش وجود ندارد
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
			<div className="flex items-center justify-between mb-16">
				<Typography className="text-lg font-semibold">
					برترین استان‌ها
				</Typography>
				<FuseSvgIcon className="text-blue-600" size={24}>
					heroicons-outline:location-marker
				</FuseSvgIcon>
			</div>
			<div className="flex flex-col space-y-12">
				{topProvinces.map((province, index) => (
					<div
						key={province.provinceName}
						className="flex items-center justify-between p-12 rounded-lg bg-gray-50 dark:bg-gray-800"
					>
						<div className="flex items-center space-x-12 space-x-reverse">
							<div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 dark:bg-blue-900">
								<Typography className="text-sm font-bold text-blue-600">
									{index + 1}
								</Typography>
							</div>
							<Typography className="font-medium">
								{province.provinceName}
							</Typography>
						</div>
						<div className="flex flex-col items-end">
							<Typography className="text-sm font-semibold text-blue-600">
								{province.companyCount} شرکت
							</Typography>
							{province.serviceCount > 0 && (
								<Typography className="text-xs text-secondary">
									{province.serviceCount} خدمت
								</Typography>
							)}
						</div>
					</div>
				))}
			</div>
		</Paper>
	);
}

export default memo(TopProvincesWidget);

