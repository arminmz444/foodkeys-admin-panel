import FormBuilder from 'app/shared-components/form-builder/FormBuilder';

/**
 * The FormBuilder app.
 */
function FormBuilderApp() {
	return (
		<FormBuilder />
	);
}

export default FormBuilderApp;
// {/*	const fetchSpreadsheetData = async () => { */}
// {/*	const response = await fetch('/api/data-endpoint'); */}
// {/*	const jsonData = await response.json(); */}
// {/*	// Transform jsonData to the format required by react-spreadsheet */}
// {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
// {/* }; */}
