import CustomWhiteBoard2 from 'app/shared-components/custom-whiteboard/CustomWhiteBoard2.jsx';

/**
 * The Whiteboard app.
 */
function WhiteboardApp() {
	return (
		<CustomWhiteBoard2
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

export default WhiteboardApp;
// {/*	const fetchSpreadsheetData = async () => { */}
// {/*	const response = await fetch('/api/data-endpoint'); */}
// {/*	const jsonData = await response.json(); */}
// {/*	// Transform jsonData to the format required by react-spreadsheet */}
// {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
// {/* }; */}
