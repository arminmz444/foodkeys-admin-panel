import FuseScrollbars from "@fuse/core/FuseScrollbars/index.js";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/index.js";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import EntityStatusField from "app/shared-components/data-table/EntityStatusField.jsx";
import GenericCrudTable from "app/shared-components/data-table/GenericCrudTable.jsx";
import { API_STATIC_FILES_BASE_URL } from "app/store/apiService.js";
import { useMemo } from "react";
import { Link } from "react-router-dom";

function SubscriptionTable() {
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.featuredImageId,
				id: "featuredImageId",
				header: "لوگو شرکت",
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 150,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.logo ? (
							<img
								className="h-92 w-92 block rounded-full shadow-10 border"
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
				),
			},
			{
				accessorKey: "id",
				header: "شناسه شرکت",
				size: 160,
			},
			{
				accessorKey: "companyName",
				header: "نام شرکت",
				size: 200,
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
				),
			},

			{
				accessorKey: "subCategory",
				header: "نام بانک",
				size: 150,
			},
			{
				header: "وضعیت",
				accessorKey: "categoryStatus",
				editVariant: "select",
				size: 130,
				// editSelectOptions: categoryStatusSelectOptions,
				accessorFn: (row) =>
					row?.companyStatus == "VERIFIED" ? (
						<EntityStatusField
							name={row?.companyStatusFa}
							colorClsx="bg-green text-white"
						/>
					) : (
						<EntityStatusField
							name={row?.companyStatusFa}
							colorClsx="bg-red-700 text-white"
						/>
					),
			},
			{
				accessorKey: "createdAtStr",
				size: 150,
				Cell: ({ row }) => <div dir="rtl">{row.original.createdAtStr}</div>,
				header: "تاریخ شروع",
				enableEditing: false,
			},
			{
				accessorKey: "endAtStr",
				size: 150,
				Cell: ({ row }) => <div dir="rtl">{row.original.createdAtStr}</div>,
				header: "تاریخ پایان",
				enableEditing: false,
			},
		],
		[]
	);
	return (
		<div className="w-full max-w-screen flex flex-col">
			<FuseScrollbars className="grow overflow-x-auto">
				<Paper
					className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen"
					elevation={0}
				>
					<GenericCrudTable
						columns={columns}
						// useListQueryHook={useGetAllFoodIndustryCompaniesQuery}
						// useCreateMutationHook={useCreateCategoryMutation}
						// useUpdateMutationHook={useUpdateCategoryMutation}
						// useDeleteMutationHook={useDeleteCategoryMutation}
						saveToStore={false}
						enableRowAction={false}
						serviceIdentifier="foodCompanyList"
					/>
				</Paper>
			</FuseScrollbars>
		</div>
	);
}

export default SubscriptionTable;
