import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  MaterialReactTable,
  MRT_ActionMenuItem,
  MRT_EditActionButtons,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import _ from "lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Divider from "@mui/material/Divider";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { 
  Button, 
  Chip,
  IconButton,
  Box,
  Tooltip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DataTableTopToolbar from "app/shared-components/data-table/DataTableTopToolbar";
import DataTableBottomToolbar from "app/shared-components/data-table/DataTableBottomToolbar";
import GenericDrawer from './GenericDrawer';

// Table icons for consistent styling
const tableIcons = {
  ArrowDownwardIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:arrow-down
    </FuseSvgIcon>
  ),
  ClearAllIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu-alt-3</FuseSvgIcon>
  ),
  DensityLargeIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu-alt-4</FuseSvgIcon>
  ),
  DensityMediumIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu</FuseSvgIcon>
  ),
  DensitySmallIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:view-list</FuseSvgIcon>
  ),
  DragHandleIcon: () => (
    <FuseSvgIcon className="rotate-45 text-white" size={16}>
      heroicons-outline:arrows-expand
    </FuseSvgIcon>
  ),
  FilterListIcon: (props) => (
    <FuseSvgIcon size={16} {...props}>
      heroicons-outline:filter
    </FuseSvgIcon>
  ),
  FilterListOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:filter</FuseSvgIcon>
  ),
  FullscreenExitIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>
  ),
  FullscreenIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>
  ),
  SearchIcon: (props) => (
    <FuseSvgIcon color="action" size={20} {...props}>
      heroicons-outline:search
    </FuseSvgIcon>
  ),
  SearchOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
  ),
  ViewColumnIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:view-boards</FuseSvgIcon>
  ),
  MoreVertIcon: () => (
    <FuseSvgIcon className="text-white" size={20}>
      heroicons-outline:dots-vertical
    </FuseSvgIcon>
  ),
  MoreHorizIcon: () => (
    <FuseSvgIcon size={20} className="text-white">
      heroicons-outline:dots-horizontal
    </FuseSvgIcon>
  ),
  SortIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:sort-ascending
    </FuseSvgIcon>
  ),
  PushPinIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:thumb-tack
    </FuseSvgIcon>
  ),
  VisibilityOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:eye-off</FuseSvgIcon>
  ),
};

/**
 * EnhancedGenericCrudTable - A highly configurable table component with CRUD operations
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Data for the table
 * @param {Function} props.useListQueryHook - RTK Query hook for fetching list data
 * @param {Function} props.useCreateMutationHook - RTK Query hook for creating items
 * @param {Function} props.useUpdateMutationHook - RTK Query hook for updating items
 * @param {Function} props.useDeleteMutationHook - RTK Query hook for deleting items
 * @param {Function} props.useDisableMutationHook - RTK Query hook for disabling items
 * @param {Function} props.useSubCategoriesQueryHook - RTK Query hook for fetching subcategories
 * @param {Array} props.rowActions - Custom row actions
 * @param {Function} props.renderTopToolbarCustomActions - Custom actions for the top toolbar
 * @param {string} props.renderTopToolbarCustomActionsClasses - CSS classes for top toolbar custom actions
 * @param {Object} props.createItemProps - Props for creating new items
 * @param {string} props.tableTitle - Title for the table
 * @param {Component} props.OperationsSection - Custom operations section component
 * @param {boolean} props.saveToStore - Whether to save data to Redux store
 * @param {Function} props.storeDataAction - Redux action for storing data
 * @param {boolean} props.isSubmitting - Whether a submission is in progress
 * @param {boolean} props.enableRowActions - Whether to enable row actions
 * @param {boolean} props.enableRowSelection - Whether to enable row selection
 * @param {string} props.entityName - Name of the entity
 * @param {string} props.dataSourceName - Name of the data source
 * @param {Function} props.loadConfig - Function to load table configuration
 * @param {string} props.loadConfigStrat - Strategy for loading configuration ('AUTO' or 'MANUAL')
 * @param {Object} props.initialState - Initial state for the table
 * @param {boolean} props.useDrawerForForms - Whether to use drawer instead of modal for forms
 * @param {string} props.drawerPosition - Position of the drawer ('left', 'right', 'top', 'bottom')
 * @param {string} props.drawerSize - Size of the drawer ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {boolean} props.enableInlineEditing - Whether to enable inline editing
 * @param {Object} props.formConfig - Configuration for forms
 */
