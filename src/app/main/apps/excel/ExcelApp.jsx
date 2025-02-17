import CustomSpreadsheet from 'app/shared-components/custom-spreadsheet/CustomSpreadsheet.jsx';

/**
 * The Excel app.
 */
function ExcelApp() {
	return (
		<CustomSpreadsheet
			toolbarButtons={[
				{
					label: 'Custom Action',
					onClick: () => alert('Custom Action Triggered')
				}
			]}
			fetchData={null}
		/>
	);
}

export default ExcelApp;
// {/*	const fetchSpreadsheetData = async () => { */}
// {/*	const response = await fetch('/api/data-endpoint'); */}
// {/*	const jsonData = await response.json(); */}
// {/*	// Transform jsonData to the format required by react-spreadsheet */}
// {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
// {/* }; */}
