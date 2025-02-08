import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import Card from '@mui/material/Card';
import { AvatarGroup } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { formatDistanceToNow } from 'date-fns-jalali';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter/index.js';

/**
 * The service item component.
 */
function ServiceItem(props) {
	const { board } = props;

	// const { data: members } = useGetScrumboardMembersQuery();
	const boardMembers = [
		{
			id: '8af617d7-898e-4992-beda-d5ac1d7ceda4',
			name: 'Garcia Whitney',
			avatar: 'assets/images/avatars/male-06.jpg'
		},
		{
			id: 'bcff44c4-9943-4adc-9049-08b1d922a658',
			name: 'Spencer Pate',
			avatar: 'assets/images/avatars/male-07.jpg'
		},
		{
			id: '54160ca2-29c9-4475-88a1-31a9307ad913',
			name: 'Monica Mcdaniel',
			avatar: 'assets/images/avatars/female-09.jpg'
		},
		{
			id: '51286603-3a43-444e-9242-f51fe57d5363',
			name: 'Mcmillan Durham',
			avatar: 'assets/images/avatars/male-08.jpg'
		},
		{
			id: '319ecb5b-f99c-4ee4-81b2-3aeffd1d4735',
			name: 'Jeoine Hebert',
			avatar: 'assets/images/avatars/female-10.jpg'
		}
	];
	// board.members.map((id) => _.find(members, { id }));
	return (
		<Card
			component={NavLinkAdapter}
			to={board.id}
			role="button"
			className="flex flex-col items-start w-full h-full p-24 shadow rounded-lg hover:shadow-xl transition-shadow duration-150 ease-in-out"
		>
			<div className="flex flex-col flex-auto justify-start items-start w-full">
				<Box
					sx={{
						backgroundColor: 'secondary.light',
						color: 'secondary.dark'
					}}
					className="flex items-center justify-center p-16 rounded-full"
				>
					<FuseSvgIcon>{board.icon}</FuseSvgIcon>
				</Box>

				<Typography className="mt-20 text-lg font-bold leading-5">{board.name}</Typography>

				<Typography className="mt-8 line-clamp-2 text-secondary">{board.description}</Typography>

				<Divider className="w-48 mt-24 h-2" />
			</div>

			<div className="flex flex-col flex-auto justify-end w-full">
				{Boolean(boardMembers?.length) && (
					<div className="flex items-center mt-24 -space-x-6">
						<AvatarGroup max={4}>
							{boardMembers.map((member, index) => (
								<Avatar
									key={index}
									alt="member"
									src={member?.avatar}
								/>
							))}
						</AvatarGroup>
					</div>
				)}

				<div className="flex items-center mt-24 text-md font-md">
					<Typography color="text.secondary">آخرین ثبت:</Typography>
					<Typography className="mx-4 truncate">
						{(board &&
							board.lastActivity &&
							formatDistanceToNow(new Date(board.lastActivity), { addSuffix: true })) ||
							'N/A'}
						{/* {formatDistance(new Date(board.lastActivity), new Date(), { addSuffix: true })} */}
					</Typography>
				</div>
			</div>
		</Card>
	);
}

export default ServiceItem;
