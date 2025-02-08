// import React, { useState } from 'react';
// import { Button, Select, MenuItem, TextField, IconButton, Tooltip, Box } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'; // string
// import LooksOneIcon from '@mui/icons-material/LooksOne'; // number
// import CheckBoxIcon from '@mui/icons-material/CheckBox'; // boolean
// import FolderIcon from '@mui/icons-material/Folder'; // object
// import ListIcon from '@mui/icons-material/List'; // array
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import _ from 'lodash';
// import axios from 'axios';
// import 'tailwindcss/tailwind.css'; // ensure tailwind is imported
//
// // a small helper for uploading files (like images) to your backend:
// async function uploadFile(file) {
// 	// This is a placeholder. In your real code, call your Spring Boot upload endpoint.
// 	// Return { path: '...some file path...' }
// 	const formData = new FormData();
// 	formData.append('file', file);
// 	const res = await axios.post('/api/upload', formData, {
// 		headers: { 'Content-Type': 'multipart/form-data' }
// 	});
// 	return res.data; // e.g. { path: "/files/..." }
// }
//
// // Mapping data type -> icon & label
// const dataTypeOptions = [
// 	{ value: 'string', label: 'String', icon: <FormatAlignLeftIcon fontSize="small" /> },
// 	{ value: 'number', label: 'Number', icon: <LooksOneIcon fontSize="small" /> },
// 	{ value: 'boolean', label: 'Boolean', icon: <CheckBoxIcon fontSize="small" /> },
// 	{ value: 'object', label: 'Object', icon: <FolderIcon fontSize="small" /> },
// 	{ value: 'array', label: 'Array', icon: <ListIcon fontSize="small" /> },
// 	{ value: 'file', label: 'File', icon: <CloudUploadIcon fontSize="small" /> }
// ];
//
// // A small MUI Select that shows an icon + label (or just the icon) for data type
// function DataTypeSelect({ value, onChange }) {
// 	return (
// 		<Select
// 			size="small"
// 			value={value}
// 			onChange={(e) => onChange(e.target.value)}
// 			sx={{ minWidth: '40px', marginRight: 1, paddingLeft: 1 }}
// 			renderValue={(selected) => {
// 				const opt = dataTypeOptions.find((o) => o.value === selected);
// 				return opt?.icon ?? 'Type';
// 			}}
// 		>
// 			{dataTypeOptions.map((opt) => (
// 				<MenuItem
// 					key={opt.value}
// 					value={opt.value}
// 				>
// 					<Box
// 						display="flex"
// 						alignItems="center"
// 						gap={1}
// 					>
// 						{opt.icon}
// 						<span>{opt.label}</span>
// 					</Box>
// 				</MenuItem>
// 			))}
// 		</Select>
// 	);
// }
//
// // Returns the "best guess" data type from a JS value
// function guessType(value) {
// 	if (value && typeof value === 'object' && value.__filePath) {
// 		return 'file';
// 	}
//
// 	if (Array.isArray(value)) {
// 		return 'array';
// 	}
//
// 	if (typeof value === 'object' && value !== null) {
// 		return 'object';
// 	}
//
// 	if (typeof value === 'boolean') {
// 		return 'boolean';
// 	}
//
// 	if (typeof value === 'number') {
// 		return 'number';
// 	}
//
// 	return 'string';
// }
//
// // -----------------------------------------------------------------------------
// // The core recursive component that renders a single "field" (key-value pair).
// // -----------------------------------------------------------------------------
// function JsonField({ path, data, onChange, onRemove, depth = 0 }) {
// 	// 'path' is the lodash path string for this key in the overall JSON
// 	// 'data' is the current data at that path
// 	// 'onChange' is a callback(newVal) -> sets the new value at 'path'
// 	// 'onRemove' removes this field from its parent object/array
// 	const [keyName, setKeyName] = React.useState(pathToKey(path));
// 	const [dataType, setDataType] = React.useState(guessType(data));
//
// 	const indentation = {
// 		marginLeft: depth * 16
// 	};
//
// 	// When we rename the key, we also rename it in the parent object
// 	const handleKeyNameChange = (newKey) => {
// 		setKeyName(newKey);
// 		onChangeKey(path, newKey); // rename in parent
// 	};
//
// 	// When we change the type, we transform data accordingly
// 	const handleTypeChange = (newType) => {
// 		setDataType(newType);
// 		let transformed;
// 		switch (newType) {
// 			case 'object':
// 				transformed = {};
// 				break;
// 			case 'array':
// 				transformed = [];
// 				break;
// 			case 'boolean':
// 				transformed = false;
// 				break;
// 			case 'number':
// 				transformed = 0;
// 				break;
// 			case 'file':
// 				transformed = { __filePath: '' };
// 				break;
// 			default:
// 				// string
// 				transformed = '';
// 				break;
// 		}
// 		onChange(transformed);
// 	};
//
// 	// For primitive changes (string, number, boolean)
// 	const handlePrimitiveChange = (val) => {
// 		if (dataType === 'number') {
// 			onChange(Number(val));
// 		} else if (dataType === 'boolean') {
// 			onChange(val === 'true');
// 		} else {
// 			onChange(val);
// 		}
// 	};
//
// 	// For object/array additions
// 	const handleAddObjectField = () => {
// 		// if data is an object, add a new key with empty string
// 		if (dataType === 'object') {
// 			const newKey = `newField${Date.now()}`;
// 			const updated = { ...data, [newKey]: '' };
// 			onChange(updated);
// 		}
// 	};
// 	const handleAddArrayItem = () => {
// 		// if data is an array, push new item
// 		if (dataType === 'array') {
// 			const updated = [...data, ''];
// 			onChange(updated);
// 		}
// 	};
//
// 	// File handling
// 	const handleFileUpload = async (e) => {
// 		const file = e.target.files[0];
//
// 		if (!file) return;
//
// 		try {
// 			const res = await uploadFile(file);
// 			// Suppose the backend returns { path: '/files/...' }
// 			const newVal = { __filePath: res.path };
// 			onChange(newVal);
// 		} catch (err) {
// 			console.error('Upload failed', err);
// 		}
// 	};
//
// 	// Render UI
// 	return (
// 		<div
// 			className="w-full flex flex-col mb-2"
// 			style={indentation}
// 		>
// 			<div className="flex items-center space-x-2">
// 				{/* 1) Remove button */}
// 				{onRemove && (
// 					<Tooltip title="Remove field">
// 						<IconButton
// 							size="small"
// 							color="error"
// 							onClick={onRemove}
// 						>
// 							<DeleteIcon fontSize="small" />
// 						</IconButton>
// 					</Tooltip>
// 				)}
//
// 				{/* 2) Key name input (if we are inside an object). If inside array, we might skip. */}
// 				{isInsideArray(path) ? null : (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						label="Key"
// 						value={keyName}
// 						onChange={(e) => handleKeyNameChange(e.target.value)}
// 						sx={{ width: 100 }}
// 					/>
// 				)}
//
// 				{/* 3) Data type select (icon-based) */}
// 				<DataTypeSelect
// 					value={dataType}
// 					onChange={handleTypeChange}
// 				/>
//
// 				{/* 4) Value or sub-fields: */}
// 				{dataType === 'string' && (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						placeholder="Value"
// 						value={data}
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ minWidth: 120 }}
// 					/>
// 				)}
//
// 				{dataType === 'number' && (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						type="number"
// 						placeholder="Value"
// 						value={data}
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ width: 120 }}
// 					/>
// 				)}
//
// 				{dataType === 'boolean' && (
// 					<Select
// 						size="small"
// 						value={String(data)} // 'true' or 'false'
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ width: 80 }}
// 					>
// 						<MenuItem value="true">True</MenuItem>
// 						<MenuItem value="false">False</MenuItem>
// 					</Select>
// 				)}
//
// 				{dataType === 'file' && (
// 					<div className="flex items-center space-x-2">
// 						{data.__filePath ? (
// 							<span className="text-sm text-gray-600">{data.__filePath}</span>
// 						) : (
// 							<span className="text-sm text-gray-400">No file yet</span>
// 						)}
// 						<Button
// 							variant="contained"
// 							size="small"
// 							startIcon={<CloudUploadIcon />}
// 							component="label"
// 						>
// 							Upload
// 							<input
// 								hidden
// 								type="file"
// 								onChange={handleFileUpload}
// 							/>
// 						</Button>
// 					</div>
// 				)}
// 			</div>
//
// 			{/* 5) If object, recursively render each sub-field */}
// 			{dataType === 'object' && _.isPlainObject(data) && (
// 				<div className="ml-6 mt-2 border-l border-gray-200">
// 					{Object.entries(data).map(([subKey, subVal]) => {
// 						const subPath = path ? `${path}.${subKey}` : subKey;
// 						return (
// 							<JsonField
// 								key={subPath}
// 								path={subPath}
// 								data={subVal}
// 								onChange={(val) => {
// 									// create a new object with updated subVal
// 									const updated = { ...data, [subKey]: val };
// 									onChange(updated);
// 								}}
// 								onRemove={() => {
// 									const updated = { ...data };
// 									delete updated[subKey];
// 									onChange(updated);
// 								}}
// 								depth={depth + 1}
// 							/>
// 						);
// 					})}
// 					<Button
// 						variant="text"
// 						size="small"
// 						startIcon={<AddIcon />}
// 						onClick={handleAddObjectField}
// 						sx={{ marginLeft: 1, color: 'gray' }}
// 					>
// 						Add Field
// 					</Button>
// 				</div>
// 			)}
//
// 			{/* 6) If array, render each item, also recursively if needed */}
// 			{dataType === 'array' && Array.isArray(data) && (
// 				<div className="ml-6 mt-2 border-l border-gray-200">
// 					{data.map((itemVal, index) => {
// 						const subPath = `${path}[${index}]`;
// 						return (
// 							<JsonField
// 								key={subPath}
// 								path={subPath}
// 								data={itemVal}
// 								onChange={(val) => {
// 									const updated = [...data];
// 									updated[index] = val;
// 									onChange(updated);
// 								}}
// 								onRemove={() => {
// 									const updated = [...data];
// 									updated.splice(index, 1);
// 									onChange(updated);
// 								}}
// 								depth={depth + 1}
// 							/>
// 						);
// 					})}
// 					<Button
// 						variant="text"
// 						size="small"
// 						startIcon={<AddIcon />}
// 						onClick={handleAddArrayItem}
// 						sx={{ marginLeft: 1, color: 'gray' }}
// 					>
// 						Add Item
// 					</Button>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
//
// // Helper: checks if path ends with [#], meaning it's in an array
// function isInsideArray(path) {
// 	return /\[\d+\]$/.test(path);
// }
//
// // Helper: extracts the last key portion from a lodash path
// function pathToKey(path) {
// 	if (!path) return '';
//
// 	const parts = path.split('.');
// 	return parts[parts.length - 1].replace(/\[\d+\]$/, '');
// }
//
// // Helper: rename a key in the parent object
// function onChangeKey(path, newKey) {
// 	// This is a placeholder. We must rely on the parent's "onChange" call to rename the field.
// 	// The code inside <JsonField/> actually calls it properly.
// 	// If you want advanced logic, you'd have to handle it at a higher level in the recursion.
// }
//
// // -----------------------------------------------------------------------------
// // Finally, the parent "DynamicJsonForm" that you can use on any page
// // -----------------------------------------------------------------------------
// export default function DynamicFieldGenerator({ initialValue, onSubmit }) {
// 	const [formData, setFormData] = useState(initialValue || {});
//
// 	// On top-level add field
// 	const handleAddRootField = () => {
// 		const newKey = `newField${Date.now()}`;
// 		setFormData({ ...formData, [newKey]: '' });
// 	};
//
// 	const handleFormSubmit = async () => {
// 		// Optional: run zod or some other validation here
// 		// Then call parent's onSubmit with the final JSON
// 		if (onSubmit) {
// 			await onSubmit(formData);
// 		} else {
// 			console.log('Final JSON config:', formData);
// 		}
// 	};
//
// 	return (
// 		<div className="p-4 w-full max-w-4xl mx-auto">
// 			<div className="bg-blue-500 text-white p-2 rounded mb-4">
// 				<h2 className="text-lg font-bold">Dynamic JSON Form</h2>
// 			</div>
// 			<Box className="bg-white p-4 rounded shadow-sm border border-gray-200">
// 				{/* Render root-level fields */}
// 				{Object.entries(formData).map(([key, val]) => (
// 					<JsonField
// 						key={key}
// 						path={key}
// 						data={val}
// 						onChange={(newVal) => {
// 							// update this key in the form data
// 							setFormData((prev) => ({ ...prev, [key]: newVal }));
// 						}}
// 						onRemove={() => {
// 							const updated = _.omit(formData, key);
// 							setFormData(updated);
// 						}}
// 						depth={0}
// 					/>
// 				))}
// 				<Button
// 					variant="outlined"
// 					size="small"
// 					startIcon={<AddIcon />}
// 					onClick={handleAddRootField}
// 					className="mt-2"
// 				>
// 					Add Root Field
// 				</Button>
// 			</Box>
// 			<div className="flex justify-end mt-4">
// 				<Button
// 					variant="outlined"
// 					className="mr-2"
// 					onClick={() => console.log('Cancel')}
// 				>
// 					Cancel
// 				</Button>
// 				<Button
// 					variant="contained"
// 					color="secondary"
// 					onClick={handleFormSubmit}
// 				>
// 					Save
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }






