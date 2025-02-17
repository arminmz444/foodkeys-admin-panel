import { useState, useRef, useMemo, useEffect } from 'react';
import {
	Box,
	Button,
	Container,
	IconButton,
	MenuItem,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography
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

async function uploadFile(file) {
	const formData = new FormData();
	formData.append('file', file);
	const res = await axios.post('/api/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});
	return res.data;
}

const dataTypeOptions = [
	{ value: 'string', label: 'String', icon: <FormatAlignLeftIcon fontSize="small" /> },
	{ value: 'number', label: 'Number', icon: <LooksOneIcon fontSize="small" /> },
	{ value: 'boolean', label: 'Boolean', icon: <CheckBoxIcon fontSize="small" /> },
	{ value: 'object', label: 'Object', icon: <FolderIcon fontSize="small" /> },
	{ value: 'array', label: 'Array', icon: <ListIcon fontSize="small" /> },
	{ value: 'file', label: 'File', icon: <CloudUploadIcon fontSize="small" /> }
];

function DataTypeSelect({ value, onChange }) {
	return (
		<Select
			size="small"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			sx={{ minWidth: 40, mr: 1, pl: 1 }}
			renderValue={(selected) => {
				const opt = dataTypeOptions.find((o) => o.value === selected);
				return opt?.icon ?? 'Type';
			}}
		>
			{dataTypeOptions.map((opt) => (
				<MenuItem
					key={opt.value}
					value={opt.value}
				>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
					>
						{opt.icon}
						<span>{opt.label}</span>
					</Stack>
				</MenuItem>
			))}
		</Select>
	);
}

function guessType(value) {
	if (value && typeof value === 'object' && value.__filePath) {
		return 'file';
	}

	if (Array.isArray(value)) {
		return 'array';
	}

	if (typeof value === 'object' && value !== null) {
		return 'object';
	}

	if (typeof value === 'boolean') {
		return 'boolean';
	}

	if (typeof value === 'number') {
		return 'number';
	}

	return 'string';
}

function isInsideArray(path) {
	return /\[\d+\]$/.test(path);
}

function pathToKey(path) {
	if (!path) return '';

	const parts = path.split('.');
	const last = parts[parts.length - 1];
	return last.replace(/\[\d+\]$/, ''); // remove [n] if array
}

function JsonField({ path, data, onChange, onRemove, onRenameKey, depth = 0 }) {
	const [keyName, setKeyName] = useState(pathToKey(path));
	const dataType = guessType(data);

	const originalPathRef = useRef(path);

	const renameKeyDebounced = useMemo(
		() =>
			debounce((oldPath, newKey) => {
				if (!isInsideArray(oldPath) && newKey.trim().length > 0) {
					onRenameKey(oldPath, newKey);

					const parts = oldPath.split('.');
					parts[parts.length - 1] = newKey;
					originalPathRef.current = parts.join('.');
				}
			}, 1000),
		[onRenameKey]
	);

	const handleKeyRename = (newKey) => {
		setKeyName(newKey);
		renameKeyDebounced(originalPathRef.current, newKey);
	};
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

	const handlePrimitiveChange = (val) => {
		if (dataType === 'number') {
			onChange(Number(val));
		} else if (dataType === 'boolean') {
			onChange(val === 'true');
		} else {
			onChange(val);
		}
	};

	const handleAddObjectField = () => {
		if (_.isPlainObject(data)) {
			const newKey = `newField${Date.now()}`;
			const updated = { ...data, [newKey]: '' };
			onChange(updated);
		}
	};
	const handleAddArrayItem = () => {
		if (Array.isArray(data)) {
			onChange([...data, '']);
		}
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];

		if (!file) return;

		try {
			const res = await uploadFile(file);
			onChange({ __filePath: res.path });
		} catch (err) {
			console.error('File upload failed', err);
		}
	};

	useEffect(() => {
		return () => renameKeyDebounced.cancel();
	}, [renameKeyDebounced]);

	return (
		<Box sx={{ ml: depth * 2, mb: 2 }}>
			<Stack
				direction="row"
				spacing={2}
				alignItems="center"
			>
				{onRemove && (
					<Tooltip title="Remove field">
						<IconButton
							size="small"
							color="error"
							onClick={onRemove}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{!isInsideArray(originalPathRef.current) && (
					<TextField
						size="small"
						variant="outlined"
						label="کلید فیلد (انگلیسی)"
						value={keyName}
						onChange={(e) => handleKeyRename(e.target.value)}
						sx={{ width: 200 }}
					/>
				)}

				<DataTypeSelect
					value={dataType}
					onChange={handleTypeChange}
				/>

				{dataType === 'string' && (
					<TextField
						size="small"
						variant="outlined"
						placeholder="مقدار"
						value={data}
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ width: 120 }}
					/>
				)}

				{dataType === 'number' && (
					<TextField
						size="small"
						variant="outlined"
						type="number"
						placeholder="مقدار"
						value={data}
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ width: 120 }}
					/>
				)}

				{dataType === 'boolean' && (
					<Select
						size="small"
						value={String(data)}
						onChange={(e) => handlePrimitiveChange(e.target.value)}
						sx={{ width: 80 }}
					>
						<MenuItem value="true">True</MenuItem>
						<MenuItem value="false">False</MenuItem>
					</Select>
				)}

				{dataType === 'file' && (
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
					>
						{data.__filePath ? (
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{data.__filePath}
							</Typography>
						) : (
							<Typography
								variant="body2"
								color="textDisabled"
							>
								No file yet
							</Typography>
						)}
						<Button
							variant="contained"
							size="small"
							startIcon={<CloudUploadIcon />}
							component="label"
						>
							Upload
							<input
								hidden
								type="file"
								onChange={handleFileUpload}
							/>
						</Button>
					</Stack>
				)}
			</Stack>

			{dataType === 'object' && _.isPlainObject(data) && (
				<Box
					ml={2}
					mt={2}
					sx={{ borderLeft: 1, borderColor: 'divider', pl: 2 }}
				>
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
						sx={{ ml: 1, color: 'text.secondary' }}
					>
						Add Field
					</Button>
				</Box>
			)}

			{dataType === 'array' && Array.isArray(data) && (
				<Box
					ml={2}
					mt={2}
					sx={{ borderLeft: 1, borderColor: 'divider', pl: 2 }}
				>
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
						sx={{ ml: 1, color: 'text.secondary' }}
					>
						Add Item
					</Button>
				</Box>
			)}
		</Box>
	);
}

