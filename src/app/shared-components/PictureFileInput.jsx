import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

function PictureFileInput({ fieldName, defaultValue }) {
	const { setValue } = useFormContext();
	const [preview, setPreview] = useState(defaultValue || null);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			setUploading(true);
			const formData = new FormData();
			formData.append('file', file);
			try {
				const response = await axios.post('/file/temp', formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
				const tempId = response.data.tempId;
				setValue(fieldName, tempId);
			} catch (error) {
				console.error('Upload failed:', error);
			} finally {
				setUploading(false);
			}
		}
	};

	return (
		<div className="flex flex-col items-start">
			<label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300">
				<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
					<path d="M16.88 9.94a.66.66 0 00-.44-.24H13V7.42a.66.66 0 00-.66-.66H7.66A.66.66 0 007 7.42v2.28H3.56a.66.66 0 00-.66.66v3.05a2.66 2.66 0 002.66 2.66h8.4a2.66 2.66 0 002.66-2.66v-3.05zM11 12v3H9v-3H6.66l3.34-3.34 3.34 3.34H11z" />
				</svg>
				<span className="mt-2 text-sm leading-normal">انتخاب تصویر</span>
				<input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
			</label>
			{uploading && <p className="text-sm text-gray-600 mt-2">در حال آپلود...</p>}
			{preview && (
				<img
					src={preview}
					alt="Preview"
					className="mt-2 max-w-xs rounded-md shadow-md"
				/>
			)}
		</div>
	);
}

export default PictureFileInput;