// ----------------------------------------------
//
// import { useState } from 'react';
// import { Box, Button, Select, MenuItem, TextField, IconButton, Tooltip } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'; // string
// import LooksOneIcon from '@mui/icons-material/LooksOne'; // number
// import CheckBoxIcon from '@mui/icons-material/CheckBox'; // boolean
// import FolderIcon from '@mui/icons-material/Folder'; // object
// import ListIcon from '@mui/icons-material/List'; // array
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import _ from 'lodash';
// import axios from 'axios';
// import 'tailwindcss/tailwind.css'; // ensure Tailwind is imported
//
// // -----------------------------
// // 1) File Upload helper
// // -----------------------------
// async function uploadFile(file) {
// 	// In your real code, call your Spring Boot endpoint, e.g. '/api/upload'
// 	const formData = new FormData();
// 	formData.append('file', file);
// 	const res = await axios.post('/api/upload', formData, {
// 		headers: { 'Content-Type': 'multipart/form-data' }
// 	});
// 	// Suppose it returns { path: '/files/...'}
// 	return res.data;
// }
//
// // -----------------------------
// // 2) Data Type selector
// // -----------------------------
// const dataTypeOptions = [
// 	{ value: 'string', label: 'String', icon: <FormatAlignLeftIcon fontSize="small" /> },
// 	{ value: 'number', label: 'Number', icon: <LooksOneIcon fontSize="small" /> },
// 	{ value: 'boolean', label: 'Boolean', icon: <CheckBoxIcon fontSize="small" /> },
// 	{ value: 'object', label: 'Object', icon: <FolderIcon fontSize="small" /> },
// 	{ value: 'array', label: 'Array', icon: <ListIcon fontSize="small" /> },
// 	{ value: 'file', label: 'File', icon: <CloudUploadIcon fontSize="small" /> }
// ];
//
// function DataTypeSelect({ value, onChange }) {
// 	return (
// 		<Select
// 			size="small"
// 			value={value}
// 			onChange={(e) => onChange(e.target.value)}
// 			sx={{ minWidth: '40px', marginRight: 1, paddingLeft: 1 }}
// 			renderValue={(selected) => {
// 				const opt = dataTypeOptions.find((o) => o.value === selected);
// 				return opt?.icon ?? 'Type';
// 			}}
// 		>
// 			{dataTypeOptions.map((opt) => (
// 				<MenuItem
// 					key={opt.value}
// 					value={opt.value}
// 				>
// 					<Box
// 						display="flex"
// 						alignItems="center"
// 						gap={1}
// 					>
// 						{opt.icon}
// 						<span>{opt.label}</span>
// 					</Box>
// 				</MenuItem>
// 			))}
// 		</Select>
// 	);
// }
//
// // -----------------------------
// // 3) Guess Type from a JS Value
// // -----------------------------
// function guessType(value) {
// 	if (value && typeof value === 'object' && value.__filePath) {
// 		return 'file';
// 	}
//
// 	if (Array.isArray(value)) {
// 		return 'array';
// 	}
//
// 	if (typeof value === 'object' && value !== null) {
// 		return 'object';
// 	}
//
// 	if (typeof value === 'boolean') {
// 		return 'boolean';
// 	}
//
// 	if (typeof value === 'number') {
// 		return 'number';
// 	}
//
// 	return 'string';
// }
//
// // -----------------------------
// // 4) The main recursive field
// // -----------------------------
// function JsonField({ path, data, onChange, onRemove, onRenameKey, depth = 0 }) {
// 	// path is the lodash path to this key
// 	// data is the value at this path
// 	// onChange(newVal) sets the new value at this path
// 	// onRemove() removes this field from the parent
// 	// onRenameKey(oldPath, newKeyName) renames the key in the parent object
// 	const dataType = guessType(data);
// 	const [keyName, setKeyName] = useState(pathToKey(path)); // for local text field
//
// 	const indentation = {
// 		marginLeft: depth * 16
// 	};
//
// 	const handleTypeChange = (newType) => {
// 		let transformed;
// 		switch (newType) {
// 			case 'object':
// 				transformed = {};
// 				break;
// 			case 'array':
// 				transformed = [];
// 				break;
// 			case 'boolean':
// 				transformed = false;
// 				break;
// 			case 'number':
// 				transformed = 0;
// 				break;
// 			case 'file':
// 				transformed = { __filePath: '' };
// 				break;
// 			default:
// 				transformed = '';
// 		}
// 		onChange(transformed);
// 	};
//
// 	// Changes a primitive value
// 	const handlePrimitiveChange = (val) => {
// 		if (dataType === 'number') {
// 			onChange(Number(val));
// 		} else if (dataType === 'boolean') {
// 			onChange(val === 'true');
// 		} else {
// 			onChange(val);
// 		}
// 	};
//
// 	// For object or array expansions
// 	const handleAddObjectField = () => {
// 		if (_.isPlainObject(data)) {
// 			const newKey = `newField${Date.now()}`;
// 			const updated = { ...data, [newKey]: '' };
// 			onChange(updated);
// 		}
// 	};
// 	const handleAddArrayItem = () => {
// 		if (Array.isArray(data)) {
// 			onChange([...data, '']);
// 		}
// 	};
//
// 	// File uploads
// 	const handleFileUpload = async (e) => {
// 		const file = e.target.files[0];
//
// 		if (!file) return;
//
// 		try {
// 			const res = await uploadFile(file);
// 			// Suppose res = { path: '/files/...'}
// 			onChange({ __filePath: res.path });
// 		} catch (err) {
// 			console.error('File upload failed', err);
// 		}
// 	};
//
// 	// Handle rename of the key
// 	const handleKeyRename = (newKey) => {
// 		setKeyName(newKey);
//
// 		if (!isInsideArray(path)) {
// 			// Actually rename the field in the parent's object
// 			onRenameKey(path, newKey);
// 		}
// 	};
//
// 	return (
// 		<div
// 			className="w-full flex flex-col mb-2"
// 			style={indentation}
// 		>
// 			<div className="flex items-center space-x-2">
// 				{/* Remove field button, if there's a parent */}
// 				{onRemove && (
// 					<Tooltip title="Remove field">
// 						<IconButton
// 							size="small"
// 							color="error"
// 							onClick={onRemove}
// 						>
// 							<DeleteIcon fontSize="small" />
// 						</IconButton>
// 					</Tooltip>
// 				)}
//
// 				{/* Key Name, only if we're not in an array item */}
// 				{!isInsideArray(path) && (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						label="Key"
// 						value={keyName}
// 						onChange={(e) => handleKeyRename(e.target.value)}
// 						sx={{ width: 100 }}
// 					/>
// 				)}
//
// 				{/* Data type select */}
// 				<DataTypeSelect
// 					value={dataType}
// 					onChange={handleTypeChange}
// 				/>
//
// 				{/* Value input (if primitive or file) */}
// 				{dataType === 'string' && (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						placeholder="Value"
// 						value={data}
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ minWidth: 120 }}
// 					/>
// 				)}
// 				{dataType === 'number' && (
// 					<TextField
// 						size="small"
// 						variant="outlined"
// 						type="number"
// 						placeholder="Value"
// 						value={data}
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ width: 120 }}
// 					/>
// 				)}
// 				{dataType === 'boolean' && (
// 					<Select
// 						size="small"
// 						value={String(data)} // "true" or "false"
// 						onChange={(e) => handlePrimitiveChange(e.target.value)}
// 						sx={{ width: 80 }}
// 					>
// 						<MenuItem value="true">True</MenuItem>
// 						<MenuItem value="false">False</MenuItem>
// 					</Select>
// 				)}
// 				{dataType === 'file' && (
// 					<div className="flex items-center space-x-2">
// 						{data.__filePath ? (
// 							<span className="text-sm text-gray-600">{data.__filePath}</span>
// 						) : (
// 							<span className="text-sm text-gray-400">No file yet</span>
// 						)}
// 						<Button
// 							variant="contained"
// 							size="small"
// 							startIcon={<CloudUploadIcon />}
// 							component="label"
// 						>
// 							Upload
// 							<input
// 								hidden
// 								type="file"
// 								onChange={handleFileUpload}
// 							/>
// 						</Button>
// 					</div>
// 				)}
// 			</div>
//
// 			{/* If object, recursively render sub-fields */}
// 			{dataType === 'object' && _.isPlainObject(data) && (
// 				<div className="ml-6 mt-2 border-l border-gray-200">
// 					{Object.entries(data).map(([subKey, subVal]) => {
// 						const subPath = path ? `${path}.${subKey}` : subKey;
// 						return (
// 							<JsonField
// 								key={subPath}
// 								path={subPath}
// 								data={subVal}
// 								onChange={(newVal) => {
// 									const updated = { ...data, [subKey]: newVal };
// 									onChange(updated);
// 								}}
// 								onRemove={() => {
// 									const updated = { ...data };
// 									delete updated[subKey];
// 									onChange(updated);
// 								}}
// 								onRenameKey={onRenameKey}
// 								depth={depth + 1}
// 							/>
// 						);
// 					})}
// 					<Button
// 						variant="text"
// 						size="small"
// 						startIcon={<AddIcon />}
// 						onClick={handleAddObjectField}
// 						sx={{ marginLeft: 1, color: 'gray' }}
// 					>
// 						Add Field
// 					</Button>
// 				</div>
// 			)}
//
// 			{/* If array, recursively render each item */}
// 			{dataType === 'array' && Array.isArray(data) && (
// 				<div className="ml-6 mt-2 border-l border-gray-200">
// 					{data.map((itemVal, index) => {
// 						const subPath = `${path}[${index}]`;
// 						return (
// 							<JsonField
// 								key={subPath}
// 								path={subPath}
// 								data={itemVal}
// 								onChange={(val) => {
// 									const updated = [...data];
// 									updated[index] = val;
// 									onChange(updated);
// 								}}
// 								onRemove={() => {
// 									const updated = [...data];
// 									updated.splice(index, 1);
// 									onChange(updated);
// 								}}
// 								onRenameKey={onRenameKey}
// 								depth={depth + 1}
// 							/>
// 						);
// 					})}
// 					<Button
// 						variant="text"
// 						size="small"
// 						startIcon={<AddIcon />}
// 						onClick={handleAddArrayItem}
// 						sx={{ marginLeft: 1, color: 'gray' }}
// 					>
// 						Add Item
// 					</Button>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
//
// // Helper: isInsideArray checks if path ends in something like [0]
// function isInsideArray(path) {
// 	return /\[\d+\]$/.test(path);
// }
//
// // Extract the last property name from path ("objectKey.nestedKey" => "nestedKey")
// function pathToKey(path) {
// 	if (!path) return '';
//
// 	const parts = path.split('.');
// 	const last = parts[parts.length - 1];
// 	return last.replace(/\[\d+\]$/, ''); // remove array indexing
// }
//
// // -----------------------------
// // 5) The parent form
// // -----------------------------
// export default function DynamicFieldGenerator({ initialValue, onSubmit }) {
// 	const [formData, setFormData] = useState(initialValue || {});
//
// 	// Add a new root field
// 	const handleAddRootField = () => {
// 		const newKey = `newField${Date.now()}`;
// 		setFormData((prev) => ({ ...prev, [newKey]: '' }));
// 	};
//
// 	// Rename a key in the object structure
// 	// e.g. renameKey('parent.child.oldKey', 'newKeyName')
// 	const handleRenameKey = (oldPath, newKey) => {
// 		setFormData((prev) => {
// 			const copy = _.cloneDeep(prev);
// 			// parse out the parent path
// 			const pathParts = oldPath.split('.');
// 			const oldKey = pathParts.pop();
// 			const parentPath = pathParts.join('.');
//
// 			if (!oldKey || !newKey || oldKey === newKey) {
// 				return copy; // no rename needed
// 			}
//
// 			const parentObj = parentPath ? _.get(copy, parentPath) : copy;
//
// 			if (_.isPlainObject(parentObj) && parentObj.hasOwnProperty(oldKey)) {
// 				// rename
// 				parentObj[newKey] = parentObj[oldKey];
// 				delete parentObj[oldKey];
// 			}
//
// 			return copy;
// 		});
// 	};
//
// 	// Submit final formData
// 	const handleFormSubmit = async () => {
// 		// Optionally do zod or other validations
// 		if (onSubmit) {
// 			await onSubmit(formData);
// 		} else {
// 			console.log('Final JSON config:', formData);
// 		}
// 	};
//
// 	return (
// 		<div className="p-4 w-full max-w-4xl mx-auto">
// 			<div className="bg-blue-500 text-white p-2 rounded mb-4">
// 				<h2 className="text-lg font-bold">Dynamic JSON Form</h2>
// 			</div>
// 			<Box className="bg-white p-4 rounded shadow-sm border border-gray-200">
// 				{/* Render each top-level property */}
// 				{Object.entries(formData).map(([key, val]) => (
// 					<JsonField
// 						key={key}
// 						path={key}
// 						data={val}
// 						onChange={(newVal) => {
// 							setFormData((prev) => ({ ...prev, [key]: newVal }));
// 						}}
// 						onRemove={() => {
// 							setFormData((prev) => _.omit(prev, key));
// 						}}
// 						onRenameKey={handleRenameKey}
// 						depth={0}
// 					/>
// 				))}
// 				<Button
// 					variant="outlined"
// 					size="small"
// 					startIcon={<AddIcon />}
// 					onClick={handleAddRootField}
// 					className="mt-2"
// 				>
// 					Add Root Field
// 				</Button>
// 			</Box>
//
// 			<div className="flex justify-end mt-4">
// 				<Button
// 					variant="outlined"
// 					className="mr-2"
// 					onClick={() => console.log('Cancel')}
// 				>
// 					Cancel
// 				</Button>
// 				<Button
// 					variant="contained"
// 					color="secondary"
// 					onClick={handleFormSubmit}
// 				>
// 					Save
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }


