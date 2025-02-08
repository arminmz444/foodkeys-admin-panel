/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from 'react';
import { Paper, MenuItem, ListItemIcon, Typography, TextField, CircularProgress } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useGetCompaniesQuery } from './CompaniesApi';

function CompaniesTable({ categoryId }) {
	const [search, setSearch] = useState('');
	const [rowSelection, setRowSelection] = useState(null);
	const [sorting, setSorting] = useState(null);
	const [filter, setFilter] = useState('');
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 15
	});
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(1);
	const {
		data: companies,
		isLoading,
		isError
	} = useGetCompaniesQuery({
		pageNumber: pagination?.pageIndex || 0,
		pageSize: pagination?.pageSize || 1,
		categoryId,
		search
	});

	const columns = useMemo(
		() => [
			{
				accessorKey: 'companyName',
				header: 'Company Name',
				Cell: ({ row }) => (
					<Typography
						component="span"
						className="font-bold"
					>
						{row.original.companyName}
					</Typography>
				)
			},
			{
				accessorKey: 'subCategory',
				header: 'Sub Category',
				Cell: ({ row }) => <Typography>{row.original.subCategory}</Typography>
			},
			{
				accessorKey: 'companyStatus',
				header: 'Status',
				Cell: ({ row }) => (
					<Typography color={row.original.companyStatus === 'PUBLISHED' ? 'green' : 'orange'}>
						{row.original.companyStatus}
					</Typography>
				)
			},
			{
				accessorKey: 'visit',
				header: 'Visits',
				Cell: ({ row }) => <Typography>{row.original.visit}</Typography>
			},
			{
				id: 'ranking',
				accessorFn: (row) => `${row.ranking}/${row.rankingAll}`,
				header: 'Ranking',
				Cell: ({ row }) => <Typography>{`${row.original.ranking}/${row.original.rankingAll}`}</Typography>
			}
		],
		[]
	);

	if (isLoading) return <CircularProgress />;

	if (isError) return <div>Error loading data</div>;

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<TextField
				label="Search"
				variant="outlined"
				fullWidth
				sx={{ mb: 2 }}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<DataTable
				// initialState={{
				// 	density: 'spacious',
				// 	showColumnFilters: false,
				// 	showGlobalFilter: true,
				// 	columnPinning: {
				// 		left: ['mrt-row-expand', 'mrt-row-select'],
				// 		right: ['mrt-row-actions']
				// 	},
				// 	pagination: {
				// 		pageIndex: 0,
				// 		pageSize: 20
				// 	}
				// }}
				data={companies?.data || []}
				columns={columns}
				getRowId={(originalRow) => originalRow.username}
				onPaginationChange={setPagination}
				// onRowSelectionChange={setRowSelection}
				// onSortingChange={setSorting}
				state={(pagination, rowSelection, sorting)}
				initialState={{
					pagination: {
						pageIndex: 0,
						pageSize: 1
					}
				}}
				manualPagination
				rowCount={companies?.pagination?.totalElements ?? 0}
				// onPaginationChange={({ pageIndex, pageSize: newPageSize }) => {
				// 	console.log(`Page index: ${  pageIndex  } and page size: ${  pageSize} and new page size = ${ newPageSize}`)
				// 	setPage(pageIndex);
				// 	setPageSize(newPageSize);
				// }}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
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
			/>
		</Paper>
	);
}

export default CompaniesTable;
