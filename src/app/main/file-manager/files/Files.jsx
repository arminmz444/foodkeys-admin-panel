import { useState } from 'react';
// import MockFileManager from '../MockFileManager.jsx';
import Flmngr from '@flmngr/flmngr-react';
import Button from '@mui/material/Button';

// import { DataGridPro } from '@mui/x-data-grid-pro';

/**
 * The files page.
 */
function Files() {
	const [selectedImage, setSelectedImage] = useState('');
	const [files, setFiles] = useState([
		{
			name: 'Documents',
			isDirectory: true,
			path: '/Documents',
			updatedAt: '2024-09-09T10:30:00Z'
		},
		{
			name: 'Pictures',
			isDirectory: true,
			path: '/Pictures',
			updatedAt: '2024-09-09T11:00:00Z'
		},
		{
			name: 'Pic.png',
			isDirectory: false,
			path: '/Pictures/Pic.png',
			updatedAt: '2024-09-08T16:45:00Z',
			size: 2048
		}
	]);
	return (
		<>
			<Button
				loading
				loadingIndicator="در حال بارگذاری ..."
				className="bg-green-500	 mt-24"
				onClick={() => {
					Flmngr.open({
						apiKey: 'FLMNFLMN', // default free key
						urlFileManager: 'http://127.0.0.1:3000/flmngr', // demo server
						urlFiles: 'http://127.0.0.1:3000/flmngr/files', // demo file storage
						isMultiple: false, // let selecting a single file
						acceptExtensions: [
							'png',
							'jpg',
							'jpeg',
							'gif',
							'webp',
							'txt',
							'pdf',
							'zip',
							'rar',
							'doc',
							'docx',
							'xls',
							'xlsx',
							'mp3',
							'mp4',
							'mkv'
						],
						onFinish: (files) => {
							console.log('User picked:');
							console.log(files);
							setSelectedImage(files.length > 0 ? files[0] : '');
						}
					});
				}}
			>
				باز کردن برنامه مدیریت فایل
			</Button>

			<Button
				className="bg-green-500	 mt-24"
				onClick={() => {
					Flmngr.editImageAndUpload({
						apiKey: 'FLMN24RR1234123412341234',                  // default free key
						urlFileManager: 'http://127.0.0.1:3000/flmngr', // demo server
						urlFiles: 'http://127.0.0.1:3000/flmngr/files',             // demo file storage
						url: selectedImage,
						onSave: function(urlNew) {
							setSelectedImage(Flmngr.getNoCacheUrl(urlNew));
						}
					});
				}}
			>
				Edit image
			</Button></>
		// <div>
		// 	<h1>Admin Panel</h1>
		// 	<MockFileManager onFileSelect={(path) => setSelectedImage(path)} />
		// 	{selectedImage && (
		// 		<div>
		// 			<h3>Selected File:</h3>
		// 			<p>{selectedImage}</p>
		// 		</div>
		// 	)}
		// </div>
	);
}

export default Files;
