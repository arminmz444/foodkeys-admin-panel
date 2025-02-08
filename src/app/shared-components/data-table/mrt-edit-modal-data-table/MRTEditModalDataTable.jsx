import { lazy, useState } from 'react';
import { MaterialReactTable, MRT_EditActionButtons, useMaterialReactTable } from 'material-react-table';
import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import {
	keepPreviousData,
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import axios from 'axios';
import DataTableTopToolbar from 'app/shared-components/data-table/DataTableTopToolbar.jsx';
import DataTableBottomToolbar from 'app/shared-components/data-table/DataTableBottomToolbar.jsx';
import Button from '@mui/material/Button';
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice.js';
import { useDispatch } from 'react-redux';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';

// Some mock/fake data
const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA']; // etc...
const fakeData = [
	{ id: '1', firstName: 'آرمین', lastName: 'مظفری', email: 'john@example.com', state: 'CA' },
	{ id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', state: 'AZ' }
	// ... more data
];
// const defaultColumns = useMemo(
// 	() => [
const defaultColumns = [
	{
		accessorKey: 'id',
		header: 'شناسه کاربر',
		enableEditing: false,
		size: 80
	},
	{
		accessorKey: 'firstName',
		header: 'نام',
		muiEditTextFieldProps: {
			required: true
			// error: !!validationErrors?.firstName,
			// helperText: validationErrors?.firstName,
			// onFocus: () =>
			// 	setValidationErrors({
			// 		...validationErrors,
			// 		firstName: undefined
			// 	})
		}
	},
	{
		accessorKey: 'lastName',
		header: 'نام خانوادگی',
		muiEditTextFieldProps: {
			required: true
			// error: !!validationErrors?.lastName,
			// helperText: validationErrors?.lastName,
			// onFocus: () =>
			// 	setValidationErrors({
			// 		...validationErrors,
			// 		lastName: undefined
			// 	})
		}
	},
	{
		accessorKey: 'username',
		header: 'نام کاربری',
		muiEditTextFieldProps: {
			type: 'username',
			required: true
			// error: !!validationErrors?.username,
			// helperText: validationErrors?.username,
			// onFocus: () =>
			// 	setValidationErrors({
			// 		...validationErrors,
			// 		username: undefined
			// 	})
		}
	},
	// {
	// 	accessorFn: (row) => new Date(row.lastLogin),
	// 	id: 'lastLogin',
	// 	header: 'Last Login',
	// 	Cell: ({ cell }) => new Date(cell.getValue<Date>()).toLocaleString(),
	// 	filterFn: 'greaterThan',
	// 	filterVariant: 'date',
	// 	enableGlobalFilter: false,
	// },
	{
		accessorKey: 'email',
		header: 'ایمیل',
		muiEditTextFieldProps: {
			type: 'email',
			required: true
			// error: !!validationErrors?.email,
			// helperText: validationErrors?.email,
			// onFocus: () =>
			// 	setValidationErrors({
			// 		...validationErrors,
			// 		email: undefined
			// 	})
		}
	},
	{
		accessorKey: 'state',
		header: 'استان',
		editVariant: 'select',
		editSelectOptions: usStates
		// muiEditTextFieldProps: {
		// 	select: true,
		// 	error: !!validationErrors?.state,
		// 	helperText: validationErrors?.state
		// }
	}
];
// []
// [validationErrors]
// );

function MRTEditModalDataTableComponent({
	columns,
	queryKey,
	fetchFn,
	createFn,
	updateFn,
	deleteFn,
	localization = MRT_Localization_FA,
	defaultPageSize = 10,
	tableTitleCreate = 'ثبت',
	tableTitleEdit = 'ویرایش',
	OperationsSection = null,
	tableTitle = null
}) {
	const dispatch = useDispatch();
	const [validationErrors, setValidationErrors] = useState({});
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [totalPages, setTotalPages] = useState(0);
	// READ hook
	const { data, isError, isFetching: isRefetching, isLoading } = useGetUsers();

	function useGetUsers() {
		// return useQuery({
		// 	queryKey: ['users'],
		// 	queryFn: async () => {
		// 		const data = useGetUsersListQuery();
		// 		// await new Promise((resolve) => setTimeout(resolve, 1000));
		// 		return data?.data || [];
		// 	},
		// 	refetchOnWindowFocus: false
		const {
			data: { data = [] } = {},
			isError,
			isRefetching,
			isLoading,
			refetch
		} = useQuery({
			queryKey: [
				'users-list',
				{
					columnFilters,
					globalFilter,
					pagination,
					sorting
				}
			],
			queryFn: async () => {
				// const fetchURL = new URL('/users/', API_BASE_URL);
				//
				// fetchURL.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
				// fetchURL.searchParams.set('size', `${pagination.pageSize}`);
				// fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
				// fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
				// fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

				const data = await axios.get('/user/');

				setPagination({ pageSize: data?.pagination?.pageSize, pageIndex: data?.pagination?.pageNumber });
				setTotalPages(data?.pagination?.totalPages);
				return data?.data || [];
			},
			placeholderData: keepPreviousData
		});
		return { data, isError, isRefetching, isLoading, refetch };
	}

	// CREATE hook
	const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();

	// UPDATE hook
	const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
	// DELETE hook
	const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

	// CREATE action
	const handleCreateUser = async ({ values, table }) => {
		const newValidationErrors = validateUser(values);

		if (Object.values(newValidationErrors).some((error) => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}

		setValidationErrors({});
		await createUser(values);
		table.setCreatingRow(null);
	};

	// UPDATE action
	const handleSaveUser = async ({ values, table }) => {
		const newValidationErrors = validateUser(values);

		if (Object.values(newValidationErrors).some((error) => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}

		setValidationErrors({});
		await updateUser(values);
		table.setEditingRow(null);
	};

	// DELETE action
	const openDeleteConfirmModal = (row) => {
		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle id="alert-dialog-title">Use Google's location service?</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Let Google help apps determine location. This means sending anonymous location data to
								Google, even when no apps are running.
							</DialogContentText>
						</DialogContent>
						<DialogActions sx={{ p: 2 }}>
							<Button
								onClick={() => dispatch(closeDialog())}
								color="primary"
								autoFocus
							>
								لغو
							</Button>
							<Button
								onClick={() => dispatch(closeDialog())}
								color="error"
								variant="contained"
							>
								حذف
							</Button>
						</DialogActions>
					</>
				)
			})
		);

		// if () {
		// 	deleteUser(row.original.id);
		// }
	};

	const table = useMaterialReactTable({
		columns,
		data,
		localization,
		initialState: { showColumnFilters: true },
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		// displayColumnDefOptions: {
		// 	'mrt-row-actions': {
		// 		header: 'Edit',
		// 		size: 120,
		// 		MuiDialog: ({ row, table }) => <Button onClick={() => table.setEditingRow(row)}>ویرایش</Button>
		// 	}
		// },
		renderTopToolbarCustomActions: () => (
			<Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
				{tableTitle ? <Typography variant="h4">{tableTitle}</Typography> : <></>}
				<Tooltip
					arrow
					title="دریافت مجدد اطلاعات"
				>
					<IconButton onClick={() => console.log('ReFetching')}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				<Button
					color="secondary"
					onClick={() => {
						alert('Create New Account');
					}}
					variant="contained"
				>
					ثبت کاربر جدید
				</Button>
				{true ? (
					<></>
				) : (
					<Button
						color="error"
						disabled={!table.getIsSomeRowsSelected()}
						onClick={() => {
							alert('Delete Selected Accounts');
						}}
						variant="contained"
					>
						حذف
					</Button>
				)}
			</Box>
		),
		pageCount: pagination?.totalPages ?? 0,
		// rowCount: pagination?.totalElements ?? 0,

		muiTableBodyRowProps: ({ row, table }) => {
			const { density } = table.getState();

			if (density === 'compact') {
				return {
					sx: {
						backgroundColor: 'initial',
						opacity: 1,
						boxShadow: 'none',
						height: row.getIsPinned() ? `${37}px` : undefined
					}
				};
			}

			return {
				sx: {
					backgroundColor: 'initial',
					opacity: 1,
					boxShadow: 'none',
					height: row.getIsPinned() ? `${density === 'comfortable' ? 53 : 69}px` : undefined
				}
			};
		},
		muiTableHeadCellProps: ({ column }) => ({
			sx: {
				textAlign: 'left',
				direction: 'ltr',
				'& .Mui-TableHeadCell-Content-Labels': {
					flex: 1,
					justifyContent: 'space-between'
				},
				'& .Mui-TableHeadCell-Content-Actions': {},
				'& .MuiFormHelperText-root': {
					textAlign: 'center',
					marginX: 0,
					color: (theme) => theme.palette.text.disabled,
					fontSize: 11
				},

				backgroundColor: (theme) => (column.getIsPinned() ? theme.palette.background.paper : 'inherit')
			}
		}),
		muiTableBodyCellProps: {
			sx: { textAlign: 'left', direction: 'ltr' }
		},
		columnResizeDirection: 'rtl',
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		enableEditing: true,
		enableColumnOrdering: true,
		positionActionsColumn: 'last',
		getRowId: (row) => row.id,
		muiToolbarAlertBannerProps: isError
			? {
					color: 'error',
					children: 'خطا در دریافت اطلاعات'
				}
			: undefined,
		// muiTableContainerProps: {
		// 	sx: {
		// 		minHeight: '500px',
		// 		direction: 'rtl'
		// 	}
		// },
		// onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		// onEditingRowCancel: () => setValidationErrors({}),
		onEditingRowSave: handleSaveUser,
		renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
			<>
				<DialogTitle variant="h5">ثبت کاربر جدید</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					{internalEditComponents}
				</DialogContent>
				<DialogActions>
					<MRT_EditActionButtons
						variant="text"
						table={table}
						row={row}
					/>
				</DialogActions>
			</>
		),

		renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
			<>
				<DialogTitle variant="h5">ویرایش کاربر</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					{internalEditComponents}
				</DialogContent>
				<DialogActions>
					<MRT_EditActionButtons
						variant="text"
						table={table}
						row={row}
					/>
				</DialogActions>
			</>
		),
		renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
		renderBottomToolbar: (props) => <DataTableBottomToolbar {...props} />,
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="ویرایش">
					<IconButton onClick={() => table.setEditingRow(row)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="حذف">
					<IconButton
						color="error"
						onClick={() => openDeleteConfirmModal(row)}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
				{OperationsSection ? (
					<OperationsSection
						row={row}
						table={table}
					/>
				) : null}
			</Box>
		),
		// renderTopToolbarCustomActions: ({ table }) => (
		// 	<Button
		// 		variant="contained"
		// 		onClick={() => {
		// 			table.setCreatingRow(true);
		// 			// or use createRow(...) for default values
		// 		}}
		// 	>
		// 		ثبت کاربر جدید
		// 	</Button>
		// ),
		state: {
			// isLoading: isLoadingUsers,
			isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
			// showAlertBanner: isError,
			// showProgressBars: isRefetching,
			columnFilters,
			globalFilter,
			isLoading,
			pagination: { pageIndex: pagination.pageNumber, pageSize: pagination.pageSize },
			showAlertBanner: isError,
			showProgressBars: isLoading || isRefetching,
			showLoadingOverlay: isLoading || isRefetching,
			sorting
		}
	});

	return (
		<MaterialReactTable
			table={table}
			columnResizeDirection="rtl"
			enableStickyFooter
			enablePagination
			enableColumnVirtualization
			enableRowVirtualization
			enableStickyHeader
			enableRowActions
			positionActionsColumn="last"
			muiTableCellProps={{
				textAlign: 'left',
				direction: 'ltr'
			}}
			muiCircularProgressProps={{
				color: 'secondary',
				thickness: 5,
				size: 55
			}}
			columnResizeMode="onChange"
			muiTableBodyCellProps={{
				sx: {
					direction: 'ltr',
					textAlign: 'left'
				},
				align: 'center'
			}}
			muiSkeletonProps={{
				animation: 'pulse',
				height: 28
			}}
			enableColumnActions
			muiTableContainerProps={{
				sx: {
					// maxHeight: '100%'
					height: 'calc(100vh - 300px)',
					backgroundColor: 'white'
				}
			}}
			muiTableFooterCellProps={{
				align: 'center'
			}}
			muiTableHeadCellProps={{
				align: 'center'
			}}
		/>
	);
}

