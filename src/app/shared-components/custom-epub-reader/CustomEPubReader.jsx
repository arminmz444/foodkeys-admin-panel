import { useEffect, useState } from 'react';
import { ReactReader } from 'react-reader';
import { Button, AppBar, Toolbar } from '@mui/material';

function CustomEPubReader({ toolbarButtons = [], demo, fetchData }) {
	const [epubUrl, setEpubUrl] = useState(null);
	const [location, setLocation] = useState(0);

	useEffect(() => {
		if (demo) setEpubUrl(demo);
	}, [demo]);
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const url = URL.createObjectURL(file);
			setEpubUrl(url);
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			<AppBar position="static">
				<Toolbar>
					<Button
						variant="contained"
						component="label"
						className="mr-2 text-black"
					>
						باز کردن فایل
						<input
							type="file"
							accept=".epub"
							hidden
							onChange={handleFileUpload}
						/>
					</Button>
					{toolbarButtons.map((btn, index) => (
						<Button
							key={index}
							variant="contained"
							className="mr-2 ms-4 text-black"
							onClick={btn.onClick}
						>
							{btn.label}
						</Button>
					))}
				</Toolbar>
			</AppBar>
			<div
				dir="ltr"
				className="flex-grow w-full h-full"
			>
				{epubUrl ? (
					<ReactReader
						epubInitOptions={{
							openAs: 'epub'
						}}
						url={epubUrl}
						location={location}
						locationChanged={(epubLoc) => setLocation(epubLoc)}
					/>
				) : (
					<div dir="rtl" className="flex items-center justify-center h-full text-xl text-gray-500">یک فایل EPUB آپلود کنید</div>
				)}
			</div>
		</div>
	);
}

export default CustomEPubReader;
