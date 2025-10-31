import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken } from '@mui/material/styles';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import { getSafeString } from '@/utils/string-utils.js';
import { selectUnreadCount } from '../../apps/notifications/models/notificationSlice.js';

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader() {
	const newNotificationsCount = useAppSelector(selectUnreadCount);
	const user = useAppSelector(selectUser);

	return (
		<div className="flex flex-col w-full px-24 sm:px-32">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
				<div className="flex flex-auto items-center min-w-0">
					<Avatar
						sx={{
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: (theme) => theme.palette.text.secondary
						}}
						className="flex-0 w-64 h-64"
						alt="آواتار کاربر"
						src={getSafeString(user?.avatar?.filePath)}
					>
						{`${getSafeString(user?.firstName)} ${getSafeString(user?.lastName)}`}
					</Avatar>
					<div className="flex flex-col min-w-0 mx-16">
						<Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
							{`${getSafeString(user?.firstName)} عزیز ، خوش آمدی !`}
						</Typography>

						<div className="flex items-center mt-8">
							<FuseSvgIcon
								size={20}
								color="action"
							>
								heroicons-solid:bell
							</FuseSvgIcon>
							<Typography
								className="mx-6 leading-6 truncate"
								color="text.secondary"
							>
								شما {newNotificationsCount} پیام جدید دارید
							</Typography>
						</div>
					</div>
				</div>
				<div className="flex items-center mt-24 sm:mt-0">
					<div className="flex flex-col items-end">
						<Typography className="text-sm text-secondary">
							داشبورد مدیریتی
						</Typography>
						<Typography className="text-lg font-semibold mt-4">
							آمار و گزارشات سیستم
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;
