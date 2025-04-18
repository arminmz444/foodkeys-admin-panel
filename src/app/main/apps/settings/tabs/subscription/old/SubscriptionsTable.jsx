// /* eslint-disable react/no-unstable-nested-components */
// import { Paper } from '@mui/material';
// import GenericCrudTable from 'app/shared-components/data-table/GenericCrudTable.jsx';
// import EntityStatusField from 'app/shared-components/data-table/EntityStatusField.jsx';
// import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
// import {
// 	useCreateCategoryMutation,
// 	useDeleteCategoryMutation,
// 	// useDeleteECommerceOrdersMutation,
// 	useGetCategoriesQuery,
// 	useUpdateCategoryMutation
// } from './CategoriesApi.js';
// import { setCategories } from './subscriptionSlice.js';
//
// function CategoriesTable() {
// 	// const [removeOrders] = useDeleteECommerceOrdersMutation();
// 	// const columns = useMemo(
// 	// 	() => [
// 	// 		{
// 	// 			accessorKey: 'id',
// 	// 			header: 'Id',
// 	// 			size: 64
// 	// 		},
// 	// 		{
// 	// 			accessorKey: 'reference',
// 	// 			header: 'Reference',
// 	// 			size: 64,
// 	// 			Cell: ({ row }) => (
// 	// 				<Typography
// 	// 					component={Link}
// 	// 					to={`/apps/e-commerce/orders/${row.original.id}`}
// 	// 					className="underline"
// 	// 					color="secondary"
// 	// 					role="button"
// 	// 				>
// 	// 					{row.original.reference}
// 	// 				</Typography>
// 	// 			)
// 	// 		},
// 	// 		{
// 	// 			id: 'customer',
// 	// 			accessorFn: (row) => `${row.customer.firstName} ${row.customer.lastName}`,
// 	// 			header: 'Customer'
// 	// 		},
// 	// 		{
// 	// 			id: 'total',
// 	// 			accessorFn: (row) => `$${row.total}`,
// 	// 			header: 'Total',
// 	// 			size: 64
// 	// 		},
// 	// 		{ id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
// 	// 		{
// 	// 			id: 'status',
// 	// 			accessorFn: (row) => <OrdersStatus name={row.status[0].name} />,
// 	// 			accessorKey: 'status',
// 	// 			header: 'Status'
// 	// 		},
// 	// 		{
// 	// 			accessorKey: 'date',
// 	// 			header: 'Date'
// 	// 		}
// 	// 	],
// 	// 	[]
// 	// );
//
// 	const subscriptionStatusSelectOptionsMapper = {
// 		1: 'فعال',
// 		2: 'غیرفعال'
// 	};
// 	const subscriptionStatusSelectOptions = [...Object.values(subscriptionStatusSelectOptionsMapper)];
// 	const columns = [
// 		{
// 			accessorKey: 'id',
// 			header: 'شناسه',
// 			size: 32
// 		},
// 		{
// 			header: 'نام دسته بندی',
// 			accessorKey: 'name'
// 		},
// 		{
// 			header: 'نام انگلیسی',
// 			accessorKey: 'nameEn'
// 		},
// 		{
// 			header: 'وضعیت',
// 			accessorKey: 'subscriptionStatus',
// 			editVariant: 'select',
// 			editSelectOptions: subscriptionStatusSelectOptions,
// 			accessorFn: (row) =>
// 				row?.subscriptionStatus == 1 ? (
// 					<EntityStatusField
// 						name="فعال"
// 						colorClsx="bg-green text-white"
// 					/>
// 				) : (
// 					<EntityStatusField
// 						name="غیرفعال"
// 						colorClsx="bg-red-700 text-white"
// 					/>
// 				)
// 		},
// 		{
// 			header: 'ترتیب صفحه',
// 			accessorKey: 'pageOrder'
// 		},
// 		{
// 			header: 'تعداد زیرمجموعه‌ها',
// 			accessorKey: 'subCategoryCount'
// 		},
// 		{
// 			header: 'تعداد شرکت‌ها',
// 			accessorKey: 'companyCount'
// 		},
// 		{
// 			header: 'تعداد صنایع',
// 			accessorKey: 'industryCount'
// 		},
// 		{
// 			header: 'تعداد بازدید',
// 			accessorKey: 'visitCount'
// 		},
// 		{
// 			header: 'تاریخ ایجاد',
// 			accessorKey: 'createdAtStr',
// 			Cell: ({ value }) => value || '—' // Handle null values
// 		},
// 		{
// 			header: 'آخرین بروزرسانی',
// 			accessorKey: 'updatedAtStr',
// 			Cell: ({ value }) => value || '—'
// 		}
// 	];
//
// 	return (
// 		<div className="w-full flex flex-col">
// 			<FuseScrollbars className="grow overflow-x-auto">
// 				<Paper
// 					className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen p-24"
// 					elevation={0}
// 				>
// 					<GenericCrudTable
// 						columns={columns}
// 						useListQueryHook={useGetCategoriesQuery}
// 						useCreateMutationHook={useCreateCategoryMutation}
// 						useUpdateMutationHook={useUpdateCategoryMutation}
// 						useDeleteMutationHook={useDeleteCategoryMutation}
// 						saveToStore
// 						storeDataAction={setCategories}
// 						enableRowAction={false}
// 					/>
// 					{/* <DataTable */}
// 					{/*	initialState={{ */}
// 					{/*		density: 'spacious', */}
// 					{/*		showColumnFilters: false, */}
// 					{/*		showGlobalFilter: true, */}
// 					{/*		columnPinning: { */}
// 					{/*			left: ['mrt-row-expand', 'mrt-row-select'], */}
// 					{/*			right: ['mrt-row-actions'] */}
// 					{/*		}, */}
// 					{/*		pagination: { */}
// 					{/*			pageIndex: 0, */}
// 					{/*			pageSize: 10 */}
// 					{/*		} */}
// 					{/*	}} */}
// 					{/*	data={orders} */}
// 					{/*	columns={columns} */}
// 					{/*	renderRowActionMenuItems={({ closeMenu, row, table }) => [ */}
// 					{/*		<MenuItem */}
// 					{/*			key={0} */}
// 					{/*			onClick={() => { */}
// 					{/*				removeOrders([row.original.id]); */}
// 					{/*				closeMenu(); */}
// 					{/*				table.resetRowSelection(); */}
// 					{/*			}} */}
// 					{/*		> */}
// 					{/*			<ListItemIcon> */}
// 					{/*				<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon> */}
// 					{/*			</ListItemIcon> */}
// 					{/*			حذف */}
// 					{/*		</MenuItem> */}
// 					{/*	]} */}
// 					{/*	renderTopToolbarCustomActions={({ table }) => { */}
// 					{/*		const { rowSelection } = table.getState(); */}
//
// 					{/*		if (Object.keys(rowSelection).length === 0) { */}
// 					{/*			return null; */}
// 					{/*		} */}
//
// 					{/*		return ( */}
// 					{/*			<Button */}
// 					{/*				variant="contained" */}
// 					{/*				size="small" */}
// 					{/*				onClick={() => { */}
// 					{/*					const selectedRows = table.getSelectedRowModel().rows; */}
// 					{/*					removeOrders(selectedRows.map((row) => row.original.id)); */}
// 					{/*					table.resetRowSelection(); */}
// 					{/*				}} */}
// 					{/*				className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8" */}
// 					{/*				color="secondary" */}
// 					{/*			> */}
// 					{/*				<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon> */}
// 					{/*				<span className="hidden sm:flex mx-8">Delete selected items</span> */}
// 					{/*			</Button> */}
// 					{/*		); */}
// 					{/*	}} */}
// 					{/* /> */}
// 				</Paper>
// 			</FuseScrollbars>
// 		</div>
// 	);
// }
//
// export default CategoriesTable;
// CategoryTable.jsx (Example usage)
import React from 'react';
import { z } from 'zod';
import EntityStatusField from 'app/shared-components/data-table/EntityStatusField.jsx';

