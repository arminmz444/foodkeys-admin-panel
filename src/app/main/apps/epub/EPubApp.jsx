import CustomEPubReader from 'app/shared-components/custom-epub-reader/CustomEPubReader.jsx';
import { useState } from 'react';

/**
 * The EPub app.
 */
function EPubApp() {
	const [demo, setDemo] = useState(null);
	return (
		<CustomEPubReader
			toolbarButtons={[
				{
					label: 'فایل دمو',
					onClick: () => setDemo('https://react-reader.metabits.no/files/alice.epub')
				}
			]}
			demo={demo}
			fetchData={null}
		/>
	);
}

export default EPubApp;
// {/*	const fetchSpreadsheetData = async () => { */}
// {/*	const response = await fetch('/api/data-endpoint'); */}
// {/*	const jsonData = await response.json(); */}
// {/*	// Transform jsonData to the format required by react-spreadsheet */}
// {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
// {/* }; */}