export default function DynamicFieldGenerator({ initialValue, onSubmit }) {
	const [formData, setFormData] = useState(initialValue || {});

	const handleAddRootField = () => {
		const newKey = `newField${Date.now()}`;
		setFormData((prev) => ({ ...prev, [newKey]: '' }));
	};

	const handleRenameKey = (oldPath, newKey) => {
		setFormData((prev) => {
			const copy = _.cloneDeep(prev);
			const pathParts = oldPath.split('.');
			const oldKey = pathParts.pop();
			const parentPath = pathParts.join('.');

			if (!oldKey || !newKey || oldKey === newKey) {
				return copy;
			}

			const parentObj = parentPath ? _.get(copy, parentPath) : copy;

			if (_.isPlainObject(parentObj) && parentObj.hasOwnProperty(oldKey)) {
				parentObj[newKey] = parentObj[oldKey];
				delete parentObj[oldKey];
			}

			return copy;
		});
	};

	const handleFormSubmit = async () => {
		if (onSubmit) {
			await onSubmit(formData);
		} else {
			console.log('Final JSON config:', formData);
		}
	};

	return (
		<Container
			fullWidth
			sx={{ p: 4, width: '100%' }}
		>
			<Box
				sx={{
					bgcolor: 'primary.main',
					color: 'primary.contrastText',
					p: 2,
					borderRadius: 1,
					mb: 4
				}}
			>
				<Typography
					variant="h6"
					component="h2"
				>
					فرم ساختار سرویس
				</Typography>
			</Box>

			<Box
				sx={{
					bgcolor: 'background.paper',
					p: 4,
					borderRadius: 1,
					boxShadow: 1,
					border: '1px solid',
					borderColor: 'divider'
				}}
			>
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
					sx={{ mt: 2 }}
				>
					افزودن فیلد به ریشه
				</Button>
			</Box>

			<Stack
				direction="row"
				spacing={2}
				justifyContent="flex-end"
				sx={{ mt: 4 }}
			>
				<Button
					variant="outlined"
					onClick={() => console.log('Cancel')}
				>
					لغو
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleFormSubmit}
				>
					ذخیره
				</Button>
			</Stack>
		</Container>
	);
}
