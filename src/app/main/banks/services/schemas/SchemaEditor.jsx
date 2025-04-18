import { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MonacoJsonEditor from '../../../../shared-components/monaco-json-editor/MonacoJsonEditor';
import { registerJsonSchema } from './registerJsonSchema.js';
import schemaDefinition from './myLocalSchema.json';

function SchemaEditor() {
	const initialJson = JSON.stringify(
		{
			title: 'My Service Schema',
			description: 'Describe what this service does.',
			properties: {
				companyName: { type: 'string', required: true },
				subCategory: { type: 'string' }
			}
		},
		null,
		2
	);

	const [schemaValue, setSchemaValue] = useState(initialJson);

	useEffect(() => {
		registerJsonSchema(initialJson, schemaDefinition);
	}, []);

	const handleEditorChange = useCallback((newValue) => {
		setSchemaValue(newValue);
	}, []);

	const handleSubmitSchema = () => {
		// axios.post("/service/schema") call backend
		console.log('Submitted Schema Value:', schemaValue);
		alert('Schema submitted! Check console for details.');
	};

	return (
		<div style={{ padding: 16 }}>
			<Typography
				variant="h5"
				gutterBottom
			>
				ویرایشگر ساختار سرویس
			</Typography>
			<MonacoJsonEditor
				value={schemaValue}
				onChange={handleEditorChange}
				height={400}
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleSubmitSchema}
				style={{ marginTop: 16 }}
			>
				ذخیره ساختار سرویس
			</Button>
		</div>
	);
}

export default SchemaEditor;
