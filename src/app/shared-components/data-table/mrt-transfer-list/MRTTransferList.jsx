import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { data } from './makeData';

function MRTTransferList() {
	// Example column definitions (customize as needed)
	const columns = useMemo(
		() => [
			{
				accessorKey: 'firstName',
				header: 'First Name'
			},
			{
				accessorKey: 'lastName',
				header: 'Last Name'
			}
			// add more columns as needed...
		],
		[]
	);

	// Initialize two slices of the data
	const [data1, setData1] = useState(() => data.slice(0, 3));
	const [data2, setData2] = useState(() => data.slice(3, 5));

	// Track dragging state
	const [draggingRow, setDraggingRow] = useState(null);
	const [hoveredTable, setHoveredTable] = useState(null);

	// Common table options for both tables
	const commonTableProps = {
		columns,
		enableRowDragging: true,
		enableFullScreenToggle: false,
		muiTableContainerProps: {
			sx: {
				minHeight: '320px'
			}
		},
		onDraggingRowChange: setDraggingRow,
		state: { draggingRow }
	};

	// First table
	const table1 = useMaterialReactTable({
		...commonTableProps,
		data: data1,
		getRowId: (originalRow) => `table-1-${originalRow.firstName}`,
		muiRowDragHandleProps: {
			onDragEnd: () => {
				// If the row is dropped over table 2, move it
				if (hoveredTable === 'table-2' && draggingRow?.original) {
					setData2((prev) => [...prev, draggingRow.original]);
					setData1((prev) => prev.filter((d) => d !== draggingRow.original));
				}

				setHoveredTable(null);
			}
		},
		muiTablePaperProps: {
			onDragEnter: () => setHoveredTable('table-1'),
			sx: {
				outline: hoveredTable === 'table-1' ? '2px dashed pink' : undefined
			}
		},
		renderTopToolbarCustomActions: () => (
			<Typography
				color="success.main"
				component="span"
				variant="h4"
			>
				Nice List
			</Typography>
		)
	});

	// Second table
	const table2 = useMaterialReactTable({
		...commonTableProps,
		data: data2,
		defaultColumn: {
			size: 100
		},
		getRowId: (originalRow) => `table-2-${originalRow.firstName}`,
		muiRowDragHandleProps: {
			onDragEnd: () => {
				// If the row is dropped over table 1, move it
				if (hoveredTable === 'table-1' && draggingRow?.original) {
					setData1((prev) => [...prev, draggingRow.original]);
					setData2((prev) => prev.filter((d) => d !== draggingRow.original));
				}

				setHoveredTable(null);
			}
		},
		muiTablePaperProps: {
			onDragEnter: () => setHoveredTable('table-2'),
			sx: {
				outline: hoveredTable === 'table-2' ? '2px dashed pink' : undefined
			}
		},
		renderTopToolbarCustomActions: () => (
			<Typography
				color="error.main"
				component="span"
				variant="h4"
			>
				Naughty List
			</Typography>
		)
	});

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: 'auto', lg: '1fr 1fr' },
				gap: '1rem',
				overflow: 'auto',
				p: '4px'
			}}
		>
			<MaterialReactTable table={table1} />
			<MaterialReactTable table={table2} />
		</Box>
	);
}

export default MRTTransferList;
