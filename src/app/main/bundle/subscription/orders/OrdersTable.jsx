/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { useDeleteECommerceOrdersMutation, useGetECommerceOrdersQuery } from '../ServicesBankApi.js';
import OrdersStatus from '../order/OrdersStatus';

function OrdersTable() {
	const { data: orders, isLoading } = useGetECommerceOrdersQuery();
	const [removeOrders] = useDeleteECommerceOrdersMutation();
	const today = () => {
		const today = new Date();
		today.setHours(Math.floor(Math.random() * 24));
		today.setMinutes(Math.floor(Math.random() * 60));
		today.setSeconds(Math.floor(Math.random() * 60));
		return today;
	};

	const data = [
		{
			isActive: true,
			name: 'Tanner Linsley',
			hireDate: '2016-02-23T18:25:43.511Z',
			arrivalTime: '2016-02-23T18:25:43.511Z',
			departureTime: today(),
			age: 42,
			salary: 100_000,
			city: 'San Francisco',
			state: 'California',
		},
		{
			isActive: true,
			name: 'Kevin Vandy',
			hireDate: '2019-02-23T18:21:43.335',
			arrivalTime: '2019-02-23T18:21:43.335',
			departureTime: today(),
			age: 51,
			salary: 80_000,
			city: 'Richmond',
			state: 'Virginia',
		},
		{
			isActive: false,
			name: 'John Doe',
			hireDate: '2014-02-23T18:25:43.511Z',
			arrivalTime: '2014-02-23T18:25:43.511Z',
			departureTime: today(),
			age: 27,
			salary: 120_000,
			city: 'Riverside',
			state: 'South Carolina',
		},
		{
			isActive: true,
			name: 'Jane Doe',
			hireDate: '2015-02-25T18:25:43.511Z',
			arrivalTime: '2015-02-25T18:25:43.511Z',
			departureTime: today(),
			age: 32,
			salary: 150_000,
			city: 'San Francisco',
			state: 'California',
		},
		{
			isActive: false,
			name: 'John Smith',
			hireDate: '2023-06-11T18:25:43.511Z',
			arrivalTime: '2023-06-11T18:25:43.511Z',
			departureTime: today(),
			age: 42,
			salary: 75_000,
			city: 'Los Angeles',
			state: 'California',
		},
		{
			isActive: true,
			name: 'Jane Smith',
			hireDate: '2019-02-23T18:21:43.335',
			arrivalTime: '2019-02-23T18:21:43.335',
			departureTime: today(),
			age: 51,
			salary: 56_000,
			city: 'Blacksburg',
			state: 'Virginia',
		},
		{
			isActive: false,
			name: 'Samuel Jackson',
			hireDate: '2010-02-23T18:25:43.511Z',
			arrivalTime: '2010-02-23T18:25:43.511Z',
			departureTime: today(),
			age: 27,
			salary: 90_000,
			city: 'New York',
			state: 'New York',
		},
	];

	const citiesList = [
		'San Francisco',
		'Richmond',
		'Riverside',
		'Los Angeles',
		'Blacksburg',
		'New York',
	];

	const usStateList = [
		'California',
		'Virginia',
		'South Carolina',
		'New York',
		'Texas',
	];
	const columns = useMemo(
		() => [
			{
				header: 'Status',
				accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
				id: 'isActive',
				filterVariant: 'checkbox',
				Cell: ({ cell }) =>
					cell.getValue() === 'true' ? 'Active' : 'Inactive',
				size: 170,
			},
			{
				accessorKey: 'name',
				header: 'Name',
				filterVariant: 'text', // default
				size: 200,
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				Cell: ({ cell }) =>
					cell.getValue<number>().toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					}),
				filterVariant: 'range-slider',
				filterFn: 'betweenInclusive', // default (or between)
				muiFilterSliderProps: {
					marks: true,
					max: 200_000,
					min: 30_000,
					step: 10_000,
					valueLabelFormat: (value) =>
						value.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						}),
				},
			},
			{
				accessorKey: 'age',
				header: 'Age',
				filterVariant: 'range',
				filterFn: 'between',
				size: 80,
			},
			{
				accessorKey: 'city',
				header: 'City',
				filterVariant: 'select',
				filterSelectOptions: citiesList,
			},
			{
				accessorKey: 'state',
				header: 'State',
				filterVariant: 'multi-select',
				filterSelectOptions: usStateList, //custom options list (as opposed to faceted list)
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
				id: 'hireDate',
				header: 'Hire Date',
				filterVariant: 'date-range',
				Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), // convert back to string for display
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.arrivalTime), //convert to date for sorting and filtering
				id: 'arrivalTime',
				header: 'Arrival Time',
				filterVariant: 'datetime-range',
				Cell: ({ cell }) =>
					`${cell.getValue<Date>().toLocaleDateString()} ${cell
						.getValue<Date>()
						.toLocaleTimeString()}`, // convert back to string for display
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.departureTime), //convert to date for sorting and filtering
				id: 'departureTime',
				header: 'Departure Time',
				filterVariant: 'time-range',
				Cell: ({ cell }) => cell.getValue<Date>().toLocaleTimeString(), // convert back to string for display
			},
		],
		[],
	);
	// const columns = useMemo(
	// 	() => [
	// 		{
	// 			accessorKey: 'id',
	// 			header: 'Id',
	// 			size: 64
	// 		},
	// 		{
	// 			accessorKey: 'reference',
	// 			header: 'Reference',
	// 			size: 64,
	// 			Cell: ({ row }) => (
	// 				<Typography
	// 					component={Link}
	// 					to={`/apps/e-commerce/orders/${row.original.id}`}
	// 					className="underline"
	// 					color="secondary"
	// 					role="button"
	// 				>
	// 					{row.original.reference}
	// 				</Typography>
	// 			)
	// 		},
	// 		{
	// 			id: 'customer',
	// 			accessorFn: (row) => `${row.customer.firstName} ${row.customer.lastName}`,
	// 			header: 'Customer'
	// 		},
	// 		{
	// 			id: 'total',
	// 			accessorFn: (row) => `$${row.total}`,
	// 			header: 'Total',
	// 			size: 64
	// 		},
	// 		{ id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
	// 		{
	// 			id: 'status',
	// 			accessorFn: (row) => <OrdersStatus name={row.status[0].name} />,
	// 			accessorKey: 'status',
	// 			header: 'Status'
	// 		},
	// 		{
	// 			accessorKey: 'date',
	// 			header: 'Date'
	// 		}
	// 	],
	// 	[]
	// );

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20
					},
					localization: { MRT_Localization_FA }
				}}
				data={orders}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeOrders([row.original.id]);
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

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								removeOrders(selectedRows.map((row) => row.original.id));
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

export default OrdersTable;
