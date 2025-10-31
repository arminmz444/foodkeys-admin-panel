import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The TopVisitedServicesWidget widget.
 */
function TopVisitedServicesWidget() {
	const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
	
	if (isLoading) {
		return <FuseLoading />;
	}

	if (!stats?.serviceStats?.topVisited) {
		return null;
	}

	const services = stats.serviceStats.topVisited;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between p-24 pb-0">
				<Typography className="text-lg font-semibold">
					پربازدیدترین خدمات
				</Typography>
				<FuseSvgIcon className="text-purple-600" size={24}>
					heroicons-outline:trending-up
				</FuseSvgIcon>
			</div>
			<div className="overflow-x-auto">
				<Table className="w-full">
					<TableHead>
						<TableRow>
							<TableCell align="right" className="text-right">رتبه</TableCell>
							<TableCell align="right" className="text-right">نام خدمت</TableCell>
							<TableCell align="right" className="text-right">تعداد بازدید</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{services.map((service, index) => (
							<TableRow key={service.id} hover>
								<TableCell align="right" className="text-right">
									<div className="flex items-center justify-end">
										<div className="flex items-center justify-center w-32 h-32 rounded-full bg-purple-50 dark:bg-purple-900">
											<Typography className="text-sm font-bold text-purple-600">
												{index + 1}
											</Typography>
										</div>
									</div>
								</TableCell>
								<TableCell align="right" className="text-right">
									<Typography className="font-medium">
										{service.name}
									</Typography>
								</TableCell>
								<TableCell align="right" className="text-right">
									<Typography className="font-semibold text-green-600">
										{service.visitCount.toLocaleString('fa-IR')}
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</Paper>
	);
}

export default memo(TopVisitedServicesWidget);

