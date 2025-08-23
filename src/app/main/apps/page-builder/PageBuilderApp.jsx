import GrapesEditor from 'app/shared-components/GrapesEditor.jsx';
import EnhancedGrapesJSEditor from "app/shared-components/enhanced-grapes-js/EnhancedGrapesJSEditor.jsx";

/**
 * The PageBuilder app.
 */
function PageBuilderApp() {
	return (
		<EnhancedGrapesJSEditor />
	);
}

export default PageBuilderApp;
// {/*	const fetchSpreadsheetData = async () => { */}
// {/*	const response = await fetch('/api/data-endpoint'); */}
// {/*	const jsonData = await response.json(); */}
// {/*	// Transform jsonData to the format required by react-spreadsheet */}
// {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
// {/* }; */}