function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (user) => {
			// Fake API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (newUserInfo) => {
			queryClient.setQueryData(['users'], (prevUsers) => [
				...(prevUsers || []),
				{
					...newUserInfo,
					id: (Math.random() + 1).toString(36).substring(7) // generate a random id
				}
			]);
		}
		// onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});
}

function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (user) => {
			// Fake API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (newUserInfo) => {
			queryClient.setQueryData(['users'], (prevUsers) =>
				(prevUsers || []).map((prevUser) => (prevUser.id === newUserInfo.id ? newUserInfo : prevUser))
			);
		}
		// onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});
}

function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (userId) => {
			// Fake API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (userId) => {
			queryClient.setQueryData(['users'], (prevUsers) => (prevUsers || []).filter((user) => user.id !== userId));
		}
		// onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});
}

const ReactQueryDevtoolsProduction = lazy(() =>
	import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
		default: d.ReactQueryDevtools
	}))
);

const queryClient = new QueryClient();

export default function MRTEditModalDataTable(props) {
	return (
		// <FuseScrollbars>
		<div
			style={{ direction: 'rtl' }}
			className="w-full flex flex-col min-h-full"
		>
			<FuseScrollbars className="grow overflow-x-auto">
				<QueryClientProvider client={queryClient}>
					<MRTEditModalDataTableComponent {...props} />
					{/* <Suspense fallback={null}> */}
					{/*	<ReactQueryDevtoolsProduction /> */}
					{/* </Suspense> */}
				</QueryClientProvider>
			</FuseScrollbars>
		</div>
	);
}

function validateRequired(value) {
	return !!value.length;
}

function validateEmail(email) {
	return (
		!!email.length &&
		email
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	);
}

function validateUser(user) {
	return {
		firstName: !validateRequired(user.firstName) ? 'First Name is Required' : '',
		lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
		email: !validateEmail(user.email) ? 'Incorrect Email Format' : ''
	};
}
//
// const validateItem = (values) => {
//
// 	const errors = {};
// 	if (!values.firstName?.trim()) errors.firstName = 'First Name is required';
// 	if (!values.lastName?.trim()) errors.lastName = 'Last Name is required';
// 	return errors;
// };
