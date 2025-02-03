import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { data } from './makeData.js';

const columns = [
	{
		accessorKey: 'firstName',
		header: 'نام'
	},
	{
		accessorKey: 'lastName',
		header: 'نام خانوادگی',
		enableClickToCopy: true
	},
	{
		accessorKey: 'age',
		header: 'سن'
	}
];

function CustomPersianDataTable() {
	return (
		<MaterialReactTable
			columns={columns}
			data={data}
			defaultColumn={{ size: 300 }}
			columnResizeDirection="rtl"
			enableColumnFilterModes
			enableColumnOrdering
			enableColumnResizing
			enableEditing
			enableColumnPinning
			enableRowActions
			enableRowSelection
			enableSelectAll={false}
			initialState={{ showColumnFilters: true, showGlobalFilter: true }}
			localization={MRT_Localization_FA}
			enableStickyHeader
			enableTopToolbar
			enableToolbarInternalActions
			enableBottomToolbar
			enableBatchRowSelection
			enableCellActions
			enableClickToCopy="context-menu"
			// editDisplayMode="cell"
		/>
	);
}

export default CustomPersianDataTable;