import { WebAssetOffOutlined } from '@mui/icons-material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import CustomUniformsLongTextField from 'app/shared-components/dynamic-field-generator/CustomUniformsLongTextField.jsx';
import {
	useGetSubscriptionsQuery,
	useCreateSubscriptionMutation,
	useUpdateSubscriptionMutation,
	useDeleteSubscriptionMutation
} from './SubscriptionsApi.js';
import GenericCrudTable from '../../../shared-components/data-table/GenericCrudTable';

function SubscriptionTable() {
	const subscriptionStatusSelectOptions = [
		{ label: 'فعال', value: 'ACTIVE' },
		{ label: 'غیرفعال', value: 'INACTIVE' }
	];

	const columns = React.useMemo(
		() => [
			{ accessorKey: 'id', header: 'شناسه', size: 130, enableEditing: false },
			{ accessorKey: 'title', header: 'عنوان', size: 300 },
			{ accessorKey: 'description', header: 'توضیحات', size: 200 },
			{
				accessorKey: 'timeDuration',
				header: 'مدت زمان (ماه)',
				size: 200,
				muiTableBodyCellEditTextFieldProps: { type: 'number' }
			},
			{
				accessorKey: 'price',
				header: 'قیمت (تومان)',
				size: 200,
				muiTableBodyCellEditTextFieldProps: { type: 'number' }
			},
			{
				header: 'وضعیت',
				accessorKey: 'status',
				editVariant: 'select',
				editSelectOptions: subscriptionStatusSelectOptions,
				muiEditTextFieldProps: { select: true },
				accessorFn: (row) =>
					row?.status === 'ACTIVE' ? (
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
			{ accessorKey: 'subCategoryName', size: 300, header: 'نام زیر دسته', enableEditing: false },
			{ accessorKey: 'subCategoryNameEn', size: 280, header: 'نام انگلیسی زیر دسته', enableEditing: false },
			{ accessorKey: 'features', header: 'ویژگی‌ها', size: 400 },
			{
				accessorKey: 'createdAtStr',
				size: 200,
				Cell: ({ row }) => <div dir="rtl">{row.original.createdAtStr}</div>,
				header: 'تاریخ ایجاد',
				enableEditing: false
			},
			{
				accessorKey: 'updatedAtStr',
				size: 200,
				Cell: ({ row }) => <div dir="rtl">{row.original.createdAtStr}</div>,
				header: 'آخرین بروزرسانی',
				enableEditing: false
			}
		],
		[]
	);

	const zodSchema = z.object({
		zodSchema: z.object({
			title: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'این فیلد الزامی است' })
				.uniforms({
					displayName: 'عنوان',
					label: 'عنوان پلن',
					placeholder: 'عنوان پلن را وارد کنید'
				}),
			timeDuration: z
				.number({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'مدت زمان باید حداقل 1 ماه باشد' })
				.uniforms({
					displayName: 'مدت زمان',
					label: 'مدت زمان پلن (برحسب ماه)',
					placeholder: 'مدت زمان پلن را وارد کنید'
				}),
			price: z
				.number({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
				.uniforms({
					displayName: 'قیمت',
					label: 'قیمت پلن',
					placeholder: 'قیمت پلن را وارد کنید'
				}),
			status: z
				.enum(['فعال', 'غیرفعال'], {
					required_error: 'این فیلد الزامی است',
					invalid_type_error: 'فرمت داده ورودی اشتباه است',
					message: 'مقدار انتخاب شده معتبر نیست'
				})
				.uniforms({
					displayName: 'وضعیت پلن',
					label: 'وضعیت پلن',
					placeholder: 'وضعیت پلن را انتخاب کنید'
				}),
			features: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'این فیلد الزامی است' })
				.uniforms({
					displayName: 'متن ویژگی',
					label: 'متن ویژگی‌های پلن',
					placeholder: 'متن ویژگی‌های پلن را وارد کنید'
				})
				.optional(),
			description: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'این فیلد الزامی است' })
				.uniforms({
					displayName: 'توضیحات',
					label: 'توضیحات پلن',
					placeholder: 'توضیحات پلن را وارد کنید'
				})
		})
		// description: z.string().min(1, { message: 'توضیحات الزامی است' }).uniforms(CustomUniformsLongTextField)
	});

	const createItemProps = {
		zodSchema: z.object({
			title: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'این فیلد الزامی است' })
				.uniforms({
					displayName: 'عنوان',
					label: 'عنوان پلن',
					placeholder: 'عنوان پلن را وارد کنید'
				}),
			timeDuration: z
				.number({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'مدت زمان باید حداقل 1 ماه باشد' })
				.uniforms({
					displayName: 'مدت زمان',
					label: 'مدت زمان پلن (برحسب ماه)',
					placeholder: 'مدت زمان پلن را وارد کنید'
				}),
			price: z
				.number({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
				.uniforms({
					displayName: 'قیمت',
					label: 'قیمت پلن',
					placeholder: 'قیمت پلن را وارد کنید'
				}),
			status: z
				.enum(['فعال', 'غیرفعال'], {
					required_error: 'این فیلد الزامی است',
					invalid_type_error: 'فرمت داده ورودی اشتباه است',
					message: 'مقدار انتخاب شده معتبر نیست'
				})
				.uniforms({
					displayName: 'وضعیت پلن',
					label: 'وضعیت پلن',
					placeholder: 'وضعیت پلن را انتخاب کنید'
				}),
			features: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.optional()
				.uniforms({
					displayName: 'متن ویژگی',
					label: 'متن ویژگی‌های پلن',
					placeholder: 'متن ویژگی‌های پلن را وارد کنید',
					component: CustomUniformsLongTextField
				}),
			description: z
				.string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
				.min(1, { message: 'این فیلد الزامی است' })
				.uniforms({
					displayName: 'توضیحات',
					label: 'توضیحات پلن',
					placeholder: 'توضیحات پلن را وارد کنید',
					component: CustomUniformsLongTextField
				})
		}),
		// description: z.string().min(1, { message: 'توضیحات الزامی است' }).uniforms(CustomUniformsLongTextField)
		jsonSchema: {
			title: 'پلن جدید',
			type: 'object',
			properties: {
				title: { type: 'string', title: 'عنوان' },
				timeDuration: { type: 'number', title: 'مدت زمان (ماه)', minimum: 1 },
				price: { type: 'number', title: 'قیمت (تومان)', minimum: 0 },
				status: {
					type: 'string',
					title: 'وضعیت',
					enum: ['ACTIVE', 'INACTIVE']
				},
				features: { type: 'string', title: 'ویژگی‌ها', description: 'ویژگی‌های پلن را وارد کنید' },
				description: { type: 'string', title: 'توضیحات' }
			},
			required: ['title', 'timeDuration', 'price', 'status', 'description']
		},
		formHeaderTitle: 'افزودن پلن جدید',
		defaultValues: { title: '', timeDuration: 1, price: 0, status: 'فعال', features: '', description: '' },
		onCreate: async (vals) => {
			alert(`ایجاد پلن جدید: ${JSON.stringify(vals)}`);
		},
		buttonLabel: 'افزودن پلن جدید',
		dialogTitle: 'ایجاد پلن جدید',
		formEngine: 'UNIFORMS',
		formValidationStruct: 'ZOD_SCHEMA',
		formGenerationType: 'MANUAL',
		formFieldsInputTypes: {
			title: 1,
			timeDuration: 3,
			price: 4,
			status: 5,
			features: 32,
			description: 2
		},
		hideSubmitField: false
	};
	const rowActions = [
		{
			icon: <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>,
			label: 'اشتراک‌ها',
			onClick: async (row, table, refetchList) => {
				alert(`Show sub-items for: ${row.original.name}`);
				refetchList();
			}
		},
		{
			icon: <WebAssetOffOutlined />,
			label: 'غیرفعال کردن',
			onClick: async (row, table, refetchList) => {
				// call your disable API
				alert(`Disable: ${row.original.name}`);
				// e.g. await useDisableCategoryMutation(row.original.id);
				refetchList();
			}
		}
	];

	return (
		<GenericCrudTable
			columns={columns}
			useListQueryHook={useGetSubscriptionsQuery} // listing
			useCreateMutationHook={useCreateSubscriptionMutation} // create
			useUpdateMutationHook={useUpdateSubscriptionMutation} // update
			useDeleteMutationHook={useDeleteSubscriptionMutation} // delete
			rowActions={rowActions}
			createItemProps={createItemProps}
			renderTopToolbarCustomActionsClasses="flex justify-start px-8 py-16"
			renderTopToolbarCustomActions={() => (
				// <Button
				// 	color="primary"
				// 	className="p-16"
				// 	variant="contained"
				// 	onClick={() => {
				// 		table.setCreatingRow(true); // simplest way to open the create row modal with no default values
				// 		// or you can pass in a row object to set default values with the `createRow` helper function
				// 		// table.setCreatingRow(
				// 		//   createRow(table, {
				// 		//     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
				// 		//   }),
				// 		// );
				// 	}}
				// >
				// 	Create New User
				// </Button>
				<div />
			)}
		/>
	);
}

export default SubscriptionTable;
