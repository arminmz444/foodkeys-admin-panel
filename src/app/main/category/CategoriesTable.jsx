/* eslint-disable react/no-unstable-nested-components */
import { Paper } from '@mui/material';
import GenericCrudTable from 'app/shared-components/data-table/GenericCrudTable.jsx';
import EntityStatusField from 'app/shared-components/data-table/EntityStatusField.jsx';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	// useDeleteECommerceOrdersMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation
} from './CategoriesApi.js';
import { setCategories } from './categorySlice.js';

function CategoriesTable() {
	// const [removeOrders] = useDeleteECommerceOrdersMutation();
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

	const categoryStatusSelectOptionsMapper = {
		1: 'فعال',
		2: 'غیرفعال'
	};
	const categoryStatusSelectOptions = [...Object.values(categoryStatusSelectOptionsMapper)];
	const columns = [
		{
			accessorKey: 'id',
			header: 'شناسه',
			size: 32
		},
		{
			header: 'نام دسته بندی',
			accessorKey: 'name'
		},
		{
			header: 'نام انگلیسی',
			accessorKey: 'nameEn'
		},
		{
			header: 'وضعیت',
			accessorKey: 'categoryStatus',
			editVariant: 'select',
			editSelectOptions: categoryStatusSelectOptions,
			accessorFn: (row) =>
				row?.categoryStatus == 1 ? (
					<EntityStatusField
						name="فعال"
						colorClsx="bg-green text-white"
					/>
				) : (
					<EntityStatusField
						name="غیرفعال"
						colorClsx="bg-red-700 text-white"
					/>
				)
		},
		{
			header: 'ترتیب صفحه',
			accessorKey: 'pageOrder'
		},
		{
			header: 'تعداد زیرمجموعه‌ها',
			accessorKey: 'subCategoryCount'
		},
		{
			header: 'تعداد شرکت‌ها',
			accessorKey: 'companyCount'
		},
		{
			header: 'تعداد صنایع',
			accessorKey: 'industryCount'
		},
		{
			header: 'تعداد بازدید',
			accessorKey: 'visitCount'
		},
		{
			header: 'تاریخ ایجاد',
			accessorKey: 'createdAtStr',
			Cell: ({ value }) => value || '—' // Handle null values
		},
		{
			header: 'آخرین بروزرسانی',
			accessorKey: 'updatedAtStr',
			Cell: ({ value }) => value || '—'
		}
	];

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="grow overflow-x-auto">
				<Paper
					className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen p-24"
					elevation={0}
				>
					<GenericCrudTable
						columns={columns}
						useListQueryHook={useGetCategoriesQuery}
						useCreateMutationHook={useCreateCategoryMutation}
						useUpdateMutationHook={useUpdateCategoryMutation}
						useDeleteMutationHook={useDeleteCategoryMutation}
						saveToStore
						storeDataAction={setCategories}
						enableRowAction={false}
					/>
					{/* <DataTable */}
					{/*	initialState={{ */}
					{/*		density: 'spacious', */}
					{/*		showColumnFilters: false, */}
					{/*		showGlobalFilter: true, */}
					{/*		columnPinning: { */}
					{/*			left: ['mrt-row-expand', 'mrt-row-select'], */}
					{/*			right: ['mrt-row-actions'] */}
					{/*		}, */}
					{/*		pagination: { */}
					{/*			pageIndex: 0, */}
					{/*			pageSize: 10 */}
					{/*		} */}
					{/*	}} */}
					{/*	data={orders} */}
					{/*	columns={columns} */}
					{/*	renderRowActionMenuItems={({ closeMenu, row, table }) => [ */}
					{/*		<MenuItem */}
					{/*			key={0} */}
					{/*			onClick={() => { */}
					{/*				removeOrders([row.original.id]); */}
					{/*				closeMenu(); */}
					{/*				table.resetRowSelection(); */}
					{/*			}} */}
					{/*		> */}
					{/*			<ListItemIcon> */}
					{/*				<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon> */}
					{/*			</ListItemIcon> */}
					{/*			حذف */}
					{/*		</MenuItem> */}
					{/*	]} */}
					{/*	renderTopToolbarCustomActions={({ table }) => { */}
					{/*		const { rowSelection } = table.getState(); */}

					{/*		if (Object.keys(rowSelection).length === 0) { */}
					{/*			return null; */}
					{/*		} */}

					{/*		return ( */}
					{/*			<Button */}
					{/*				variant="contained" */}
					{/*				size="small" */}
					{/*				onClick={() => { */}
					{/*					const selectedRows = table.getSelectedRowModel().rows; */}
					{/*					removeOrders(selectedRows.map((row) => row.original.id)); */}
					{/*					table.resetRowSelection(); */}
					{/*				}} */}
					{/*				className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8" */}
					{/*				color="secondary" */}
					{/*			> */}
					{/*				<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon> */}
					{/*				<span className="hidden sm:flex mx-8">Delete selected items</span> */}
					{/*			</Button> */}
					{/*		); */}
					{/*	}} */}
					{/* /> */}
				</Paper>
			</FuseScrollbars>
		</div>
	);
}

export default CategoriesTable;
