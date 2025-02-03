import React, { useState } from 'react';

import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import { Video } from 'yet-another-react-lightbox/plugins';
import { Title } from '@mui/icons-material';
import {
	LightboxButton,
	Paragraph,
	SliderFilter,
	SelectFilter,
	FlexLineBreak,
	CheckboxFilter,
	TextFieldFilter,
	Settings
} from '../../gallery/playground/index.js';

import photos from './photos';

const sampleVideo = {
	type: 'video',
	width: 1280,
	height: 720,
	poster: '/public/assets/videos/1.jpg',
	asset: '/public/assets/videos/1.jpg',
	sources: [
		{
			src: '/public/assets/videos/1.mp4',
			type: 'video/mp4'
		}
	]
};

function parseLength(value) {
	const result = Number.parseInt(value, 10);

	if (/^\d+$/.test(value)) return result;

	if (/^\d+px$/.test(value)) return `${result}px`;

	if (/^\d+%$/.test(value)) return `${result}%`;

	return undefined;
}

export default function Gallery() {
	const [open, setOpen] = React.useState(false);

	const [finite, setFinite] = React.useState(false);
	// const [index, setIndex] = React.useState(0);
	const [count, setCount] = React.useState(photos.length);
	const [preload, setPreload] = React.useState(2);
	const [fade, setFade] = React.useState(250);
	const [swipe, setSwipe] = React.useState(500);
	const [imageFit, setImageFit] = React.useState('contain');
	const [renderPrev, setRenderPrev] = React.useState(true);
	const [renderNext, setRenderNext] = React.useState(true);
	const [closeOnPullUp, setCloseOnPullUp] = React.useState(false);
	const [closeOnPullDown, setCloseOnPullDown] = React.useState(false);
	const [closeOnBackdropClick, setCloseOnBackdropClick] = React.useState(false);
	const [padding, setPadding] = React.useState('16px');
	const [spacing, setSpacing] = React.useState('30%');

	const paddingValue = parseLength(padding);
	const spacingValue = parseLength(spacing);

	const [index, setIndex] = useState(-1);
	const [rowHeight, setRowHeight] = useState(250);
	photos.push(sampleVideo);
	// useEffect(() => {
	// 	const updateRowHeight = () => {
	// 		if (!window) return;
	//
	// 		if (window.innerWidth < 640)
	// 			setRowHeight(100); // Mobile
	// 		else if (window.innerWidth < 1024)
	// 			setRowHeight(130); // Tablets
	// 		else setRowHeight(150); // Desktop
	// 	};
	//
	// 	updateRowHeight();
	// 	window.addEventListener('resize', updateRowHeight);
	// 	return () => window.removeEventListener('resize', updateRowHeight);
	// }, []);
	return (
		<>
			<Title>Playground</Title>

			<Paragraph>Here is an interactive playground to test various parameters in real-time.</Paragraph>

			<Lightbox
				open={open}
				close={() => setOpen(false)}
				index={index}
				slides={photos.slice(0, count)}
				carousel={{
					finite,
					preload,
					imageFit,
					padding: paddingValue,
					spacing: spacingValue
				}}
				controller={{ closeOnPullDown, closeOnBackdropClick }}
				animation={{ fade, swipe }}
				on={{
					view: (index) => console.log('View', index),
					entering: () => console.log('Entering'),
					entered: () => console.log('Entered'),
					exiting: () => console.log('Exiting'),
					exited: () => console.log('Exited')
				}}
				render={{
					buttonPrev: renderPrev ? undefined : () => null,
					buttonNext: renderNext ? undefined : () => null
				}}
			/>

			<LightboxButton onClick={() => setOpen(true)} />

			<Paragraph>You can adjust the live demo settings below.</Paragraph>

			<Settings>
				<SliderFilter
					label="Slides"
					min={1}
					max={photos.length}
					value={count}
					onChange={(value) => {
						setCount(value);

						if (index >= value) {
							setIndex(value - 1);
						}

						if (preload * 2 + 1 > value) {
							setPreload(Math.floor((value - 1) / 2));
						}
					}}
				/>

				<SliderFilter
					label="Index"
					min={0}
					max={count - 1}
					value={index}
					onChange={(value) => setIndex(value)}
				/>

				<SliderFilter
					label="Preload"
					min={0}
					max={Math.floor((count - 1) / 2)}
					value={preload}
					onChange={(value) => setPreload(value)}
				/>

				<SliderFilter
					label="Fade duration"
					min={0}
					max={3000}
					step={50}
					value={fade}
					onChange={(value) => setFade(value)}
				/>

				<SliderFilter
					label="Swipe duration"
					min={0}
					max={3000}
					step={50}
					value={swipe}
					onChange={(value) => setSwipe(value)}
				/>

				<SelectFilter
					label="imageFit"
					options={['contain', 'cover']}
					value={imageFit}
					onChange={(value) => setImageFit(value)}
				/>

				<TextFieldFilter
					label="Padding"
					helperText="e.g., '16px', '5%' or '0'"
					value={padding}
					error={paddingValue === undefined}
					onChange={(value) => setPadding(value)}
				/>

				<TextFieldFilter
					label="Spacing"
					helperText="e.g., '30%', '100px' or '0'"
					value={spacing}
					error={spacingValue === undefined}
					onChange={(value) => setSpacing(value)}
				/>

				<FlexLineBreak />

				<CheckboxFilter
					label="Infinite"
					checked={!finite}
					onChange={(checked) => setFinite(!checked)}
				/>

				<CheckboxFilter
					label="Prev button"
					checked={renderPrev}
					onChange={(checked) => setRenderPrev(checked)}
				/>

				<CheckboxFilter
					label="Next button"
					checked={renderNext}
					onChange={(checked) => setRenderNext(checked)}
				/>

				<CheckboxFilter
					label="Close on pull-up"
					checked={closeOnPullUp}
					onChange={(checked) => setCloseOnPullUp(checked)}
				/>

				<CheckboxFilter
					label="Close on pull-down"
					checked={closeOnPullDown}
					onChange={(checked) => setCloseOnPullDown(checked)}
				/>

				<CheckboxFilter
					label="Close on backdrop click"
					checked={closeOnBackdropClick}
					onChange={(checked) => setCloseOnBackdropClick(checked)}
				/>
			</Settings>
			<div className="p-4 max-w-screen-xl mx-auto">
				<h2 className="text-2xl font-semibold text-center mb-4">Gallery</h2>
				<RowsPhotoAlbum
					width="100%"
					defaultContainerWidth="100%"
					padding={4}
					spacing={16}
					photos={photos}
					targetRowHeight={rowHeight}
					onClick={({ index }) => setIndex(index)}
					// layoutOptions={{
					// 	margin: 8
					// }}
				/>

				<Lightbox
					controller={{ closeOnPullDown, closeOnBackdropClick }}
					slides={photos}
					open={index >= 0}
					index={index}
					close={() => setIndex(-1)}
					plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Video, Download]}
				/>
			</div>
		</>
	);
}
//
// {/* <Lightbox */}
// {/*	plugins={[Video]} */}
// {/*	slides={[ */}
// {/*		{ */}
// {/*			type: 'video', */}
// {/*			width: 1280, */}
// {/*			height: 720, */}
// {/*			poster: '/public/assets/images/apps/ecommerce/braies-lake.jpg', */}
// {/*			sources: [ */}
// {/*				{ */}
// {/*					src: '/public/assets/videos/1.mp4', */}
// {/*					type: 'video/mp4' */}
// {/*				} */}
// {/*			] */}
// {/*		} */}
// {/*	]} */}
// {/* /> */}
