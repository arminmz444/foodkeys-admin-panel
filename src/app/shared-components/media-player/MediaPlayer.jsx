import ReactPlayer from 'react-player';
import { Card, CardContent, Typography, Box } from '@mui/material';

export function MediaPlayer({ mediaId, thumbnail, mediaSrc }) {
	const videoUrl = mediaSrc || `https://resource.flexclip.com/templates/video/720p/${mediaId}.mp4?v=1.0.6.1.45`;

	return (
		<div className="flex flex-col items-center mt-4 pt-24 xs:px-10 lg:px-80 pb-2 rounded-lg w-full mx-auto bg-transparent">
			<Card
				className="w-full pt-18 px-0 pb-0"
				sx={{
					boxShadow: 4,
					borderRadius: 3
					// padding: 2
				}}
			>
				<CardContent>
					<Typography
						variant="h6"
						sx={{ textAlign: 'center', mb: 2 }}
					>
						پیش‌نمایش ویدیو
					</Typography>
					<Box
						className="flex justify-between w-full mt-4"
						sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden' }}
					>
						<ReactPlayer
							url={videoUrl}
							controls
							width="100%"
							height="100%"
							light={thumbnail}
							playing={false}
							style={{ position: 'absolute', top: 0, left: 0, paddingLeft: 0, paddingRight: 0 }}
						/>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}

export default MediaPlayer;