import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
	Box,
	Button,
	Select,
	MenuItem,
	TextField,
	IconButton,
	Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'; // string
import LooksOneIcon from '@mui/icons-material/LooksOne'; // number
import CheckBoxIcon from '@mui/icons-material/CheckBox'; // boolean
import FolderIcon from '@mui/icons-material/Folder'; // object
import ListIcon from '@mui/icons-material/List'; // array
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import axios from 'axios';
import 'tailwindcss/tailwind.css'; // ensure Tailwind is imported
import debounce from 'lodash.debounce';

// -----------------------------
// 1) File Upload helper (example)
// -----------------------------
async function uploadFile(file) {
	// In real code, call your Spring Boot endpoint (e.g. '/api/upload')
	const formData = new FormData();
	formData.append('file', file);
	const res = await axios.post('/api/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	// Suppose it returns { path: '/files/...'}
	return res.data;
}

// -----------------------------
// 2) Data type selector definitions
// -----------------------------
const dataTypeOptions = [
	{ value: 'string', label: 'String', icon: <FormatAlignLeftIcon fontSize="small" /> },
	{ value: 'number', label: 'Number', icon: <LooksOneIcon fontSize="small" /> },
	{ value: 'boolean', label: 'Boolean', icon: <CheckBoxIcon fontSize="small" /> },
	{ value: 'object', label: 'Object', icon: <FolderIcon fontSize="small" /> },
	{ value: 'array', label: 'Array', icon: <ListIcon fontSize="small" /> },
	{ value: 'file', label: 'File', icon: <CloudUploadIcon fontSize="small" /> },
];

function DataTypeSelect({ value, onChange }) {
	return (
		<Select
			size="small"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			sx={{ minWidth: '40px', marginRight: 1, paddingLeft: 1 }}
			renderValue={(selected) => {
				const opt = dataTypeOptions.find((o) => o.value === selected);
				return opt?.icon ?? 'Type';
			}}
		>
			{dataTypeOptions.map((opt) => (
				<MenuItem key={opt.value} value={opt.value}>
					<Box display="flex" alignItems="center" gap={1}>
						{opt.icon}
						<span>{opt.label}</span>
					</Box>
				</MenuItem>
			))}
		</Select>
	);
}

// -----------------------------
// 3) Guess Type from a JS value
// -----------------------------
function guessType(value) {
	if (value && typeof value === 'object' && value.__filePath) {
		return 'file';
	} else if (Array.isArray(value)) {
		return 'array';
	} else if (typeof value === 'object' && value !== null) {
		return 'object';
	} else if (typeof value === 'boolean') {
		return 'boolean';
	} else if (typeof value === 'number') {
		return 'number';
	}
	return 'string';
}

// Helper: isInsideArray checks if path ends in something like [0]
function isInsideArray(path) {
	return /\[\d+\]$/.test(path);
}

// Extract the last property name from path ("objectKey.nestedKey" => "nestedKey")
function pathToKey(path) {
	if (!path) return '';
	const parts = path.split('.');
	const last = parts[parts.length - 1];
	return last.replace(/\[\d+\]$/, ''); // remove [n] if array
}

// -----------------------------
// 4) The core recursive field
// -----------------------------
function JsonField({
					   path,
					   data,
					   onChange,
					   onRemove,
					   onRenameKey,
					   depth = 0,
				   }) {
	// This component is re-rendered whenever the parent changes the data for `path`.
	// We store a local state for the Key Name, but update parent's object with a debounce.
	const [keyName, setKeyName] = useState(pathToKey(path));
	const dataType = guessType(data);

	// We store the original path in a ref, so we know which key to rename in the parent.
	// (Because once we rename it, the parent's path changes.)
	const originalPathRef = useRef(path);

	// Debounced rename function - only called after 500ms pause
	const renameKeyDebounced = useMemo(
		() =>
			debounce((oldPath, newKey) => {
				if (!isInsideArray(oldPath) && newKey.trim().length > 0) {
					onRenameKey(oldPath, newKey);

					// Now that we've renamed in parent object, we must update `originalPathRef`
					// so that subsequent changes refer to the new path.
					const parts = oldPath.split('.');
					parts[parts.length - 1] = newKey; // replace last segment
					originalPathRef.current = parts.join('.');
				}
			}, 1000),
		[onRenameKey]
	);

	// On local key change, we only update local state immediately,
	// then trigger a debounced rename to the parent object.
	const handleKeyRename = (newKey) => {
		setKeyName(newKey);
		renameKeyDebounced(originalPathRef.current, newKey);
	};

	// Indentation for nested fields
	const indentation = {
		marginLeft: depth * 16,
	};

	// Changing data type
	const handleTypeChange = (newType) => {
		let transformed;
		switch (newType) {
			case 'object':
				transformed = {};
				break;
			case 'array':
				transformed = [];
				break;
			case 'boolean':
				transformed = false;
				break;
			case 'number':
				transformed = 0;
				break;
			case 'file':
				transformed = { __filePath: '' };
				break;
			default:
				transformed = '';
		}
		onChange(transformed);
	};

	// Changing a primitive (string/number/boolean)
	const handlePrimitiveChange = (val) => {
		if (dataType === 'number') {
			onChange(Number(val));
		} else if (dataType === 'boolean') {
			onChange(val === 'true');
		} else {
			onChange(val);
		}
	};

	// Adding new sub-fields for objects/arrays
	const handleAddObjectField = () => {
		if (_.isPlainObject(data)) {
			const newKey = 'newField' + Date.now();
			const updated = { ...data, [newKey]: '' };
			onChange(updated);
		}
	};
	const handleAddArrayItem = () => {
		if (Array.isArray(data)) {
			onChange([...data, '']);
		}
	};

	// File uploads
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		try {
			const res = await uploadFile(file); // Suppose returns { path: '/files/...'}
			onChange({ __filePath: res.path });
		} catch (err) {
			console.error('File upload failed', err);
		}
	};

	// Cleanup the debounce on unmount
	useEffect(() => {
		return () => renameKeyDebounced.cancel();
	}, [renameKeyDebounced]);

	return (
		<div className="w-full flex flex-col mb-2" style={indentation}>
			<div className="flex items-center space-x-2">
				{/* Remove field button */}
				{onRemove && (
					<Tooltip title="Remove field">
						<IconButton size="small" color="error" onClick={onRemove}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{/* Key Name field (if not array item) */}
				{!isInsideArray(originalPathRef.current) && (
					<TextField
						size="small"
						variant="outlined"
						label="Key"
						value={keyName}
						onChange={(e) => handleKeyRename(e.target.value)}
						sx={{ width: 100 }}
					/>
				)}

				{/* Data type selector */}
				<DataTypeSelect value={dataType} onChange={handleTypeChange} />

				{/* For primitive/file types, show input */}
				{dataType === 'string' && (
					<TextField
						size="small"
						variant="outlined"
						placeholder="Value"
						value={data}
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ minWidth: 120 }}
					/>
				)}

				{dataType === 'number' && (
					<TextField
						size="small"
						variant="outlined"
						type="number"
						placeholder="Value"
						value={data}
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ width: 120 }}
					/>
				)}

				{dataType === 'boolean' && (
					<Select
						size="small"
						value={String(data)} // "true" or "false"
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ width: 80 }}
					>
						<MenuItem value="true">True</MenuItem>
						<MenuItem value="false">False</MenuItem>
					</Select>
				)}

				{dataType === 'file' && (
					<div className="flex items-center space-x-2">
						{data.__filePath ? (
							<span className="text-sm text-gray-600">{data.__filePath}</span>
						) : (
							<span className="text-sm text-gray-400">No file yet</span>
						)}
						<Button
							variant="contained"
							size="small"
							startIcon={<CloudUploadIcon />}
							component="label"
						>
							Upload
							<input hidden type="file" onChange={handleFileUpload} />
						</Button>
					</div>
				)}
			</div>

			{/* If object, render its fields recursively */}
			{dataType === 'object' && _.isPlainObject(data) && (
				<div className="ml-6 mt-2 border-l border-gray-200">
					{Object.entries(data).map(([subKey, subVal]) => {
						const subPath = `${originalPathRef.current}.${subKey}`;
						return (
							<JsonField
								key={subPath}
								path={subPath}
								data={subVal}
								onChange={(newVal) => {
									const updated = { ...data, [subKey]: newVal };
									onChange(updated);
								}}
								onRemove={() => {
									const updated = { ...data };
									delete updated[subKey];
									onChange(updated);
								}}
								onRenameKey={onRenameKey}
								depth={depth + 1}
							/>
						);
					})}
					<Button
						variant="text"
						size="small"
						startIcon={<AddIcon />}
						onClick={handleAddObjectField}
						sx={{ marginLeft: 1, color: 'gray' }}
					>
						Add Field
					</Button>
				</div>
			)}

			{/* If array, render each item recursively */}
			{dataType === 'array' && Array.isArray(data) && (
				<div className="ml-6 mt-2 border-l border-gray-200">
					{data.map((itemVal, index) => {
						const subPath = `${originalPathRef.current}[${index}]`;
						return (
							<JsonField
								key={subPath}
								path={subPath}
								data={itemVal}
								onChange={(val) => {
									const updated = [...data];
									updated[index] = val;
									onChange(updated);
								}}
								onRemove={() => {
									const updated = [...data];
									updated.splice(index, 1);
									onChange(updated);
								}}
								onRenameKey={onRenameKey}
								depth={depth + 1}
							/>
						);
					})}
					<Button
						variant="text"
						size="small"
						startIcon={<AddIcon />}
						onClick={handleAddArrayItem}
						sx={{ marginLeft: 1, color: 'gray' }}
					>
						Add Item
					</Button>
				</div>
			)}
		</div>
	);
}

