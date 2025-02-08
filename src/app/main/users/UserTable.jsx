/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { Paper } from '@mui/material';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { green } from '@mui/material/colors';
import * as React from 'react';
import { useTheme } from '@mui/styles';
import MRTEditModalDataTable from 'app/shared-components/data-table/mrt-edit-modal-data-table/MRTEditModalDataTable.jsx';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
// import { useDeleteECommerceProductsMutation } from '../UserApi.js';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
// 	fab: {
// 		position: 'fixed',
// 		bottom: theme.spacing(2),
// 		right: theme.spacing(2),
// 	},
// }));
const fabStyle = {
	position: 'absolute',
	bottom: 64,
	right: 16
};
const fabGreenStyle = {
	color: 'common.white',
	bgcolor: green[500],
	'&:hover': {
		bgcolor: green[600]
	}
};
const fabs = [
	{
		color: 'primary',
		sx: fabStyle,
		icon: <AddIcon />,
		label: 'Add'
	},
	{
		color: 'secondary',
		sx: fabStyle,
		icon: <EditIcon />,
		label: 'Edit'
	},
	{
		color: 'inherit',
		sx: { ...fabStyle, ...fabGreenStyle },
		icon: <UpIcon />,
		label: 'Expand'
	}
];

function UserTable({ props }) {
	const theme = useTheme();
	// const { data: users } = useGetUsersListQuery() || [];
	// console.log(users);
	// const { data: companies, isLoading } = useGetECommerceProductsQuery();
	const isLoading = false;

	// console.log(products);
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleChangeIndex = (index) => {
		setValue(index);
	};
	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'شناسه',
				enableEditing: false, // Not editable
				size: 80
			},
			{
				accessorKey: 'firstName',
				header: 'نام'
			},
			{
				accessorKey: 'lastName',
				header: 'نام خانوادگی'
			},
			{
				accessorKey: 'username',
				header: 'نام کاربری'
			},
			{
				accessorKey: 'email',
				header: 'ایمیل'
			}
			// {
			// 	id: 'operations',
			// 	header: 'عملیات',
			// 	enableColumnActions: false,
			// 	enableSorting: false,
			// 	size: 120,
			// 	Cell: ({ row, table }) => {
			// 		const handleAccessibilities = () => {
			// 			// Your custom logic for accessibilities (مثلاً open a dialog or redirect)
			// 			console.log('Accessibilities for user:', row.original.id);
			// 		};
			// 		const handleProfile = () => {
			// 			// Your custom logic for profile (مثلاً navigate to user profile)
			// 			console.log('Profile for user:', row.original.id);
			// 		};
			//
			// 		return (
			// 			<Box sx={{ display: 'flex', gap: '0.5rem' }}>
			// 				<Tooltip title="دسترسی‌ها">
			// 					<IconButton color="info" onClick={handleAccessibilities}>
			// 						<VpnKeyIcon />
			// 					</IconButton>
			// 				</Tooltip>
			// 				<Tooltip title="پروفایل">
			// 					<IconButton color="primary" onClick={handleProfile}>
			// 						<PersonIcon />
			// 					</IconButton>
			// 				</Tooltip>
			// 				{/* You can also keep your original edit & delete buttons if you like */}
			// 				<Tooltip title="ویرایش">
			// 					<IconButton onClick={() => table.setEditingRow(row)}>
			// 						<EditIcon />
			// 					</IconButton>
			// 				</Tooltip>
			// 				<Tooltip title="حذف">
			// 					<IconButton color="error" onClick={() => {
			// 						if (window.confirm('آیا مطمئن هستید؟')) {
			// 							// call your delete function here
			// 							table.options.onDelete?.(row.original.id);
			// 						}
			// 					}}>
			// 						<DeleteIcon />
			// 					</IconButton>
			// 				</Tooltip>
			// 			</Box>
			// 		);
			// 	}
			// }
			// {
			// 	// Example: custom cell with link
			// 	accessorKey: 'profileUrl',
			// 	header: 'Profile',
			// 	Cell: ({ row }) => (
			// 		<Typography
			// 			component={Link}
			// 			to={`/apps/users/${row.original.id}/details`}
			// 			className="underline"
			// 			color="secondary"
			// 			role="button"
			// 		>
			// 			مشاهده پروفایل
			// 		</Typography>
			// 	)
			// }
		],
		[]
	);

	// 2) Define your fetch/create/update/delete functions
	const fetchFn = async () => {
		// Example fetch from a real API
		const { data } = await axios.get('/api/users');
		// Return an array of user objects
		return data;
	};

	const createFn = async (newUser) => {
		await axios.post('/api/users', newUser);
	};

	const updateFn = async (updatedUser) => {
		await axios.put(`/api/users/${updatedUser.id}`, updatedUser);
	};

	const deleteFn = async (id) => {
		await axios.delete(`/api/users/${id}`);
	};
	// const [removeProducts] = useDeleteECommerceProductsMutation();
	// const columns = useMemo(
	// 	() => [
	// 		{
	// 			accessorFn: (row) => row.featuredImageId,
	// 			id: 'featuredImageId',
	// 			header: '',
	// 			enableColumnFilter: false,
	// 			enableColumnDragging: false,
	// 			size: 64,
	// 			enableSorting: false,
	// 			Cell: ({ row }) => (
	// 				<div className="flex items-center justify-center">
	// 					{row.original?.images?.length > 0 && row.original.featuredImageId ? (
	// 						<img
	// 							className="w-full max-h-40 max-w-40 block rounded"
	// 							src={_.find(row.original.images, { id: row.original.featuredImageId })?.url}
	// 							alt={row.original.name}
	// 						/>
	// 					) : (
	// 						<img
	// 							className="w-full max-h-40 max-w-40 block rounded"
	// 							src="assets/images/apps/ecommerce/product-image-placeholder.png"
	// 							alt={row.original.name}
	// 						/>
	// 					)}
	// 				</div>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'name',
	// 			header: 'Name',
	// 			Cell: ({ row }) => (
	// 				<Typography
	// 					component={Link}
	// 					to={`/apps/users/${row.original.id}}/details`}
	// 					className="underline"
	// 					color="secondary"
	// 					role="button"
	// 				>
	// 					{`${String(row.original.firstName)} ${String(row.original.lastName)}`}
	// 				</Typography>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'username',
	// 			header: 'Username',
	// 			Cell: ({ row }) => (
	// 				<Typography
	// 					component={Link}
	// 					to={`/apps/users/${row.original.id}}/details`}
	// 					className="underline"
	// 					color="secondary"
	// 					role="button"
	// 				>
	// 					{row.original.username}
	// 				</Typography>
	// 			)
	// 		}
	// 		// {
	// 		// 	accessorKey: 'categories',
	// 		// 	header: 'Category',
	// 		// 	accessorFn: (row) => (
	// 		// 		<div className="flex flex-wrap space-x-2">
	// 		// 			{row.categories.map((item) => (
	// 		// 				<Chip
	// 		// 					key={item}
	// 		// 					className="text-11"
	// 		// 					size="small"
	// 		// 					color="default"
	// 		// 					label={item}
	// 		// 				/>
	// 		// 			))}
	// 		// 		</div>
	// 		// 	)
	// 		// },
	// 		// {
	// 		// 	accessorKey: 'priceTaxIncl',
	// 		// 	header: 'Price',
	// 		// 	accessorFn: (row) => `$${row.priceTaxIncl}`
	// 		// },
	// 		// {
	// 		// 	accessorKey: 'quantity',
	// 		// 	header: 'Quantity',
	// 		// 	accessorFn: (row) => (
	// 		// 		<div className="flex items-center space-x-8">
	// 		// 			<span>{row.quantity}</span>
	// 		// 			<i
	// 		// 				className={clsx(
	// 		// 					'inline-block w-8 h-8 rounded',
	// 		// 					row.quantity <= 5 && 'bg-red',
	// 		// 					row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
	// 		// 					row.quantity > 25 && 'bg-green'
	// 		// 				)}
	// 		// 			/>
	// 		// 		</div>
	// 		// 	)
	// 		// },
	// 		// {
	// 		// 	accessorKey: 'active',
	// 		// 	header: 'Active',
	// 		// 	accessorFn: (row) => (
	// 		// 		<div className="flex items-center">
	// 		// 			{row.active ? (
	// 		// 				<FuseSvgIcon
	// 		// 					className="text-green"
	// 		// 					size={20}
	// 		// 				>
	// 		// 					heroicons-outline:check-circle
	// 		// 				</FuseSvgIcon>
	// 		// 			) : (
	// 		// 				<FuseSvgIcon
	// 		// 					className="text-red"
	// 		// 					size={20}
	// 		// 				>
	// 		// 					heroicons-outline:minus-circle
	// 		// 				</FuseSvgIcon>
	// 		// 			)}
	// 		// 		</div>
	// 		// 	)
	// 		// }
	// 	],
	// 	[]
	// );

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	return (
		// <Paper
		// 	className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-scroll rounded-b-0 w-full h-full"
		// 	elevation={0}
		// >
		// 	{fabs.map((fab, index) => (
		// 		<Zoom
		// 			key={fab.color}
		// 			in={value === index}
		// 			timeout={transitionDuration}
		// 			style={{
		// 				transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`
		// 			}}
		// 			unmountOnExit
		// 		>
		// 			<Fab
		// 				sx={fab.sx}
		// 				aria-label={fab.label}
		// 				color={fab.color}
		// 			>
		// 				{fab.icon}
		// 			</Fab>
		// 		</Zoom>
		// 	))}
		// 	{/* <DataTable */}
		// 	{/*	data={users ? users.data : []} */}
		// 	{/*	pagination={{}} */}
		// 	{/*	columns={columns} */}
		// 	{/*	loading={isLoading} */}
		// 	{/*	renderRowActionMenuItems={({ closeMenu, row, table }) => [ */}
		// 	{/*		<MenuItem */}
		// 	{/*			key={0} */}
		// 	{/*			onClick={() => { */}
		// 	{/*				// removeProducts([row.original.id]); */}
		// 	{/*				closeMenu(); */}
		// 	{/*				table.resetRowSelection(); */}
		// 	{/*			}} */}
		// 	{/*		> */}
		// 	{/*			<ListItemIcon> */}
		// 	{/*				<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon> */}
		// 	{/*			</ListItemIcon> */}
		// 	{/*			Delete */}
		// 	{/*		</MenuItem> */}
		// 	{/*	]} */}
		// 	{/*	renderTopToolbarCustomActions={({ table }) => { */}
		// 	{/*		const { rowSelection } = table.getState(); */}
		//
		// 	{/*		if (Object.keys(rowSelection)?.length === 0) { */}
		// 	{/*			return null; */}
		// 	{/*		} */}
		//
		// 	{/*		return ( */}
		// 	{/*			<Button */}
		// 	{/*				variant="contained" */}
		// 	{/*				size="small" */}
		// 	{/*				onClick={() => { */}
		// 	{/*					const selectedRows = table.getSelectedRowModel().rows; */}
		// 	{/*					// removeProducts(selectedRows.map((row) => row.original.id)); */}
		// 	{/*					table.resetRowSelection(); */}
		// 	{/*				}} */}
		// 	{/*				className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8" */}
		// 	{/*				color="secondary" */}
		// 	{/*			> */}
		// 	{/*				<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon> */}
		// 	{/*				<span className="hidden sm:flex mx-8">Delete selected items</span> */}
		// 	{/*			</Button> */}
		// 	{/*		); */}
		// 	{/*	}} */}
		// 	{/* /> */}
		// 	<FuseScrollbars>
		// 		<MRTEditModalDataTable
		// 			columns={columns}
		// 			queryKey="users-list" // the key used by react-query
		// 			fetchFn={fetchFn}
		// 			createFn={createFn}
		// 			updateFn={updateFn}
		// 			deleteFn={deleteFn}
		// 			tableTitleCreate="Create User"
		// 			tableTitleEdit="Edit User"
		// 			defaultPageSize={10}
		// 		/>
		// 	</FuseScrollbars>
		// </Paper>
		<Box sx={{ position: 'relative', flexGrow: 1 }}>
			{fabs.map((fab, index) => (
				<Zoom
					key={fab.color}
					in={value === index}
					timeout={transitionDuration}
					style={{
						transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`
					}}
					unmountOnExit
				>
					<Fab
						sx={fab.sx}
						aria-label={fab.label}
						color={fab.color}
					>
						{fab.icon}
					</Fab>
				</Zoom>
			))}

			{/* Outer container with margin and height so the table is fully visible */}
			<Paper
				elevation={3}
				sx={{
					m: 4, // margin from all sides
					p: 4, // padding
					mb: 0,
					pb: 4,
					mt: 0,
					pt: 4,
					height: 'calc(100vh - 150px)',
					position: 'relative',
					overflow: 'auto',
				}}
			>
				<MRTEditModalDataTable
					columns={columns}
					queryKey="users-list"
					fetchFn={fetchFn}
					createFn={createFn}
					updateFn={updateFn}
					deleteFn={deleteFn}
					tableTitleCreate="ثبت کاربر جدید"
					tableTitleEdit="ویرایش کاربر"
					tableTitle="لیست کاربران"
					defaultPageSize={10}
					OperationsSection={({ row, table }) => {
						const handleAccessibilities = () => {
							console.log('Accessibilities for user:', row.original.id);
						};
						const handleProfile = () => {
							console.log('Profile for user:', row.original.id);
						};

						return (
							<Box sx={{ display: 'flex', gap: '0.5rem' }}>
								<Tooltip title="دسترسی‌ها">
									<IconButton
										color="info"
										onClick={handleAccessibilities}
									>
										<VpnKeyIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="پروفایل">
									<IconButton
										color="primary"
										onClick={handleProfile}
									>
										<PersonIcon />
									</IconButton>
								</Tooltip>
							</Box>
						);
					}}
				/>
			</Paper>
		</Box>
	);
}

export default UserTable;
