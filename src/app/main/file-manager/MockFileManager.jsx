import { useState, useEffect } from "react";
import FlmngrEditor from '@flmngr/flmngr-react';
import axios from 'axios';
// import "./FileManager.css"; // Custom styles

const MockFileManager = ({ onFileSelect }) => {
	const [files, setFiles] = useState([]);
	const [selectedFilePath, setSelectedFilePath] = useState("");

	useEffect(() => {
		fetchFiles();
	}, []);

	// Fetch files from the mock API
	const fetchFiles = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/files");
			setFiles(
				data.map((file) => ({
					id: file.id,
					name: file.name,
					path: file.path,
					type: file.type
				}))
			);
		} catch (error) {
			console.error("Error fetching files:", error);
		}
	};

	// Mock Upload (POST to JSON Server)
	const handleUpload = async (file) => {
		const newFile = {
			id: Date.now(),
			name: file.name,
			path: `/mock-uploads/${file.name}`,
			type: file.type.startsWith("image") ? "image" : "video"
		};

		try {
			await axios.post("http://localhost:5000/files", newFile);
			fetchFiles();
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	// Mock Delete (DELETE from JSON Server)
	const handleDelete = async (file) => {
		try {
			await axios.delete(`http://localhost:5000/files/${file.id}`);
			fetchFiles();
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	};

	return (
		<div className="file-manager-container">
			<h2>Mock File Manager</h2>
			<FlmngrEditor
				backendUrl="http://localhost:5000/files"
				fileBrowser={{
					files: files.map((file) => ({
						url: file.path,
						title: file.name,
						type: file.type
					})),
					onFileSelect: (file) => {
						setSelectedFilePath(file.url);
						onFileSelect && onFileSelect(file.url);
					},
				}}
				upload={{
					enabled: true,
					multiple: true,
					onFileUpload: handleUpload,
				}}
				delete={{
					enabled: true,
					onFileDelete: (file) => handleDelete(file),
				}}
			/>
			{selectedFilePath && (
				<div className="selected-file-preview">
					<h3>Selected File:</h3>
					<p>{selectedFilePath}</p>
					{selectedFilePath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
						<img src={selectedFilePath} alt="Preview" />
					) : selectedFilePath.match(/\.(mp4|mov)$/i) ? (
						<video controls>
							<source src={selectedFilePath} type="video/mp4" />
						</video>
					) : (
						<p>No preview available</p>
					)}
				</div>
			)}
		</div>
	);
};

export default MockFileManager;