// -----------------------------
// 5) The Parent "DynamicJsonForm" Container
// -----------------------------
export default function DynamicFieldGenerator({ initialValue, onSubmit }) {
	const [formData, setFormData] = useState(initialValue || {});

	// Add a new root field
	const handleAddRootField = () => {
		const newKey = 'newField' + Date.now();
		setFormData((prev) => ({ ...prev, [newKey]: '' }));
	};

	// Actually do the rename in our top-level state
	// oldPath = "some.nested.oldKey", newKey = "firstName"
	const handleRenameKey = (oldPath, newKey) => {
		setFormData((prev) => {
			const copy = _.cloneDeep(prev);
			const pathParts = oldPath.split('.');
			const oldKey = pathParts.pop();
			const parentPath = pathParts.join('.');
			if (!oldKey || !newKey || oldKey === newKey) {
				return copy; // no rename needed
			}
			const parentObj = parentPath ? _.get(copy, parentPath) : copy;
			if (_.isPlainObject(parentObj) && parentObj.hasOwnProperty(oldKey)) {
				parentObj[newKey] = parentObj[oldKey];
				delete parentObj[oldKey];
			}
			return copy;
		});
	};

	// Final submission
	const handleFormSubmit = async () => {
		// If you need zod or other validations, do them here:
		if (onSubmit) {
			await onSubmit(formData);
		} else {
			console.log('Final JSON config:', formData);
		}
	};

	return (
		<div className="p-4 w-full max-w-4xl mx-auto">
			<div className="bg-blue-500 text-white p-2 rounded mb-4">
				<h2 className="text-lg font-bold">Dynamic JSON Form</h2>
			</div>

			<Box className="bg-white p-4 rounded shadow-sm border border-gray-200">
				{Object.entries(formData).map(([key, val]) => (
					<JsonField
						key={key}
						path={key}
						data={val}
						onChange={(newVal) => {
							setFormData((prev) => ({ ...prev, [key]: newVal }));
						}}
						onRemove={() => {
							setFormData((prev) => _.omit(prev, key));
						}}
						onRenameKey={handleRenameKey}
						depth={0}
					/>
				))}
				<Button
					variant="outlined"
					size="small"
					startIcon={<AddIcon />}
					onClick={handleAddRootField}
					className="mt-2"
				>
					Add Root Field
				</Button>
			</Box>

			<div className="flex justify-end mt-4">
				<Button variant="outlined" className="mr-2" onClick={() => console.log('Cancel')}>
					Cancel
				</Button>
				<Button variant="contained" color="secondary" onClick={handleFormSubmit}>
					Save
				</Button>
			</div>
		</div>
	);
}
