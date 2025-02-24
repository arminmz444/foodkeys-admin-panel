/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import GenericCrudTable from 'app/shared-components/data-table/GenericCrudTable.jsx';
import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';
import EntityStatusField from 'app/shared-components/data-table/EntityStatusField.jsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import { useGetAllFoodIndustryCompaniesQuery } from '../FoodIndustryBankApi';
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation
} from '../../../category/CategoriesApi';

function CompaniesTable() {
	const columns = useMemo(
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
						{row.original?.logo ? (
							<img
								className="w-full max-h-150 max-w-120 block rounded"
								src={API_STATIC_FILES_BASE_URL + row.original.logo}
								alt={row.original.companyName}
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
				accessorKey: 'id',
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
						to={`/banks/food-industry/company/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.companyName}
					</Typography>
				)
			},
			{
				accessorKey: 'category',
				header: 'دسته‌بندی'
			},
			{
				accessorKey: 'subCategory',
				header: 'زیرشاخه',
				size: 300
			},
			{
				header: 'وضعیت',
				accessorKey: 'categoryStatus',
				editVariant: 'select',
				// editSelectOptions: categoryStatusSelectOptions,
				accessorFn: (row) =>
					row?.companyStatus == 'VERIFIED' ? (
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
			},
			{
				accessorKey: 'visit',
				header: 'بازدید‌ها',
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row?.original?.visit > 0 ? (
							<span className="flex flex-row">
								{row?.original?.visit}
								<FuseSvgIcon
									className="text-green ms-4"
									size={20}
								>
									heroicons-outline:plus-circle
								</FuseSvgIcon>
							</span>
						) : (
							<span className="flex flex-row">
								{row?.original?.visit}
								<FuseSvgIcon
									className="text-red ms-4"
									size={20}
								>
									heroicons-outline:minus-circle
								</FuseSvgIcon>
							</span>
						)}
					</div>
				)
			},
			{
				accessorFn: (row) => row?.companyType?.name,
				accessorKey: 'companyType',
				header: 'نوع شرکت',
				size: 180
			},
		],
		[]
	);
	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="grow overflow-x-auto">
				<Paper
					className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen p-24"
					elevation={0}
				>
					<GenericCrudTable
						columns={columns}
						useListQueryHook={useGetAllFoodIndustryCompaniesQuery}
						useCreateMutationHook={useCreateCategoryMutation}
						useUpdateMutationHook={useUpdateCategoryMutation}
						useDeleteMutationHook={useDeleteCategoryMutation}
						saveToStore={false}
						enableRowAction={false}
						enableEditing={false}
						serviceIdentifier="foodCompanyList"
					/>
				</Paper>
			</FuseScrollbars>
		</div>
	);
}

export default CompaniesTable;
