import { useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, MRT_EditActionButtons, useMaterialReactTable } from 'material-react-table';
import {
	Box,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
	Dialog,
	DialogContentText,
	Button,
	Typography,
	TextField
} from '@mui/material';
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
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice.js';
import { useDispatch } from 'react-redux';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA'];
const fakeData = [
	{ id: '1', firstName: 'آرمین', lastName: 'مظفری', email: 'john@example.com', state: 'CA' },
	{ id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', state: 'AZ' }
];

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
		}
	},
	{
		accessorKey: 'lastName',
		header: 'نام خانوادگی',
		muiEditTextFieldProps: {
			required: true
		}
	},
	{
		accessorKey: 'username',
		header: 'نام کاربری',
		muiEditTextFieldProps: {
			type: 'username',
			required: true
		}
	},
	{
		accessorKey: 'email',
		header: 'ایمیل',
		muiEditTextFieldProps: {
			type: 'email',
			required: true
		}
	},
	{
		accessorKey: 'state',
		header: 'استان',
		editVariant: 'select',
		editSelectOptions: usStates
	}
];

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
	tableTitle = null,
	rowActions = [],
	createItemProps = null
}) {
	const dispatch = useDispatch();
	const [validationErrors, setValidationErrors] = useState({});
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const [totalPages, setTotalPages] = useState(0);
	const [searchText, setSearchText] = useState('');
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [data, setData] = useState(fakeData);

	function useGetUsers() {
		const {
			data: { data: serverData = [], pagination: serverPagination = null } = {},
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
				const response = await axios.get('/user/', {
					params: {
						page: pagination.pageIndex + 1,
						size: pagination.pageSize,
						search: globalFilter,
						filters: JSON.stringify(columnFilters),
						sort: JSON.stringify(sorting)
					}
				});
				setPagination({
					pageSize: response?.data?.pagination?.pageSize || pagination.pageSize,
					pageIndex: (response?.data?.pagination?.pageNumber || 1) - 1
				});
				setTotalPages(response?.data?.pagination?.totalPages || 1);
				return response?.data || {};
			},
			placeholderData: keepPreviousData
		});
		return { data: serverData, isError, isRefetching, isLoading, refetch, pagination: serverPagination };
	}

	const { data: serverListData, isError, isRefetching, isLoading, refetch } = useGetUsers();

	useEffect(() => {
		if (serverListData?.length) {
			setData(serverListData);
		}
	}, [serverListData]);

	const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
	const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
	const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

	const handleCreateUser = async ({ values, table }) => {
		const newValidationErrors = validateUser(values);

		if (Object.values(newValidationErrors).some((error) => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}

		setValidationErrors({});
		await createUser(values);
		table.setCreatingRow(null);
		refetch();
	};

	const handleSaveUser = async ({ values, table }) => {
		const newValidationErrors = validateUser(values);

		if (Object.values(newValidationErrors).some((error) => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}

		setValidationErrors({});
		await updateUser(values);
		table.setEditingRow(null);
		refetch();
	};

	const openDeleteConfirmModal = (row) => {
		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle>حذف</DialogTitle>
						<DialogContent>
							<DialogContentText>آیا از حذف این ردیف مطمئن هستید؟</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => dispatch(closeDialog())}>لغو</Button>
							<Button
								onClick={() => {
									dispatch(closeDialog());
									deleteUser(row.original.id);
									refetch();
								}}
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
	};

	const handleGlobalFilterChange = useCallback(
		_.debounce((val) => {
			setGlobalFilter(val);
		}, 500),
		[]
	);

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
		renderTopToolbarCustomActions: () => (
			<Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
				{tableTitle ? <Typography variant="h4">{tableTitle}</Typography> : null}
				<Tooltip
					arrow
					title="رفرش"
				>
					<IconButton onClick={() => refetch()}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				{createItemProps && (
					<Button
						color="secondary"
						onClick={() => setCreateDialogOpen(true)}
						variant="contained"
					>
						{createItemProps.buttonLabel || 'ایجاد آیتم جدید'}
					</Button>
				)}
			</Box>
		),
		pageCount: totalPages,
		muiTableBodyRowProps: ({ row, table }) => ({
			sx: {
				backgroundColor: 'initial',
				opacity: 1,
				boxShadow: 'none'
			}
		}),
		muiTableHeadCellProps: ({ column }) => ({
			sx: {
				textAlign: 'left',
				direction: 'ltr'
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
		onCreatingRowSave: handleCreateUser,
		onEditingRowSave: handleSaveUser,
		renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
			<>
				<DialogTitle>ثبت</DialogTitle>
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
				<DialogTitle>ویرایش</DialogTitle>
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
				{rowActions.map((action, idx) => (
					<Tooltip
						key={idx}
						title={action.label}
					>
						<IconButton
							onClick={() => action.onClick(row, table, refetch)}
							color={action.color || 'default'}
						>
							{action.icon}
						</IconButton>
					</Tooltip>
				))}
			</Box>
		),
		state: {
			columnFilters,
			globalFilter,
			isLoading,
			pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize },
			showAlertBanner: isError,
			showProgressBars: isLoading || isRefetching,
			showLoadingOverlay: isLoading || isRefetching,
			sorting
		}
	});

	return (
		<div
			style={{ direction: 'rtl', backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
			className="w-full flex flex-col min-h-full"
		>
			<FuseScrollbars className="grow overflow-x-auto">
				<MaterialReactTable
					table={table}
					enablePagination
					columnResizeDirection="rtl"
					muiTableContainerProps={{
						sx: {
							height: 'calc(100vh - 200px)',
							backgroundColor: '#ffffff'
						}
					}}
				/>
			</FuseScrollbars>

			{createItemProps && (
				<Dialog
					open={createDialogOpen}
					onClose={() => setCreateDialogOpen(false)}
					fullWidth
					maxWidth="sm"
				>
					<DialogTitle>{createItemProps.dialogTitle || 'ایجاد آیتم جدید'}</DialogTitle>
					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<CreateItemForm
							schema={createItemProps.zodSchema}
							defaultValues={createItemProps.defaultValues}
							onSubmit={async (vals) => {
								await createItemProps.onCreate?.(vals);
								setCreateDialogOpen(false);
								refetch();
							}}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

function CreateItemForm({ schema, defaultValues, onSubmit }) {
	const form = useForm({
		resolver: schema ? zodResolver(schema) : undefined,
		defaultValues: defaultValues || {}
	});

	const { register, handleSubmit, formState } = form;
	const handleFormSubmit = async (data) => {
		await onSubmit(data);
	};

	return (
		<form
			className="space-y-16"
			onSubmit={handleSubmit(handleFormSubmit)}
		>
			{Object.keys(formState.errors).length > 0 && null}
			{Object.keys(defaultValues || {}).map((key) => (
				<TextField
					key={key}
					label={key}
					variant="outlined"
					fullWidth
					{...register(key)}
					error={!!formState.errors[key]}
					helperText={formState.errors[key]?.message}
				/>
			))}
			<DialogActions>
				<Button onClick={() => form.reset(defaultValues)}>انصراف</Button>
				<Button
					onClick={handleSubmit(handleFormSubmit)}
					color="primary"
					variant="contained"
				>
					ثبت
				</Button>
			</DialogActions>
		</form>
	);
}

function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (user) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (newUserInfo) => {
			queryClient.setQueryData(['users'], (prevUsers) => [
				...(prevUsers || []),
				{
					...newUserInfo,
					id: (Math.random() + 1).toString(36).substring(7)
				}
			]);
		}
	});
}

function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (user) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (newUserInfo) => {
			queryClient.setQueryData(['users'], (prevUsers) =>
				(prevUsers || []).map((prevUser) => (prevUser.id === newUserInfo.id ? newUserInfo : prevUser))
			);
		}
	});
}

function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (userId) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve();
		},
		onMutate: (userId) => {
			queryClient.setQueryData(['users'], (prevUsers) => (prevUsers || []).filter((user) => user.id !== userId));
		}
	});
}

// const ReactQueryDevtoolsProduction = lazy(() =>
// 	import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
// 		default: d.ReactQueryDevtools
// 	}))
// );

const queryClient = new QueryClient();

export default function MRTEditModalDataTable(props) {
	return (
		<div
			style={{ direction: 'rtl' }}
			className="w-full flex flex-col min-h-full"
		>
			<QueryClientProvider client={queryClient}>
				<MRTEditModalDataTableComponent {...props} />
			</QueryClientProvider>
		</div>
	);
}

function validateRequired(value) {
	return !!value?.length;
}

function validateEmail(email) {
	return (
		!!email?.length &&
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
