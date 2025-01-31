import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { randomCreatedDate, randomTraderName, randomUpdatedDate, useDemoData } from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import React from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice.js';
import { faIR } from '@mui/x-data-grid/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme(
	{
		palette: {
			primary: { main: '#1976d2' }
		}
	},
	faIR
);

export default function CustomDataGrid({ useMockData = true, rows, columns }) {
	const { data } = useDemoData({
		dataSet: 'Commodity',
		rowLength: 4,
		maxColumns: 6
	});

	const dispatch = useDispatch();
	const useFakeMutation = () => {
		return React.useCallback(
			(user) =>
				new Promise((resolve, reject) => {
					dispatch(showMessage({ message: 'خطا در ثبت کاربر: نام نمی‌تواند خالی باشد' }));
					setTimeout(() => {
						if (user.name?.trim() === '') {
							reject(new Error('Error while saving user: name cannot be empty.'));
						} else {
							resolve({ ...user, name: user.name?.toUpperCase() });
						}
					}, 200);
				}),
			[]
		);
	};
	const mutateRow = useFakeMutation();

	const [snackbar, setSnackbar] = React.useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	const processRowUpdate = React.useCallback(
		async (newRow) => {
			const response = await mutateRow(newRow);
			setSnackbar({ children: 'User successfully saved', severity: 'success' });
			return response;
		},
		[mutateRow]
	);

	const handleProcessRowUpdateError = React.useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);
	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={useMockData ? mockRows : rows}
				columns={useMockData ? mockColumns : columns}
				slots={{
					toolbar: GridToolbar
				}}
				localeText={faIR.components.MuiDataGrid.defaultProps.localeText}
			/>

			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert
						{...snackbar}
						onClose={handleCloseSnackbar}
					/>
				</Snackbar>
			)}
		</div>
	);
}

const mockColumns = [
	{ field: 'name', headerName: 'Name', width: 180, editable: true },
	{
		field: 'age',
		headerName: 'Age',
		type: 'number',
		editable: true,
		align: 'left',
		headerAlign: 'left'
	},
	{
		field: 'dateCreated',
		headerName: 'Date Created',
		type: 'date',
		width: 180,
		editable: true
	},
	{
		field: 'lastLogin',
		headerName: 'Last Login',
		type: 'dateTime',
		width: 220,
		editable: true
	}
];

const mockRows = [
	{
		id: 1,
		name: randomTraderName(),
		age: 25,
		dateCreated: randomCreatedDate(),
		lastLogin: randomUpdatedDate()
	},
	{
		id: 2,
		name: randomTraderName(),
		age: 36,
		dateCreated: randomCreatedDate(),
		lastLogin: randomUpdatedDate()
	},
	{
		id: 3,
		name: randomTraderName(),
		age: 19,
		dateCreated: randomCreatedDate(),
		lastLogin: randomUpdatedDate()
	},
	{
		id: 4,
		name: randomTraderName(),
		age: 28,
		dateCreated: randomCreatedDate(),
		lastLogin: randomUpdatedDate()
	},
	{
		id: 5,
		name: randomTraderName(),
		age: 23,
		dateCreated: randomCreatedDate(),
		lastLogin: randomUpdatedDate()
	}
];
//
// // isCellEditable={(params) => params.row.age % 2 === 0}
// // processRowUpdate={(updatedRow, originalRow) =>
// // 	mySaveOnServerFunction(updatedRow);
// // }
// // onProcessRowUpdateError={handleProcessRowUpdateError}
// {/*{...otherProps}*/}
// {/*processRowUpdate={(updatedRow, originalRow) => {*/}
// {/*	if (shouldDeleteRow(updatedRow)) {*/}
// {/*		return { ...updatedRow, _action: 'delete' };*/}
// {/*	}*/}
// {/*	return updatedRow;*/}
// {/*}}*/}

// localeText={{
// footerRowSelected: (count) =>
// 	count !== 1
// 		? `${count.toLocaleString()} رکورد انتخاب شده است`
// 		: `${count.toLocaleString()} رکورد انتخاب شده است`,
// noRowsLabel: 'هیچ رکوردی پیدا نشد',
// noResultsOverlayLabel: 'خطا در دریافت اطلاعات',
// actionsCellMore: 'بیشتر',
// footerTotalRows: 'حداکثر تعداد سطر‌ها',
// MuiTablePagination: {
// 	labelDisplayedRows: ({ from, to, count }) =>
// 		`${from} - ${to} از ${count === -1 ? `بیشتر از ${to}` : count}`
// }
// {/*}}*/}
