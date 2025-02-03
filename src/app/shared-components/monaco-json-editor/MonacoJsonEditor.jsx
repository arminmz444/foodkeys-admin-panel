import { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';

/**
 * MonacoJsonEditor Component
 *
 * This component provides a basic Monaco Editor instance specialized for JSON editing.
 * - Props:
 *   - value: string (initial JSON content)
 *   - onChange: function (callback for whenever the editor content changes)
 *   - height: string or number (the height of the editor)
 *   - readOnly: boolean (optional: makes the editor read-only if true)
 */
function MonacoJsonEditor({ value = '{}', onChange, height = 400, readOnly = false }) {
	const [editorValue, setEditorValue] = useState(value);

	const handleEditorChange = (newValue) => {
		setEditorValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	return (
		<div style={{ border: '1px solid #ccc' }}>
			<Editor
				height={height}
				defaultLanguage="json"
				defaultValue={editorValue}
				onChange={handleEditorChange}
				options={{
					minimap: { enabled: false },
					wordWrap: 'on',
					automaticLayout: true,
				}}
			/>
		</div>
	);
}

export default MonacoJsonEditor;
