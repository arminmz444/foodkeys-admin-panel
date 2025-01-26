/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add.js';
import EditIcon from '@mui/icons-material/Edit.js';
import UpIcon from '@mui/icons-material/KeyboardArrowUp.js';
import { green } from '@mui/material/colors';
import * as React from 'react';
import { useTheme } from '@mui/styles';
import { useGetUsersListQuery } from '@/app/main/apps/users/UserApi.js';
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
	right: 16,
};
const fabGreenStyle = {
	color: 'common.white',
	bgcolor: green[500],
	'&:hover': {
		bgcolor: green[600],
	},
};
const fabs = [
	{
		color: 'primary',
		sx: fabStyle,
		icon: <AddIcon />,
		label: 'Add',
	},
	{
		color: 'secondary',
		sx: fabStyle,
		icon: <EditIcon />,
		label: 'Edit',
	},
	{
		color: 'inherit',
		sx: { ...fabStyle, ...fabGreenStyle },
		icon: <UpIcon />,
		label: 'Expand',
	},
];

function UserTable({ props }) {
	const theme = useTheme();
	const products = useGetUsersListQuery() || []
	// const { data: products, isLoading } = useGetECommerceProductsQuery();
	const isLoading = false

	console.log(products)
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleChangeIndex = (index) => {
		setValue(index);
	};
	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen,
	};
	// const [removeProducts] = useDeleteECommerceProductsMutation();
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.featuredImageId,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.images?.length > 0 && row.original.featuredImageId ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={_.find(row.original.images, { id: row.original.featuredImageId })?.url}
								alt={row.original.name}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.name}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/e-commerce/products/${row.original.id}/${row.original.handle}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.name}
					</Typography>
				)
			},
			{
				accessorKey: 'categories',
				header: 'Category',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
						{row.categories.map((item) => (
							<Chip
								key={item}
								className="text-11"
								size="small"
								color="default"
								label={item}
							/>
						))}
					</div>
				)
			},
			{
				accessorKey: 'priceTaxIncl',
				header: 'Price',
				accessorFn: (row) => `$${row.priceTaxIncl}`
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				accessorFn: (row) => (
					<div className="flex items-center space-x-8">
						<span>{row.quantity}</span>
						<i
							className={clsx(
								'inline-block w-8 h-8 rounded',
								row.quantity <= 5 && 'bg-red',
								row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
								row.quantity > 25 && 'bg-green'
							)}
						/>
					</div>
				)
			},
			{
				accessorKey: 'active',
				header: 'Active',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.active ? (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			{fabs.map((fab, index) => (<Zoom key={fab.color} in={value === index} timeout={transitionDuration} style={{
				transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
			}} unmountOnExit>
				<Fab sx={fab.sx} aria-label={fab.label} color={fab.color}>
					{fab.icon}
				</Fab>
			</Zoom>))}
			<DataTable
				data={products}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							// removeProducts([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection)?.length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								// removeProducts(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">Delete selected items</span>
						</Button>
					);
				}}
			/>

		</Paper>
	);
}

export default UserTable;
