import React, { useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Button, AppBar, Toolbar } from '@mui/material';
import { read, utils, writeFile } from 'xlsx';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import FuseScrollbars from '@fuse/core/FuseScrollbars/index.js';
import FusePageSimple from '@fuse/core/FusePageSimple/index.js';

function CustomSpreadsheet({ toolbarButtons = [], fetchData }) {
	const [data, setData] = useState([[]]);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		// eslint-disable-next-line no-undef
		const reader = new FileReader();
		reader.onload = (e) => {
			const workbook = read(e.target.result, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
			const formattedData = jsonData.map((row) => row.map((cell) => ({ value: cell })));
			setData(formattedData);
		};
		reader.readAsBinaryString(file);
	};

	const handleExport = (format) => {
		const worksheetData = data.map((row) => row.map((cell) => cell.value));
		const worksheet = utils.aoa_to_sheet(worksheetData);
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		const fileExtension = format === 'xlsx' ? '.xlsx' : '.csv';
		writeFile(workbook, `spreadsheet_data${fileExtension}`);
	};

	const fetchDataFromAPI = async () => {
		if (fetchData) {
			const apiData = await fetchData();
			setData(apiData);
		}
	};

	React.useEffect(() => {
		fetchDataFromAPI();
	}, []);

	return (
		<div
			dir="ltr"
			className="w-full overflow-scroll"
		>
			<FusePageCarded
				scroll="normal"
				content={
						<Spreadsheet
							data={data}
							onChange={setData}
							className="w-full text-15 overflow-scroll"
						/>
				}
				header={
					<AppBar position="relative">
						<Toolbar>
							<Button
								variant="contained"
								component="label"
								className="mr-2 text-black"
							>
								باز کردن فایل
								<input
									type="file"
									accept=".csv, .xls, .xlsx"
									hidden
									onChange={handleFileUpload}
								/>
							</Button>
							<Button
								variant="contained"
								className="mr-2 text-black"
								onClick={() => handleExport('csv')}
							>
								خروجی CSV
							</Button>
							<Button
								variant="contained"
								className="mr-2 text-black"
								onClick={() => handleExport('xlsx')}
							>
								خروجی XLSX
							</Button>
							{toolbarButtons.map((btn, index) => (
								<Button
									key={index}
									variant="contained text-black"
									className="mr-2"
									onClick={btn.onClick}
								>
									{btn.label}
								</Button>
							))}
						</Toolbar>
					</AppBar>
				}
			/>
		</div>
	);
}

export default CustomSpreadsheet;
