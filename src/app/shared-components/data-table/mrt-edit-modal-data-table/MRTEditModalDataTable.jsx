import { lazy, Suspense, useMemo, useState } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';

// Some mock/fake data
const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA']; // etc...
const fakeData = [
	{ id: '1', firstName: 'آرمین', lastName: 'مظفری', email: 'john@example.com', state: 'CA' },
	{ id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', state: 'AZ' }
	// ... more data
];

function MRTEditModalDataTableComponent() {
	const [validationErrors, setValidationErrors] = useState({});

	const columns = useMemo(
		() => [
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
					required: true,
					error: !!validationErrors?.firstName,
					helperText: validationErrors?.firstName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							firstName: undefined
						})
				}
			},
			{
				accessorKey: 'lastName',
				header: 'نام خانوادگی',
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.lastName,
					helperText: validationErrors?.lastName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							lastName: undefined
						})
				}
			},
			{
				accessorKey: 'email',
				header: 'ایمیل',
				muiEditTextFieldProps: {
					type: 'email',
					required: true,
					error: !!validationErrors?.email,
					helperText: validationErrors?.email,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							email: undefined
						})
				}
			},
			{
				accessorKey: 'state',
				header: 'استان',
				editVariant: 'select',
				editSelectOptions: usStates,
				muiEditTextFieldProps: {
					select: true,
					error: !!validationErrors?.state,
					helperText: validationErrors?.state
				}
			}
		],
		[validationErrors]
	);

	// CREATE hook
	const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
	// READ hook
	const {
		data: fetchedUsers = [],
		isError: isLoadingUsersError,
		isFetching: isFetchingUsers,
		isLoading: isLoadingUsers
	} = useGetUsers();
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
		if (window.confirm('Are you sure you want to delete this user?')) {
			deleteUser(row.original.id);
		}
	};

	const table = useMaterialReactTable({
		columns,
		data: fetchedUsers,
		localization: MRT_Localization_FA,
		columnResizeDirection: 'rtl',
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		enableEditing: true,
		enableColumnOrdering: true,
		getRowId: (row) => row.id,
		muiToolbarAlertBannerProps: isLoadingUsersError
			? {
					color: 'error',
					children: 'Error loading data'
				}
			: undefined,
		muiTableContainerProps: {
			sx: {
				minHeight: '500px'
			}
		},
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		onEditingRowCancel: () => setValidationErrors({}),
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
			</Box>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				variant="contained"
				onClick={() => {
					table.setCreatingRow(true);
					// or use createRow(...) for default values
				}}
			>
				ثبت کاربر جدید
			</Button>
		),
		state: {
			isLoading: isLoadingUsers,
			isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
			showAlertBanner: isLoadingUsersError,
			showProgressBars: isFetchingUsers
		}
	});

	return <MaterialReactTable table={table} />;
}

// CREATE hook (post new user to api)
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

// READ hook (get users from api)
function useGetUsers() {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			// Fake API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return Promise.resolve(fakeData);
		},
		refetchOnWindowFocus: false
	});
}

// UPDATE hook (put user in api)
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

// DELETE hook (delete user in api)
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

// // React Query setup in App.jsx (or App.js)
// const ReactQueryDevtoolsProduction = lazy(() =>
// 	import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
// 		default: d.ReactQueryDevtools
// 	}))
// );

const queryClient = new QueryClient();

export default function MRTEditModalDataTable() {
	return (
		<QueryClientProvider client={queryClient}>
			<MRTEditModalDataTableComponent />
			{/*<Suspense fallback={null}>*/}
			{/*	<ReactQueryDevtoolsProduction />*/}
			{/*</Suspense>*/}
		</QueryClientProvider>
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
