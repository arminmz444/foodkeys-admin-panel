import { motion } from 'framer-motion';
import CompaniesByProvinceWidget from './widgets/CompaniesByProvinceWidget';
import CompaniesByCityWidget from './widgets/CompaniesByCityWidget';
import TopProvincesWidget from './widgets/TopProvincesWidget';

/**
 * The GeographicTab component.
 */
function GeographicTab() {
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
			<motion.div variants={item} className="sm:col-span-2 md:col-span-2">
				<CompaniesByProvinceWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-2">
				<TopProvincesWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-4">
				<CompaniesByCityWidget />
			</motion.div>
		</motion.div>
	);
}

export default GeographicTab;

