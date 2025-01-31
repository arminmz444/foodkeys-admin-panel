import FuseLoading from '@fuse/core/FuseLoading';
import ReactEmailGalleryComponent from 'app/shared-components/react-email-gallery-component/react-email-gallery-component.jsx';
import MediaPlayer from 'app/shared-components/media-player/MediaPlayer.jsx';
import Gallery from 'app/shared-components/media-player/Gallery/Gallery.jsx';
import MediaPlayerList from 'app/shared-components/media-player/MediaPlayerList.jsx';
import { useGetAnalyticsDashboardWidgetsQuery } from './AnalyticsDashboardApi';
import CustomDataGrid from 'app/shared-components/data-grid/CustomDataGrid.jsx';
import MonacoJsonEditor from 'app/shared-components/monaco-json-editor/MonacoJsonEditor.jsx';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};
const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

/**
 * The analytics dashboard app.
 */
function AnalyticsDashboardApp() {
	const { isLoading } = useGetAnalyticsDashboardWidgetsQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const userLatitude = 40.7128;
	const userLongitude = -74.006;

	return (
		// <GrapesEditor />
		<>
			<MediaPlayer mediaId="technology-clean-app-presentation-mockup-promo" />
			<ReactEmailGalleryComponent />
			<Gallery />
			<MediaPlayerList />
			<CustomDataGrid />
			<MonacoJsonEditor />
			{/* <MapView */}
			{/*	defaultLat={userLatitude} */}
			{/*	defaultLng={userLongitude} */}
			{/* /> */}
		</>
		// <FusePageSimple
		// 	header={<AnalyticsDashboardAppHeader />}
		// 	content={
		// 		<motion.div
		// 			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 w-full p-24 md:p-32"
		// 			variants={container}
		// 			initial="hidden"
		// 			animate="show"
		// 		>
		// 			<motion.div
		// 				variants={item}
		// 				className="sm:col-span-2 lg:col-span-3"
		// 			>
		// 				<VisitorsOverviewWidget />
		// 			</motion.div>
		//
		// 			<motion.div
		// 				variants={item}
		// 				className="sm:col-span-2 lg:col-span-1 "
		// 			>
		// 				<ConversionsWidget />
		// 			</motion.div>
		//
		// 			<motion.div
		// 				variants={item}
		// 				className="sm:col-span-2 lg:col-span-1 "
		// 			>
		// 				<ImpressionsWidget />
		// 			</motion.div>
		//
		// 			<motion.div
		// 				variants={item}
		// 				className="sm:col-span-2 lg:col-span-1 "
		// 			>
		// 				<VisitsWidget />
		// 			</motion.div>
		//
		// 			<motion.div
		// 				variants={item}
		// 				className="sm:col-span-2 lg:col-span-3"
		// 			>
		// 				<VisitorsVsPageViewsWidget />
		// 			</motion.div>
		//
		// 			<div className="w-full mt-16 sm:col-span-3">
		// 				<Typography className="text-2xl font-semibold tracking-tight leading-6">
		// 					Your Audience
		// 				</Typography>
		// 				<Typography
		// 					className="font-medium tracking-tight"
		// 					color="text.secondary"
		// 				>
		// 					Demographic properties of your users
		// 				</Typography>
		// 			</div>
		//
		// 			<div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-32 w-full">
		// 				<motion.div variants={item}>
		// 					<NewVsReturningWidget />
		// 				</motion.div>
		// 				<motion.div variants={item}>
		// 					<GenderWidget />
		// 				</motion.div>
		// 				<motion.div variants={item}>
		// 					<AgeWidget />
		// 				</motion.div>
		// 				<motion.div variants={item}>
		// 					<LanguageWidget />
		// 				</motion.div>
		// 			</div>
		// 		</motion.div>
		// 	}
		// />
		// <div>
		// 	<h1>My Leaflet Map</h1>
		// 	<MapView
		// 		defaultLat={userLatitude}
		// 		defaultLng={userLongitude}
		// 	/>
		// </div>
	);
}

export default AnalyticsDashboardApp;
