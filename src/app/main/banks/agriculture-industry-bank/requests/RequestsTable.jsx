/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import GenericCrudTable from 'app/shared-components/data-table/GenericCrudTable.jsx';
import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';
import EntityStatusField from 'app/shared-components/data-table/EntityStatusField.jsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import { PersonOffOutlined } from '@mui/icons-material';
import { z } from 'zod';
import { useGetAllAgricultureIndustryCompanyRequests } from '../AgricultureIndustryApi';
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation
} from '../../../category/CategoriesApi';

function RequestsTable() {
	const categoryStatusSelectOptionsMapper = {
		1: 'فعال',
		2: 'غیرفعال'
	};
	const categoryStatusSelectOptions = [...Object.values(categoryStatusSelectOptionsMapper)];
	const columns = React.useMemo(
		() => [
			{
				accessorFn: (row) => row.featuredImageId,
				id: 'featuredImageId',
				header: 'لوگو شرکت',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 150,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.companyLogo ? (
							<img
								className="w-full max-h-150 max-w-120 block rounded"
								src={API_STATIC_FILES_BASE_URL + row.original.companyLogo}
								alt={row.original.companyLogo}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.companyName}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'companyId',
				header: 'شناسه شرکت',
				size: 15
			},
			{
				accessorKey: 'companyName',
				header: 'نام شرکت',
				size: 250,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/banks/agriculture-industry/company/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.companyName}
					</Typography>
				)
			},
			{
				accessorKey: 'primaryBrand',
				header: 'برند تجاری اصلی شرکت',
				size: 250,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/banks/food-industry/company/${row.original.companyPrimaryBrand}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.companyPrimaryBrand}
					</Typography>
				)
			},
			{
				accessorKey: 'requestId',
				header: 'شناسه درخواست',
				Cell: ({ row }) => `FK_REQUEST_${row.original.requestId?.substring(0, 8)}`,

				size: 30
			},
			{
				accessorKey: 'requestTypeFa',
				header: 'نوع درخواست',
				size: 100
			},
			{
				header: 'وضعیت',
				accessorKey: 'categoryStatus',
				editVariant: 'select',
				// editSelectOptions: categoryStatusSelectOptions,
				accessorFn: (row) =>
					row?.companyStatus === 'VERIFIED' ? (
						<EntityStatusField
							name={row?.companyStatusFa}
							colorClsx="bg-green text-white"
						/>
					) : (
						<EntityStatusField
							name={row?.companyStatusFa}
							colorClsx="bg-red-700 text-white"
						/>
					)
			}
		],
		[]
	);

	const rowActions = [
		{
			icon: <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>,
			label: 'زیرمجموعه‌ها',
			onClick: async (row, table, refetchList) => {
				// show subcategories modal or do something
				alert(`Show sub-items for: ${row.original.name}`);
				refetchList();
			}
		},
		{
			icon: <PersonOffOutlined />,
			label: 'غیرفعال کردن',
			onClick: async (row, table, refetchList) => {
				// call your disable API
				alert(`Disable: ${row.original.name}`);
				// e.g. await useDisableCategoryMutation(row.original.id);
				refetchList();
			}
		}
	];
	const createItemProps = {}
	// const createItemProps = {
	// 	zodSchema: z.object({
	// 		name: z.string().min(1),
	// 		nameEn: z.string().min(1),
	// 		categoryStatus: z.string(), // { message: 'وضعیت را انتخاب کنید' }).categoryStatusSelectOptionsMapper.keys,
	// 		// description: z.string().optional(),
	// 		pageOrder: z.string()
	// 	}),
	// 	defaultValues: { name: '', nameEn: '', categoryStatus: 0, pageOrder: 0 },
	// 	formFieldsInputTypes: {
	// 		name: {
	// 			label: 'نام',
	// 			inputType: 'TextField',
	// 			renderCustomInput: false,
	// 			classes: 'mt-10',
	// 			styles: null,
	// 			props: {
	// 				fullWidth: true
	// 			}
	// 		},
	// 		nameEn: {
	// 			label: 'نام انگلیسی',
	// 			inputType: 'TextField',
	// 			renderCustomInput: false,
	// 			classes: 'mt-10',
	// 			styles: null,
	// 			props: {
	// 				fullWidth: true
	// 			}
	// 		},
	// 		categoryStatus: {
	// 			label: 'وضعیت',
	// 			inputType: 'Select',
	// 			renderCustomInput: false,
	// 			classes: 'mt-10',
	// 			styles: null,
	// 			props: {
	// 				fullWidth: true
	// 			}
	// 		},
	// 		// description: {
	// 		// 	label: "توضیحات",
	// 		// 	inputType: "TextField",
	// 		// 	renderCustomInput: false,
	// 		// 	classes: "mt-10",
	// 		// 	styles: null,
	// 		// 	props: {
	// 		// 		fullWidth: true,
	// 		// 	}
	// 		// },
	// 		pageOrder: {
	// 			label: 'ترتیب صفحه',
	// 			inputType: 'TextField',
	// 			renderCustomInput: false,
	// 			classes: 'mt-10',
	// 			styles: null,
	// 			props: {
	// 				fullWidth: true
	// 			}
	// 		}
	// 	},
	// 	onCreate: async (vals) => {
	// 		// call your createCategory
	// 		// e.g. await createCategory(vals).unwrap();
	// 		// useCreateCategoryMutation(vals)
	// 		alert(`Create: ${JSON.stringify(vals)}`);
	// 	},
	// 	buttonLabel: 'افزودن درخواست جدید',
	// 	dialogTitle: 'ایجاد درخواست جدید'
	// };
	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="grow overflow-x-auto">
				<Paper
					className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen p-24"
					elevation={0}
				>
					<GenericCrudTable
						columns={columns}
						useListQueryHook={useGetAllAgricultureIndustryCompanyRequests}
						useCreateMutationHook={useCreateCategoryMutation}
						useUpdateMutationHook={useUpdateCategoryMutation}
						useDeleteMutationHook={useDeleteCategoryMutation}
						rowActions={rowActions}
						saveToStore={false}
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
				</Paper>
			</FuseScrollbars>
		</div>
	);
}

export default RequestsTable;
