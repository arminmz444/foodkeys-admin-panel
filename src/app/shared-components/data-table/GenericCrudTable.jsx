import { MaterialReactTable, MRT_ActionMenuItem, useMaterialReactTable } from 'material-react-table';
import _ from '@lodash';
import { useMemo, useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import Divider from '@mui/material/Divider';
import { Email, PersonOffOutlined } from '@mui/icons-material';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- Now commented out, since we're using RTK Query

import { useDispatch } from 'react-redux'; // for optional saving to Redux
import DataTableBottomToolbar from 'app/shared-components/data-table/DataTableBottomToolbar.jsx';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import DataTableTopToolbar from './DataTableTopToolbar';

const tableIcons = {
	ArrowDownwardIcon: (props) => (
		<FuseSvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:arrow-down
		</FuseSvgIcon>
	),
	ClearAllIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu-alt-3</FuseSvgIcon>,
	DensityLargeIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu-alt-4</FuseSvgIcon>,
	DensityMediumIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu</FuseSvgIcon>,
	DensitySmallIcon: () => <FuseSvgIcon size={20}>heroicons-outline:view-list</FuseSvgIcon>,
	DragHandleIcon: () => (
		<FuseSvgIcon
			className="rotate-45"
			size={16}
		>
			heroicons-outline:arrows-expand
		</FuseSvgIcon>
	),
	FilterListIcon: (props) => (
		<FuseSvgIcon
			size={16}
			{...props}
		>
			heroicons-outline:filter
		</FuseSvgIcon>
	),
	FilterListOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:filter</FuseSvgIcon>,
	FullscreenExitIcon: () => <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>,
	FullscreenIcon: () => <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>,
	SearchIcon: (props) => (
		<FuseSvgIcon
			color="action"
			size={20}
			{...props}
		>
			heroicons-outline:search
		</FuseSvgIcon>
	),
	SearchOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>,
	ViewColumnIcon: () => <FuseSvgIcon size={20}>heroicons-outline:view-boards</FuseSvgIcon>,
	MoreVertIcon: () => <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>,
	MoreHorizIcon: () => <FuseSvgIcon size={20}>heroicons-outline:dots-horizontal</FuseSvgIcon>,
	SortIcon: (props) => (
		<FuseSvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:sort-ascending
		</FuseSvgIcon>
	),
	PushPinIcon: (props) => (
		<FuseSvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:thumb-tack
		</FuseSvgIcon>
	),
	VisibilityOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:eye-off</FuseSvgIcon>
};

// const queryClient = new QueryClient(); // <-- Only needed if using React Query

function GenericCrudTable(props) {
	const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 15 });
	const {
		columns,
		data, // This can still be passed in directly
		// --- Below are NEW optional props for RTK Query usage:
		useListQueryHook, // e.g. useGetCategoryQuery, returns { data: list, isLoading, ... }
		useCreateMutationHook, // e.g. useCreateCategoryMutation
		useUpdateMutationHook, // e.g. useUpdateCategoryMutation
		useDeleteMutationHook, // e.g. useDeleteCategoryMutation
		saveToStore, // boolean
		storeDataAction, // Redux action if we want to store data in a slice
		// The rest of existing or future props:
		...rest
	} = props;

	const dispatch = useDispatch();

	// 2) If using RTK Query for listing:
	let finalData = data || [];
	let isFetchingData = false;
	let isErrorFetchingData = false;
	let fetchError = null;

	// If user provided a listing query hook, we call it here:
	const rtkQueryResult = useListQueryHook?.() || {};

	const {
		data: rtkData,
		isLoading: rtkIsLoading,
		isFetching: rtkIsFetching,
		isError: rtkIsError,
		error: rtkError
	} = rtkQueryResult;

	// Priority: If RTK Query is used, override finalData with that
	if (useListQueryHook) {
		finalData = rtkData || [];
		isFetchingData = rtkIsLoading || rtkIsFetching;
		isErrorFetchingData = rtkIsError;
		fetchError = rtkError;
	}

	// 3) If we want to store the fetched data in a slice:
	useEffect(() => {
		if (saveToStore && storeDataAction && finalData?.length) {
			dispatch(storeDataAction(finalData));
		}
	}, [finalData, saveToStore, storeDataAction, dispatch]);

	// 4) If we have mutations for create, update, delete, we can define them:
	const [createMutation] = useCreateMutationHook?.() || [];
	const [updateMutation] = useUpdateMutationHook?.() || [];
	const [deleteMutation] = useDeleteMutationHook?.() || [];

	// 5) Example local state or methods (originally commented out, still kept here)
	// const [data, setData] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [searchQuery, setSearchQuery] = useState('');

	// const fetchData = async (query = '') => {
	//   setLoading(true);
	//   try {
	//     const response = await axios.get(`/api/v1/data?search=${query}`);
	//   } catch (error) {
	//     console.error('Error fetching data:', error);
	//   }
	//   setLoading(false);
	// };

	// const debouncedSearch = useCallback(
	//   _.debounce((query) => fetchData(query), 500),
	//   []
	// );

	// useEffect(() => {
	//   fetchData();
	// }, []);

	// useEffect(() => {
	//   debouncedSearch(searchQuery);
	// }, [searchQuery, debouncedSearch]);

	// 6) Merge your existing defaults with any new props
	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'spacious',
					showColumnFilters: true,
					showGlobalFilter: true,
					enablePagination: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 15
					},
					enableFullScreenToggle: true,
					localization: { MRT_Localization_FA }
				},
				columnResizeDirection: 'rtl',
				textAlign: 'right',
				enableCellActions: true,
				enableClickToCopy: 'context-menu',
				enableEditing: true,
				enableStickyBody: true,
				editDisplayMode: 'cell',
				renderCellActionMenuItems: ({ closeMenu, cell, row, table, internalMenuItems }) => [
					...internalMenuItems,
					<Divider />,
					<MRT_ActionMenuItem
						icon={<Email />}
						key="action-send-email"
						label="ارسال ایمیل"
						onClick={() => {
							closeMenu();
							// Example usage of update or something
							// updateMutation?.(row?.original);
						}}
						table={table}
					/>,
					<MRT_ActionMenuItem
						icon={<PersonOffOutlined />}
						key="action-block"
						label="مسدود کردن"
						onClick={async () => {
							closeMenu();
							// Example usage of delete or something
							// deleteMutation?.(row?.original?.id);
						}}
						table={table}
					/>
				],
				enableFullScreenToggle: true,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-56 h-56'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				localization: { MRT_Localization_FA },
				enableStickyFooter: true,
				paginationDisplayMode: 'صفحه',
				positionPagination: 'bottom',
				positionToolbarAlertBanner: 'top',
				muiTableBodyCellProps: {
					sx: { textAlign: 'left', direction: 'ltr' }
				},
				// muiPaginationProps: {
				// 	color: 'secondary',
				// 	rowsPerPageOptions: [10, 20, 30],
				// 	shape: 'rounded',
				// 	variant: 'outlined',
				// 	showRowsPerPage: true
				// },
				muiSearchTextFieldProps: {
					placeholder: 'جستجو',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
					sx: {
						'& .MuiInputBase-root': {
							padding: '0px 8px',
							height: '32px!important',
							minHeight: '32px!important',
							direction: 'rtl',
							textAlign: 'right'
						}
					}
				},
				muiSelectAllCheckboxProps: {
					className: 'w-48'
				},
				muiSelectCheckboxProps: {
					className: 'w-48'
				},
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
							// Set a fixed height for pinned rows
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
				state: {
					isLoading: isFetchingData,
					showProgressBars: isFetchingData,
					showLoadingOverlay: isFetchingData
				},
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				renderBottomToolbar: (_props) => <DataTableBottomToolbar {..._props} />,
				icons: tableIcons,
				localeText: { MRT_Localization_FA },
				enablePagination: true
			}),
		[rest]
	);

	const table = useMaterialReactTable({
		columns,
		data: finalData, // from RTK or from props
		...defaults,
		...rest,
		pagination: paginationState,
		onPaginationChange: setPaginationState,
		enablePagination: true,
		localization: MRT_Localization_FA
	});

	// 8) Handle RTK Query loading/error states
	// if (isFetchingData) {
	// 	return <p>در حال بارگذاری...</p>;
	// }

	if (isErrorFetchingData) {
		// Attempt to parse error
		const errorMessage = fetchError?.data?.message || fetchError?.error || 'خطا در دریافت داده‌ها از سرور.';

		return <p style={{ color: 'red' }}>خطا: {errorMessage}</p>;
	}

	return (
		<div
			style={{ direction: 'rtl' }}
			className="w-full flex flex-col min-h-full"
		>
			<FuseScrollbars className="grow overflow-x-auto">
				<MaterialReactTable
					table={table}
					enablePagination
					columnFilterDisplayMode="popover"
					columnResizeDirection="rtl"
				/>
			</FuseScrollbars>
		</div>
	);
}

export default GenericCrudTable;
