import MediaPlayer from 'app/shared-components/media-player/MediaPlayer.jsx';
import { useState } from 'react';
import { MEDIA_TYPES } from '../../../core/enums/media-types.js';


const mediaList = [
	{
		id: 'https://rozmusic.com/wp-content/uploads/2025/01/Omid-Hajili-Zeynoo.jpg',
		type: MEDIA_TYPES.IMAGE,
		src: 'https://rozmusic.com/wp-content/uploads/2025/01/Omid-Hajili-Zeynoo.jpg',
		thumbnail: 'https://rozmusic.com/wp-content/uploads/2025/01/Omid-Hajili-Zeynoo.jpg',
		fileTypePrefix: ''
	},
	{
		id: 'https://static.cdn.asset.aparat.com/avt/62880323_15s.mp4',
		type: MEDIA_TYPES.VIDEO,
		src: 'https://static.cdn.asset.aparat.com/avt/62880323_15s.mp4',
		thumbnail: 'https://rozmusic.com/wp-content/uploads/2025/01/Parsa-Haghparast-Khosh-Ghalb.jpg',
		fileTypePrefix: ''
	},
	{
		id: 'https://dl.rozmusic.com/Music/1403/11/11/Omid%20Hajili%20-%20Zeynoo%20%28128%29.mp3',
		type: MEDIA_TYPES.AUDIO,
		src: 'https://dl.rozmusic.com/Music/1403/11/11/Omid%20Hajili%20-%20Zeynoo%20%28128%29.mp3',
		thumbnail: 'https://rozmusic.com/wp-content/uploads/2025/01/Omid-Hajili-Zeynoo.jpg',
		fileTypePrefix: ''
	}
];

const MediaPlayerList = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentMedia = mediaList[currentIndex];

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaList.length) % mediaList.length);
	};

	return (
		<div className="flex flex-col items-center p-4 border rounded-lg shadow-lg max-w-md mx-auto">
			{currentMedia.type === 'IMAGE' ? (
				<img
					src={currentMedia.src}
					alt="Preview"
					className="w-full h-auto rounded-lg"
				/>
			) : (
				<MediaPlayer mediaId={currentMedia.id} mediaSrc={currentMedia.src || null}
					thumbnail={currentMedia.thumbnail}
				/>
			)}

			<div className="flex justify-between w-full mt-4">
				<button onClick={handlePrev} className="px-4 py-2 bg-gray-300 rounded">قبلی</button>
				<span>{currentIndex + 1} / {mediaList.length}</span>
				<button onClick={handleNext} className="px-4 py-2 bg-gray-300 rounded">بعدی</button>
			</div>
		</div>
	);
};

export default MediaPlayerList;