function EnhancedGenericCrudTable(props) {
  const {
    columns,
    data,
    useListQueryHook,
    useCreateMutationHook,
    useUpdateMutationHook,
    useDeleteMutationHook,
    useDisableMutationHook,
    useSubCategoriesQueryHook,
    rowActions = [],
    renderTopToolbarCustomActions: RenderTopToolbarCustomActions,
    renderTopToolbarCustomActionsClasses,
    createItemProps = null,
    tableTitle = null,
    OperationsSection = null,
    saveToStore,
    storeDataAction,
    isSubmitting = false,
    enableRowActions = true,
    enableRowSelection = false,
    entityName = "Entity",
    dataSourceName = "MAIN_PG_CLUSTER",
    loadConfig = null,
    loadConfigStrat = "MANUAL",
    initialState = {
      defaultSorting: [{ column: "id", direction: "ASC" }],
      defaultFilters: [],
      defaultGlobalFilter: "",
      defaultPagination: { pageNumber: 1, pageSize: 10 }
    },
    useDrawerForForms = false,
    drawerPosition = "right",
    drawerSize = "lg",
    enableInlineEditing = false,
    formConfig = {},
    ...rest
  } = props;

  // State for pagination, filters, etc.
  const [paginationState, setPaginationState] = useState({
    pageIndex: initialState?.defaultPagination?.pageNumber - 1 || 0,
    pageSize: initialState?.defaultPagination?.pageSize || 10,
  });
  const [columnFilters, setColumnFilters] = useState(initialState?.defaultFilters || []);
  const [globalFilter, setGlobalFilter] = useState(initialState?.defaultGlobalFilter || "");
  const [sorting, setSorting] = useState(
    initialState?.defaultSorting?.map(sort => ({
      id: sort.column,
      desc: sort.direction.toUpperCase() === "DESC"
    })) || []
  );
  const [showGlobalFilter, setShowGlobalFilter] = useState(true);
  const [dynamicConfig, setDynamicConfig] = useState(null);
  const [isEditingRows, setIsEditingRows] = useState({});
  const [rowEdits, setRowEdits] = useState({});
  
  // Drawer/Modal state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState(null);
  
  // Refs
  const formRef = useRef(null);
  const dispatch = useDispatch();

  // Debounced global filter function
  const debouncedGlobalFilter = useMemo(
    () => _.debounce((val) => setGlobalFilter(val), 500),
    []
  );

  const handleGlobalFilterChange = useCallback(
    (e) => debouncedGlobalFilter(e),
    [debouncedGlobalFilter]
  );

  // Load dynamic configuration if needed
  useEffect(() => {
    const fetchConfig = async () => {
      if (loadConfigStrat === 'AUTO' || (loadConfigStrat === 'MANUAL' && loadConfig)) {
        try {
          let config;
          
          if (loadConfigStrat === 'AUTO') {
            // Make API call to load configuration based on entity name
            const response = await fetch(`/data-source/${dataSourceName}/${entityName}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                entityName,
                initialState,
                // Other entity-related parameters can be added here
              }),
            });
            
            config = await response.json();
          } else if (loadConfig) {
            // Use provided loadConfig function
            config = await loadConfig();
          }
          
          if (config) {
            setDynamicConfig(config);
            
            // Apply configuration to table state
            if (config.columns) {
              // We don't directly set columns as they're passed as props
              // But we could merge them if needed
            }
            
            if (config.initialState) {
              if (config.initialState.pagination) {
                setPaginationState({
                  pageIndex: config.initialState.pagination.pageIndex || 0,
                  pageSize: config.initialState.pagination.pageSize || 10,
                });
              }
              
              if (config.initialState.sorting) {
                setSorting(config.initialState.sorting);
              }
              
              if (config.initialState.columnFilters) {
                setColumnFilters(config.initialState.columnFilters);
              }
              
              if (config.initialState.globalFilter !== undefined) {
                setGlobalFilter(config.initialState.globalFilter);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load table configuration:', error);
          enqueueSnackbar('خطا در بارگذاری تنظیمات جدول', { 
            variant: 'error',
            style: { backgroundColor: 'red', fontSize: 'medium' }
          });
        }
      }
    };
    
    fetchConfig();
  }, [loadConfigStrat, loadConfig, entityName, dataSourceName, initialState]);

  // Use RTK Query hooks if provided
  let finalData = data || [];
  let isFetchingData = false;
  let isErrorFetchingData = false;
  let fetchError = null;

  const rtkQueryResult =
    useListQueryHook?.({
      pageNumber: paginationState.pageIndex + 1,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sort: sorting,
      filter: columnFilters,
    }) || {};

  const {
    data: rtkData,
    isLoading: rtkIsLoading,
    isFetching: rtkIsFetching,
    isError: rtkIsError,
    error: rtkError,
    refetch: refetchList,
  } = rtkQueryResult;

  if (useListQueryHook) {
    finalData = rtkData?.data || [];
    isFetchingData = rtkIsLoading || rtkIsFetching;
    isErrorFetchingData = rtkIsError;
    fetchError = rtkError;
  }

  // Save data to store if needed
  useEffect(() => {
    if (saveToStore && storeDataAction && finalData?.length) {
      dispatch(storeDataAction(finalData));
    }
  }, [finalData, saveToStore, storeDataAction, dispatch]);

  // Setup mutation hooks
  const [createMutation] = useCreateMutationHook?.() || [];
  const [updateMutation] = useUpdateMutationHook?.() || [];
  const [deleteMutation] = useDeleteMutationHook?.() || [];
  const [disableMutation] = useDisableMutationHook?.() || [];

  // Handle row actions
  const handleDisableItem = async (row) => {
    try {
      await disableMutation(row?.original?.id).unwrap();
      refetchList?.();
      enqueueSnackbar('آیتم با موفقیت غیرفعال شد', { variant: 'success' });
    } catch (err) {
      console.error("Disable item error", err);
      enqueueSnackbar('خطا در غیرفعال کردن آیتم', { variant: 'error' });
    }
  };

  const handleDeleteItem = async (row) => {
    try {
      await deleteMutation(row?.original?.id).unwrap();
      refetchList?.();
      enqueueSnackbar('آیتم با موفقیت حذف شد', { variant: 'success' });
    } catch (err) {
      console.error("Delete item error", err);
      enqueueSnackbar('خطا در حذف آیتم', { variant: 'error' });
    }
  };

  const handleEditItem = (row) => {
    setSelectedRow(row.original);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleCreateItem = () => {
    setSelectedRow(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  // Handle inline editing
  const handleEnableRowEdit = (row) => {
    setIsEditingRows(prev => ({
      ...prev,
      [row.id]: true
    }));
    setRowEdits(prev => ({
      ...prev,
      [row.id]: { ...row.original }
    }));
  };

  const handleCancelRowEdit = (row) => {
    setIsEditingRows(prev => ({
      ...prev,
      [row.id]: false
    }));
    delete rowEdits[row.id];
    setRowEdits({ ...rowEdits });
  };

  const handleSaveRowEdit = async (row) => {
    try {
      const editedData = rowEdits[row.id];
      await updateMutation(editedData).unwrap();
      setIsEditingRows(prev => ({
        ...prev,
        [row.id]: false
      }));
      delete rowEdits[row.id];
      setRowEdits({ ...rowEdits });
      refetchList?.();
      enqueueSnackbar('تغییرات با موفقیت ذخیره شد', { variant: 'success' });
    } catch (err) {
      console.error("Update error", err);
      enqueueSnackbar('خطا در بروزرسانی آیتم', { variant: 'error' });
    }
  };

  const handleRowEditChange = (rowId, field, value) => {
    setRowEdits(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value
      }
    }));
  };

  // Handle drawer form submission
  const handleDrawerSubmit = async (values) => {
    try {
      if (drawerMode === 'create') {
        await createMutation(values).unwrap();
        enqueueSnackbar('آیتم با موفقیت ایجاد شد', { variant: 'success' });
      } else {
        await updateMutation(values).unwrap();
        enqueueSnackbar('آیتم با موفقیت بروزرسانی شد', { variant: 'success' });
      }
      refetchList?.();
      return true; // Indicates success
    } catch (err) {
      console.error(`${drawerMode === 'create' ? 'Create' : 'Update'} error`, err);
      enqueueSnackbar(`خطا در ${drawerMode === 'create' ? 'ایجاد' : 'بروزرسانی'} آیتم`, { variant: 'error' });
      return false; // Indicates failure
    }
  };

  // Configure row action menu items
  const rowActionMenuItems = ({ closeMenu, row, table }) => {
    const defaultItems = [
      <MRT_ActionMenuItem
        key="action-edit"
        icon={<EditIcon />}
        label="ویرایش"
        onClick={() => {
          closeMenu();
          handleEditItem(row);
        }}
        table={table}
      />,
    ];

    // Add user-defined actions
    const userActionItems = rowActions.map((action, idx) => (
      <MRT_ActionMenuItem
        key={`rowAction-${idx}`}
        icon={action.icon}
        label={action.label}
        onClick={async () => {
          closeMenu();
          await action.onClick?.(row, table, refetchList);
        }}
        table={table}
      />
    ));

    return [...defaultItems, <Divider key="divider" />, ...userActionItems];
  };
  
  // Enhance columns with edit cell components for inline editing
  const enhanceColumnsWithEditing = useCallback((cols) => {
    if (!enableInlineEditing) return cols;
    
    return cols.map(column => {
      // Skip columns that explicitly disable editing
      if (column.enableEditing === false) return column;
      
      return {
        ...column,
        Cell: ({ cell, row, column }) => {
          const isEditing = isEditingRows[row.id];
          
          // If not in edit mode, render the regular cell content
          if (!isEditing) {
            if (column.Cell) {
              return column.Cell({ cell, row, column });
            }
            return cell.getValue();
          }
          
          // In edit mode, render the appropriate edit component
          const value = rowEdits[row.id][column.accessorKey];
          const onChange = (e) => {
            const newValue = e.target?.type === 'checkbox' 
              ? e.target.checked 
              : e.target.value;
            handleRowEditChange(row.id, column.accessorKey, newValue);
          };

          // Use the specified edit component or fallback to a default
          if (column.editComponent) {
            // If a custom edit component is provided, use it
            return column.editComponent({ 
              value, 
              onChange, 
              cell, 
              row, 
              column 
            });
          }
          
          // Default edit components based on column type
          switch (column.type) {
            case 'boolean':
              return (
                <input 
                  type="checkbox" 
                  checked={value || false} 
                  onChange={onChange} 
                />
              );
            case 'select':
              return (
                <select value={value} onChange={onChange}>
                  {column.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
            case 'date':
              return (
                <input 
                  type="date" 
                  value={value} 
                  onChange={onChange} 
                />
              );
            case 'number':
              return (
                <input 
                  type="number" 
                  value={value} 
                  onChange={onChange} 
                />
              );
            default:
              return (
                <input 
                  type="text" 
                  value={value} 
                  onChange={onChange} 
                />
              );
          }
        },
      };
    });
  }, [enableInlineEditing, isEditingRows, rowEdits, handleRowEditChange]);
  
  const enhancedColumns = useMemo(() => 
    enhanceColumnsWithEditing(dynamicConfig?.columns || columns),
    [enhanceColumnsWithEditing, dynamicConfig, columns]
  );
  
  // If enabling inline editing, add an actions column for edit controls
  const columnsWithEditActions = useMemo(() => {
    if (!enableInlineEditing) return enhancedColumns;
    
    const actionColumn = {
      id: 'edit-actions',
      header: 'عملیات',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const isEditing = isEditingRows[row.id];
        
        if (isEditing) {
          return (
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Tooltip title="ذخیره">
                <IconButton
                  color="success"
                  onClick={() => handleSaveRowEdit(row)}
                  size="small"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="انصراف">
                <IconButton
                  color="error"
                  onClick={() => handleCancelRowEdit(row)}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
        
        return (
          <Tooltip title="ویرایش">
            <IconButton
              color="primary"
              onClick={() => handleEnableRowEdit(row)}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    };
    
    return [...enhancedColumns, actionColumn];
  }, [enhancedColumns, enableInlineEditing, isEditingRows, handleSaveRowEdit, handleCancelRowEdit, handleEnableRowEdit]);
  
  // Define default settings for the table
  const defaults = useMemo(
    () =>
      _.defaults(rest, {
        initialState: {
          density: "spacious",
          enablePagination: true,
          columnPinning: {
            left: ["mrt-row-expand", "mrt-row-select"],
            right: ["mrt-row-actions"],
          },
          pagination: {
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
          },
          enableFullScreenToggle: true,
          localization: { MRT_Localization_FA },
        },
        enableColumnResizing: true,
        textAlign: "right",
        enableCellActions: true,
        enableClickToCopy: "context-menu",
        enableEditing: true,
        enableStickyBody: true,
        editDisplayMode: enableInlineEditing ? "row" : "modal", // Use row edit for inline editing
        createDisplayMode: "modal",
        positionActionsColumn: "last",
        renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
        renderBottomToolbar: (_props) => <DataTableBottomToolbar {..._props} />,
        renderTopToolbarCustomActions: ({ table }) => {
          return (
            <div className="flex flex-row">
              <div className="flex justify-start px-8 py-16">
                <IconButton 
                  onClick={() => refetchList?.()}
                  disabled={isFetchingData}
                >
                  <RefreshIcon
                    className={`cursor-pointer transition-transform ${
                      isFetchingData
                        ? "animate-spin text-gray-400"
                        : "text-gray-500 hover:scale-105 active:scale-95"
                    }`}
                  />
                </IconButton>
              </div>
              {createItemProps && (
                <div className="flex justify-start py-16 px-8">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateItem}
                  >
                    {createItemProps.buttonLabel || "ایجاد آیتم جدید"}
                  </Button>
                </div>
              )}
              {RenderTopToolbarCustomActions && (
                <div
                  className={
                    renderTopToolbarCustomActionsClasses ||
                    "flex justify-start px-8 py-16"
                  }
                >
                  <RenderTopToolbarCustomActions />
                </div>
              )}
            </div>
          );
        },
        muiBottomToolbarProps: {
          className: "flex items-center min-h-56 h-56",
        },
        muiTablePaperProps: {
          elevation: 0,
          square: true,
          className: "flex flex-col flex-auto h-full",
        },
        muiTableContainerProps: {
          className: "flex-auto",
        },
        enableStickyHeader: true,
        localization: { MRT_Localization_FA },
        enableStickyFooter: true,
        positionPagination: "bottom",
        positionToolbarAlertBanner: "top",
        muiPaginationProps: {
          color: "secondary",
          rowsPerPageOptions: [5, 10, 20, 30],
          shape: "rounded",
          variant: "outlined",
          showRowsPerPage: true,
        },
        getRowId: (row) => row.id,
        muiTableBodyCellProps: {
          sx: { textAlign: "left", direction: "rtl" },
        },
        muiFilterTextFieldProps: {
          variant: "outlined",
          size: "small",
          sx: {
            "& .MuiInputBase-root": {
              padding: "0px 8px",
              height: "32px!important",
              minHeight: "32px!important",
              direction: "rtl",
              textAlign: "right",
            },
          },
        },
        muiSelectAllCheckboxProps: {
          className: "w-48",
        },
        muiSelectCheckboxProps: {
          className: "w-48",
        },
        muiTableBodyRowProps: ({ row, table }) => {
          const { density } = table.getState();

          if (density === "compact") {
            return {
              sx: {
                backgroundColor: "initial",
                opacity: 1,
                boxShadow: "none",
                height: row.getIsPinned() ? `${37}px` : undefined,
              },
            };
          }

          return {
            sx: {
              backgroundColor: "initial",
              opacity: 1,
              boxShadow: "none",
              height: row.getIsPinned()
                ? `${density === "comfortable" ? 53 : 69}px`
                : undefined,
            },
          };
        },
        muiTableHeadCellProps: ({ column }) => ({
          sx: {
            textAlign: "left",
            direction: "ltr",
            "& .Mui-TableHeadCell-Content-Labels": {
              flex: 1,
              justifyContent: "space-between",
            },
            "& .Mui-TableHeadCell-Content-Actions": {
              "& .MuiIconButton-root": {
                color: "#FFF", // Set header icons to white
              },
              "& .MuiSvgIcon-root": {
                color: "#FFF", // Set header icons to white
              },
            },
            "& .MuiFormHelperText-root": {
              textAlign: "center",
              marginX: 0,
              color: (theme) => theme.palette.text.disabled,
              fontSize: 11,
            },
            backgroundColor: (theme) =>
              column.getIsPinned() ? theme.palette.background.paper : "inherit",
          },
        }),
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        onShowGlobalFilterChange: setShowGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPaginationState,
        enableGlobalFilter: true,
        enableFilterMatchHighlighting: true,
        enableGlobalFilterModes: true,
        globalFilterModeOptions: ["contains", "fuzzy", "startsWith"],
        rowCount: rtkData?.totalElements || finalData.length,
        mrtTheme: (theme) => ({
          baseBackgroundColor: theme.palette.background.paper,
          menuBackgroundColor: theme.palette.background.paper,
          pinnedRowBackgroundColor: theme.palette.background.paper,
          pinnedColumnBackgroundColor: theme.palette.background.paper,
        }),
        renderCellActionMenuItems: rowActionMenuItems,
        renderRowActionMenuItems: rowActionMenuItems,
        enableFullScreenToggle: false,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions,
        enableRowSelection,
        state: {
          isLoading: isFetchingData,
          showProgressBars: isFetchingData,
          showLoadingOverlay: isFetchingData,
          columnFilters,
          globalFilter,
          sorting,
          showGlobalFilter,
          pagination: paginationState,
        },
        icons: tableIcons,
        localeText: { MRT_Localization_FA },
        enablePagination: true,
      }),
    [
      rest,
      isFetchingData,
      columnFilters,
      globalFilter,
      sorting,
      paginationState,
      showGlobalFilter,
      enableInlineEditing,
      handleCreateItem,
      refetchList,
      createItemProps,
      RenderTopToolbarCustomActions,
      renderTopToolbarCustomActionsClasses,
      rowActionMenuItems,
      rtkData,
      finalData.length,
    ]
  );

  // Create the table instance
  const table = useMaterialReactTable({
    columns: columnsWithEditActions,
    data: finalData,
    ...defaults,
    ...rest,
    muiTableHeadCellProps: {
      sx: { backgroundColor: "#0C0C0C", color: "#FFF" },
    },
    muiIconButtonProps: {
      sx: {
        color: "#FFF", // Set the icon color to white
        "&:hover": {
          color: "#FFD700", // Change icon color on hover (e.g., gold)
        },
      },
    },
    muiFilterTextFieldProps: {
      sx: {
        color: "#FFF", // Filter icon color
        "&:hover": {
          color: "#FFD700", // Filter icon color on hover
        },
      },
    },
    manualGlobalFilter: true,
    enableFilterMatchHighlighting: true,
    localization: MRT_Localization_FA,
  });

  // Handle error state
  if (isErrorFetchingData) {
    const errorMessage =
      fetchError?.data?.message ||
      fetchError?.error ||
      "خطا در دریافت داده‌ها از سرور.";
    return <p style={{ color: "red" }}>خطا: {errorMessage}</p>;
  }

  return (
    <div
      style={{
        direction: "rtl",
        backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}
      className="w-full max-w-screen flex flex-col min-h-full"
    >
      <FuseScrollbars className="grow overflow-x-auto">
        <MaterialReactTable
          table={table}
          enablePagination
          manualFiltering
          muiTableHeadProps={{
            sx: {
              backgroundColor: "#000",
              color: "#111",
            },
          }}
          columnFilterDisplayMode="popover"
          columnResizeDirection="rtl"
          onGlobalFilterChange={setGlobalFilter}
          manualGlobalFilter
          enableFilterMatchHighlighting
          state={{ globalFilter }}
        />
      </FuseScrollbars>

      {/* Drawer or Modal for Create/Edit Forms */}
      {useDrawerForForms ? (
        <GenericDrawer
          ref={formRef}
          type="drawer"
          position={drawerPosition}
          size={drawerSize}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={drawerMode === 'create' ? (createItemProps?.formHeaderTitle || 'ایجاد آیتم جدید') : 'ویرایش آیتم'}
          schema={createItemProps?.zodSchema}
          schemaType="zod" 
          defaultValues={drawerMode === 'create' ? createItemProps?.defaultValues : selectedRow}
          onSubmit={handleDrawerSubmit}
          formEngine={createItemProps?.formEngine || 'default'}
          formFieldsInputTypes={createItemProps?.formFieldsInputTypes || {}}
          formValidationStruct={createItemProps?.formValidationStruct || 'ZOD_SCHEMA'}
          formGenerationType={createItemProps?.formGenerationType || 'AUTO'}
        />
      ) : (
        <GenericDrawer
          ref={formRef}
          type="modal"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={drawerMode === 'create' ? (createItemProps?.formHeaderTitle || 'ایجاد آیتم جدید') : 'ویرایش آیتم'}
          schema={createItemProps?.zodSchema}
          schemaType="zod"
          defaultValues={drawerMode === 'create' ? createItemProps?.defaultValues : selectedRow}
          onSubmit={handleDrawerSubmit}
          formEngine={createItemProps?.formEngine || 'default'}
          formFieldsInputTypes={createItemProps?.formFieldsInputTypes || {}}
          formValidationStruct={createItemProps?.formValidationStruct || 'ZOD_SCHEMA'}
          formGenerationType={createItemProps?.formGenerationType || 'AUTO'}
        />
      )}
    </div>
  );
}

export default EnhancedGenericCrudTable;