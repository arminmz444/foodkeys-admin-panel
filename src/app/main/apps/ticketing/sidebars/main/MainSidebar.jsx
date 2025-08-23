import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import { CircularProgress, Fab } from '@mui/material';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useContext, useMemo, useState } from 'react';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import UserAvatar from '../../UserAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import { TicketAppContext } from '../../TicketingApp';
import TicketListItem from './TicketListItem';
import { useGetTicketsQuery, useGetUserProfileQuery } from '../../TicketingApi';
import NewTicketDialog from './NewTicketDialog';

function MainSidebar() {
	const { setUserSidebarOpen } = useContext(TicketAppContext);
	const { data: user, isLoading: isUserLoading } = useGetUserProfileQuery();
	const { data: tickets, isLoading: isTicketsLoading } = useGetTicketsQuery();
	const [searchText, setSearchText] = useState('');
	const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);

	function handleSearchText(event) {
		setSearchText(event.target.value);
	}

	const filteredTicketsContent = useMemo(() => {
		if (!tickets) {
			return null;
		}

		function getFilteredArray(arr, _searchText) {
			if (_searchText.length === 0) {
				return arr;
			}

			return FuseUtils.filterArrayByString(arr, _searchText);
		}

		const filteredTickets = getFilteredArray([...tickets], searchText);
		
		const container = {
			show: {
				transition: {
					staggerChildren: 0.05
				}
			}
		};
		
		const item = {
			hidden: { opacity: 0, y: 20 },
			show: { opacity: 1, y: 0 }
		};
		
		return (
			<motion.div
				className="flex flex-col shrink-0"
				variants={container}
				initial="hidden"
				animate="show"
			>
				{filteredTickets.length > 0 ? (
					<>
						{filteredTickets.map((ticket, index) => (
							<motion.div
								variants={item}
								key={ticket.id}
							>
								<div className={clsx(filteredTickets.length !== index + 1 && 'border-b-1')}>
									<TicketListItem ticket={ticket} />
								</div>
							</motion.div>
						))}
					</>
				) : (
					<motion.div variants={item} className="p-24 text-center">
						<Typography color="text.secondary">
							تیکتی ثبت نشده است
						</Typography>
					</motion.div>
				)}
			</motion.div>
		);
	}, [tickets, searchText]);

	// Loading indicator
	if (isUserLoading || isTicketsLoading) {
		return (
			<div className="flex flex-col flex-auto h-full">
				<div className="flex items-center justify-center p-24">
					<CircularProgress />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-auto h-full">
			<Box
				className="py-16 px-32 border-b-1"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02)
				}}
			>
				<div className="flex justify-between items-center mb-16">
					{user && (
						<div
							className="flex items-center cursor-pointer"
							onClick={() => setUserSidebarOpen(true)}
							onKeyDown={() => setUserSidebarOpen(true)}
							role="button"
							tabIndex={0}
						>
							<UserAvatar
								className="relative"
								user={user}
							/>
							<Typography className="mx-16 font-medium">
								{user.firstName} {user.lastName}
							</Typography>
						</div>
					)}

					<MainSidebarMoreMenu className="-mx-16" />
				</div>

				<Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40 rounded-full shadow-none">
					<FuseSvgIcon
						color="action"
						size={20}
					>
						heroicons-solid:search
					</FuseSvgIcon>

					<Input
						placeholder="جستجو تیکت ..."
						className="flex flex-1 px-8"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={handleSearchText}
					/>
				</Paper>
			</Box>

			<FuseScrollbars className="flex-1 relative">
				<List className="w-full">
					{filteredTicketsContent}
				</List>
				
				{/* Floating Action Button to create new ticket */}
				<Fab
					color="secondary"
					className="absolute bottom-16 right-16 z-999"
					aria-label="New Ticket"
					onClick={() => setNewTicketDialogOpen(true)}
				>
					<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
				</Fab>
			</FuseScrollbars>
			
			<NewTicketDialog 
				open={newTicketDialogOpen} 
				onClose={() => setNewTicketDialogOpen(false)}
			/>
		</div>
	);
}

export default MainSidebar;