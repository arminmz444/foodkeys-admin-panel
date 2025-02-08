import { MaterialReactTable, MRT_ActionMenuItem, useMaterialReactTable } from 'material-react-table';
import _ from '@lodash';
import { useMemo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import Divider from '@mui/material/Divider';
import { Email, PersonOffOutlined } from '@mui/icons-material';
import DataTableBottomToolbar from 'app/shared-components/data-table/DataTableBottomToolbar.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import DataTableTopToolbar from './DataTableTopToolbar';

const queryClient = new QueryClient();

const tableIcons = {
	ArrowDownwardIcon: (props) => (
		<FuseSvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:arrow-down
		</FuseSvgIcon>
	),
	ClearAllIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu-alt-3</FuseSvgIcon>, // Adjusted, closest match
	DensityLargeIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu-alt-4</FuseSvgIcon>, // Adjusted, closest match
	DensityMediumIcon: () => <FuseSvgIcon size={20}>heroicons-outline:menu</FuseSvgIcon>, // Adjusted, closest match
	DensitySmallIcon: () => <FuseSvgIcon size={20}>heroicons-outline:view-list</FuseSvgIcon>, // Adjusted, closest match
	DragHandleIcon: () => (
		<FuseSvgIcon
			className="rotate-45"
			size={16}
		>
			heroicons-outline:arrows-expand
		</FuseSvgIcon>
	), // Adjusted, closest match
	FilterListIcon: (props) => (
		<FuseSvgIcon
			size={16}
			{...props}
		>
			heroicons-outline:filter
		</FuseSvgIcon>
	),
	FilterListOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:filter</FuseSvgIcon>, // Heroicons may not have a direct match for "off" state; consider custom handling
	FullscreenExitIcon: () => <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>, // Adjusted, closest match
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
	SearchOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>, // Heroicons may not have a direct match for "off" state; consider custom handling
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
	), // Adjusted, closest match
	PushPinIcon: (props) => (
		<FuseSvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:thumb-tack
		</FuseSvgIcon>
	), // Adjusted, closest match
	VisibilityOffIcon: () => <FuseSvgIcon size={20}>heroicons-outline:eye-off</FuseSvgIcon>
};

function DataTable(props) {
	const { columns, data, ...rest } = props;
	// const [data, setData] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [searchQuery, setSearchQuery] = useState('');

	// const fetchData = async (query = '') => {
	// 	setLoading(true);
	// 	try {
	// 		const response = await axios.get(`/api/v1/data?search=${query}`);
	// 		// setData(response.data);
	// 	} catch (error) {
	// 		console.error('Error fetching data:', error);
	// 	}
	// 	setLoading(false);
	// };

	// const debouncedSearch = useCallback(
	// 	_.debounce((query) => fetchData(query), 500),
	// 	[]
	// );
	//
	// useEffect(() => {
	// 	fetchData();
	// }, []);
	//
	// useEffect(() => {
	// 	debouncedSearch(searchQuery);
	// }, [searchQuery, debouncedSearch]);

	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
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
				// enableColumnResizing: true,
				editDisplayMode: 'cell',
				renderCellActionMenuItems: ({ closeMenu, cell, row, table, internalMenuItems }) => [
					...internalMenuItems,
					<Divider />,
					<MRT_ActionMenuItem
						icon={<Email />}
						key={1}
						label="ارسال ایمیل"
						onClick={() => {
							closeMenu();
						}}
						table={table}
					/>,
					<MRT_ActionMenuItem
						icon={<PersonOffOutlined />}
						key={2}
						label="مسدود کردن"
						onClick={async () => {
							closeMenu();
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
				positionToolbarAlertBanner: 'top',
				muiTableBodyCellProps: {
					sx: { textAlign: 'left', direction: 'ltr' }
				},
				muiPaginationProps: {
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
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
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				renderBottomToolbar: (props) => <DataTableBottomToolbar {...props} />,
				icons: tableIcons,
				localeText: { MRT_Localization_FA }
			}),
		[rest]
	);
	const table = useMaterialReactTable({
		columns,
		data,
		...defaults,
		...rest,
		localization: MRT_Localization_FA
		// columnResizeDirection: 'rtl',

		// direction: 'rtl',
		// dir: 'rtl'
	});

	return (
		<div
			style={{ direction: 'rtl' }}
			className="w-full flex flex-col min-h-full"
		>
			<FuseScrollbars className="grow overflow-x-auto">
				<QueryClientProvider client={queryClient}>
					<MaterialReactTable
						table={table}
						columnFilterDisplayMode="popover"
						columnResizeDirection="rtl"
					/>
				</QueryClientProvider>
			</FuseScrollbars>
		</div>
	);
}

export default DataTable;
