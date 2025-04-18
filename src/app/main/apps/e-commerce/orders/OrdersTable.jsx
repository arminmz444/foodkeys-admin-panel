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
import { useDeleteECommerceOrdersMutation, useGetECommerceOrdersQuery } from '../ECommerceApi';
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
			id: 1,
			reference: 'ORD-001',
			customer: { firstName: 'Tanner', lastName: 'Linsley' },
			name: 'Tanner Linsley',
			hireDate: '2016-02-23T18:25:43.511Z',
			arrivalTime: '2016-02-23T18:25:43.511Z',
			departureTime: '2016-02-23T20:00:00.511Z',
			age: 42,
			salary: 100_000,
			city: 'San Francisco',
			state: 'California',
			total: 5000,
			payment: { method: 'Credit Card' },
			status: [{ name: 'Completed' }],
			date: '2024-01-30T12:30:00.000Z'
		},
		{
			id: 2,
			reference: 'ORD-002',
			customer: { firstName: 'Kevin', lastName: 'Vandy' },
			name: 'Kevin Vandy',
			hireDate: '2019-02-23T18:21:43.335Z',
			arrivalTime: '2019-02-23T18:21:43.335Z',
			departureTime: '2019-02-23T19:30:00.335Z',
			age: 51,
			salary: 80_000,
			city: 'Richmond',
			state: 'Virginia',
			total: 3000,
			payment: { method: 'PayPal' },
			status: [{ name: 'Pending' }],
			date: '2024-01-30T14:45:00.000Z'
		},
		{
			id: 3,
			reference: 'ORD-003',
			customer: { firstName: 'John', lastName: 'Doe' },
			name: 'John Doe',
			hireDate: '2014-02-23T18:25:43.511Z',
			arrivalTime: '2014-02-23T18:25:43.511Z',
			departureTime: '2014-02-23T20:15:00.511Z',
			age: 27,
			salary: 120_000,
			city: 'Riverside',
			state: 'South Carolina',
			total: 4500,
			payment: { method: 'Bank Transfer' },
			status: [{ name: 'Shipped' }],
			date: '2024-01-29T09:00:00.000Z'
		},
		{
			id: 4,
			reference: 'ORD-004',
			customer: { firstName: 'Jane', lastName: 'Doe' },
			name: 'Jane Doe',
			hireDate: '2015-02-25T18:25:43.511Z',
			arrivalTime: '2015-02-25T18:25:43.511Z',
			departureTime: '2015-02-25T19:45:00.511Z',
			age: 32,
			salary: 150_000,
			city: 'San Francisco',
			state: 'California',
			total: 7000,
			payment: { method: 'Credit Card' },
			status: [{ name: 'Delivered' }],
			date: '2024-01-28T15:20:00.000Z',
		},
		{
			id: 5,
			reference: 'ORD-005',
			customer: { firstName: 'John', lastName: 'Smith' },
			name: 'John Smith',
			hireDate: '2023-06-11T18:25:43.511Z',
			arrivalTime: '2023-06-11T18:25:43.511Z',
			departureTime: '2023-06-11T20:00:00.511Z',
			age: 42,
			salary: 75_000,
			city: 'Los Angeles',
			state: 'California',
			total: 6000,
			payment: { method: 'Debit Card' },
			status: [{ name: 'Processing' }],
			date: '2024-01-27T11:00:00.000Z'
		},
		{
			id: 6,
			reference: 'ORD-006',
			customer: { firstName: 'Jane', lastName: 'Smith' },
			name: 'Jane Smith',
			hireDate: '2019-02-23T18:21:43.335Z',
			arrivalTime: '2019-02-23T18:21:43.335Z',
			departureTime: '2019-02-23T19:30:00.335Z',
			age: 51,
			salary: 56_000,
			city: 'Blacksburg',
			state: 'Virginia',
			total: 2500,
			payment: { method: 'Wire Transfer' },
			status: [{ name: 'Cancelled' }],
			date: '2024-01-26T13:10:00.000Z'
		},
		{
			id: 7,
			reference: 'ORD-007',
			customer: { firstName: 'Samuel', lastName: 'Jackson' },
			name: 'Samuel Jackson',
			hireDate: '2010-02-23T18:25:43.511Z',
			arrivalTime: '2010-02-23T18:25:43.511Z',
			departureTime: '2010-02-23T20:10:00.511Z',
			age: 27,
			salary: 90_000,
			city: 'New York',
			state: 'New York',
			total: 4800,
			payment: { method: 'Cash' },
			status: [{ name: 'Completed' }],
			date: '2024-01-25T10:30:00.000Z'
		}
	];

	const citiesList = ['San Francisco', 'Richmond', 'Riverside', 'Los Angeles', 'Blacksburg', 'New York'];

	const usStateList = ['California', 'Virginia', 'South Carolina', 'New York', 'Texas'];

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Id',
				size: 64
			},
			{
				accessorKey: 'reference',
				header: 'Reference',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/e-commerce/orders/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.reference}
					</Typography>
				)
			},
			{
				id: 'customer',
				accessorFn: (row) => `${row.customer.firstName} ${row.customer.lastName}`,
				header: 'Customer'
			},
			{
				accessorKey: 'name',
				header: 'Name',
				filterVariant: 'text', // default
				size: 200
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				Cell: ({ cell }) =>
					cell.getValue().toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD'
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
							currency: 'USD'
						})
				}
			},
			{
				accessorKey: 'age',
				header: 'Age',
				filterVariant: 'range',
				filterFn: 'between',
				size: 80
			},
			{
				accessorKey: 'city',
				header: 'City',
				filterVariant: 'select',
				filterSelectOptions: citiesList
			},
			{
				accessorKey: 'state',
				header: 'State',
				filterVariant: 'multi-select',
				filterSelectOptions: usStateList // custom options list (as opposed to faceted list)
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.hireDate), // convert to date for sorting and filtering
				id: 'hireDate',
				header: 'Hire Date',
				filterVariant: 'date-range',
				Cell: ({ cell }) => cell.getValue().toLocaleDateString() // convert back to string for display
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.arrivalTime), // convert to date for sorting and filtering
				id: 'arrivalTime',
				header: 'Arrival Time',
				filterVariant: 'datetime-range',
				Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}` // convert back to string for display
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.departureTime), // convert to date for sorting and filtering
				id: 'departureTime',
				header: 'Departure Time',
				filterVariant: 'time-range',
				Cell: ({ cell }) => cell.getValue().toLocaleTimeString() // convert back to string for display
			},
			{
				id: 'total',
				accessorFn: (row) => `$${row.total}`,
				header: 'Total',
				size: 64
			},
			{ id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
			{
				id: 'status',
				accessorFn: (row) => <OrdersStatus name={row.status[0].name} />,
				accessorKey: 'status',
				header: 'Status'
			},
			{
				accessorKey: 'date',
				header: 'Date'
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-auto rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					columnResizeDirection: 'rtl',
					columnFilterDisplayMode: 'popover',
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					localization: { MRT_Localization_FA },
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				data={data || orders}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							// removeOrders([row.original.id]);
							// closeMenu();
							// table.resetRowSelection();
							alert('برو تو صفحه‌اش');
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
						</ListItemIcon>
						اطلاعات بیشتر
					</MenuItem>,
					<MenuItem
						key={1}
						onClick={() => {
							alert('برو تو صفحه‌اش');
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						حذف
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
							<span className="hidden sm:flex mx-8">حذف سطر‌های انتخاب شده</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default OrdersTable;
