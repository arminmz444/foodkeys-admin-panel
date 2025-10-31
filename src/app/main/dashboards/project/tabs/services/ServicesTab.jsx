import { motion } from 'framer-motion';
import ServiceStatsWidget from './widgets/ServiceStatsWidget';
import ServiceSubCategoryWidget from './widgets/ServiceSubCategoryWidget';
import TopVisitedServicesWidget from './widgets/TopVisitedServicesWidget';
import ServiceTimeSeriesWidget from './widgets/ServiceTimeSeriesWidget';

/**
 * The ServicesTab component.
 */
function ServicesTab() {
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

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={item}>
				<ServiceStatsWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-1 md:col-span-3">
				<ServiceSubCategoryWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-4">
				<TopVisitedServicesWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-4">
				<ServiceTimeSeriesWidget />
			</motion.div>
		</motion.div>
	);
}

export default ServicesTab;

