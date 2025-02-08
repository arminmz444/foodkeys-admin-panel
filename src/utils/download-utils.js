import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1/file-system';

export const downloadFileOrFolder = async (username, filePath, downloadName = null) => {
	try {
		const url = `${API_BASE_URL}/download/${username}/${filePath}`;

		const response = await axios.get(url, {
			responseType: 'blob',
			params: downloadName ? { downloadName } : {}
		});

		const blobUrl = URL.createObjectURL(response.data);

		// Create an anchor <a> element dynamically
		const link = document.createElement('a');
		link.href = blobUrl;
		link.setAttribute('download', downloadName || extractFilename(response)); // Set the filename
		link.setAttribute('target', '_blank'); // Open in a new tab
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link); // Clean up after download

		// Optional: Revoke the Blob URL after some time (memory cleanup)
		setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
		//
		// const filename = downloadName || extractFilename(response);
		//
		// saveAs(response.data, filename);
		// alert('File downloaded successfully');
		console.log('File downloaded successfully');
	} catch (error) {
		console.error('Error downloading file:', error);
		// alert('Failed to download file!');
	}
};

const extractFilename = (response) => {
	const contentDisposition = response.headers['content-disposition'];

	if (contentDisposition) {
		const match = contentDisposition.match(/filename="(.+)"/);
		return match ? match[1] : 'download';
	}

	return 'download';
};

export const handleDownload = (payload) => {
	downloadFileOrFolder(payload?.username, payload?.filePath);
};
