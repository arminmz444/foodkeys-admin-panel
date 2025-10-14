import FuseScrollbars from '@fuse/core/FuseScrollbars';
import {
	CircularProgress,
	Fab,
	Chip
} from '@mui/material';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useContext, useMemo, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { TicketAppContext } from '../../TicketingApp';
import TicketListItem from './TicketListItem';
import { useGetTicketsQuery, useGetUserProfileQuery } from '../../TicketingApi';
import NewTicketDialog from './NewTicketDialog';
import Statuses from '../../Statuses';
import { debounce } from 'lodash';

function MainSidebar() {
	const { setUserSidebarOpen: _setUserSidebarOpen } = useContext(TicketAppContext);
	const { data: _user, isLoading: isUserLoading } = useGetUserProfileQuery();
	const [searchText, setSearchText] = useState('');
	const [debouncedSearchText, setDebouncedSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
	const [isSearching, setIsSearching] = useState(false);

	// Create debounced function to update search text
	const debouncedSetSearch = useCallback(
		debounce((value) => {
			setDebouncedSearchText(value);
			setIsSearching(false);
		}, 500),
		[]
	);

	// Track when search text changes
	useEffect(() => {
		if (searchText !== debouncedSearchText) {
			setIsSearching(true);
		}
	}, [searchText, debouncedSearchText]);

	// Track when status filter changes
	useEffect(() => {
		setIsSearching(true);
		const timer = setTimeout(() => {
			setIsSearching(false);
		}, 100);
		return () => clearTimeout(timer);
	}, [statusFilter]);

	// Build query parameters for API call
	const queryParams = useMemo(() => {
		const params = {};

		if (debouncedSearchText.trim()) {
			params.search = debouncedSearchText.trim();
		}

		if (statusFilter) {
			params.status = statusFilter;
		}

		return params;
	}, [debouncedSearchText, statusFilter]);

	// Use the query with proper configuration for cache invalidation
	const { 
		data: tickets, 
		isLoading: isTicketsLoading, 
		isFetching: isFetchingTickets,
		refetch
	} = useGetTicketsQuery(queryParams, {
		// Force refetch when parameters change
		refetchOnMountOrArgChange: true,
		// Skip the query if we don't have any parameters (initial load)
		skip: false
	});

	const handleSearchText = useCallback((event) => {
		const value = event.target.value;
		setSearchText(value);
		debouncedSetSearch(value);
	}, [debouncedSetSearch]);

	const ticketsContent = useMemo(() => {
		// Show loading spinner when tickets are loading or when searching/filtering
		if (isTicketsLoading || isFetchingTickets || isSearching) {
			return (
				<div className="flex items-center justify-center p-24">
					<CircularProgress size={24} />
					<Typography className="ml-8 text-14" color="text.secondary">
						در حال جستجو...
					</Typography>
				</div>
			);
		}

		if (!tickets) {
			return null;
		}

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
				{tickets.length > 0 ? (
					<>
						{tickets.map((ticket, index) => (
							<motion.div
								variants={item}
								key={ticket.id}
							>
								<div className={clsx(tickets.length !== index + 1 && 'border-b-1')}>
									<TicketListItem ticket={ticket} />
								</div>
							</motion.div>
						))}
					</>
				) : (
					<motion.div
						variants={item}
						className="p-24 text-center"
					>
						<Typography color="text.secondary">
							تیکتی ثبت نشده است
						</Typography>
					</motion.div>
				)}
			</motion.div>
		);
	}, [tickets, isTicketsLoading, isFetchingTickets, isSearching]);

	// Loading indicator - only show for initial user loading
	if (isUserLoading) {
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
				<Box className="mt-16">
					<Paper
						className="flex items-center w-full px-16 py-4 border-1 rounded-12 shadow-sm hover:shadow-md transition-shadow duration-200"
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === 'light'
									? theme.palette.background.paper
									: theme.palette.background.default,
							borderColor: (theme) =>
								theme.palette.mode === 'light'
									? theme.palette.divider
									: theme.palette.divider,
							'&:hover': {
								borderColor: (theme) => theme.palette.primary.main
							},
							'&:focus-within': {
								borderColor: (theme) => theme.palette.primary.main,
								boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`
							}
						}}
					>
						<FuseSvgIcon
							color="action"
							size={20}
							className="mr-8"
						>
							heroicons-solid:search
						</FuseSvgIcon>

						<Input
							placeholder="جستجو تیکت ..."
							className="flex flex-1"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={handleSearchText}
							sx={{
								'& .MuiInputBase-input': {
									fontSize: '14px',
									padding: '8px 4px'
								}
							}}
						/>

						{/* Clear button */}
						{searchText && (
							<FuseSvgIcon
								color="inherit"
								size={18}
								className="cursor-pointer hover:text-primary transition-colors duration-200"
								onClick={() => {
									setSearchText('')
									debouncedSetSearch('');
								}}
							>
								heroicons-solid:x-circle
							</FuseSvgIcon>
						)}
					</Paper>
				</Box>

				{/* Status Filter - Beautiful Design */}
				<Box className="mt-16">
					{/* <Typography
						variant="body2"
						className="mb-8 text-gray-600 dark:text-gray-400 font-medium"
					>
						فیلتر وضعیت
					</Typography> */}

					{/* Status Chips */}
					<Box className="flex flex-wrap gap-8">
						<Chip
							label="همه"
							variant={statusFilter === '' ? 'filled' : 'outlined'}
							color={statusFilter === '' ? 'primary' : 'default'}
							onClick={() => setStatusFilter('')}
							className="cursor-pointer transition-all duration-200 hover:shadow-md"
							sx={{
								'&:hover': {
									transform: 'translateY(-1px)'
								}
							}}
						/>
						{Statuses.map((status) => (
							<Chip
								key={status.value}
								label={status.title}
								variant={statusFilter === status.value ? 'filled' : 'outlined'}
								color={statusFilter === status.value ? 'primary' : 'default'}
								onClick={() => setStatusFilter(statusFilter === status.value ? '' : status.value)}
								className="cursor-pointer transition-all duration-200 hover:shadow-md"
								sx={{
									'&:hover': {
										transform: 'translateY(-1px)'
									},
									backgroundColor: statusFilter === status.value ? status.color : 'transparent',
									borderColor: status.color,
									color: statusFilter === status.value ? 'white' : status.color,
									'&:hover': {
										backgroundColor: statusFilter === status.value ? status.color : `${status.color}20`
									}
								}}
							/>
						))}
					</Box>
				</Box>
			</Box>

			<FuseScrollbars className="flex-1 relative">
				<List className="w-full">{ticketsContent}</List>

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