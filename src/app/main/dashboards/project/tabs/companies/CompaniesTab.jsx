import { motion } from 'framer-motion';
import CompanyStatusWidget from './widgets/CompanyStatusWidget';
import CompanyStatusChartWidget from './widgets/CompanyStatusChartWidget';
import TopVisitedCompaniesWidget from './widgets/TopVisitedCompaniesWidget';
import CompanyTimeSeriesWidget from './widgets/CompanyTimeSeriesWidget';

/**
 * The CompaniesTab component.
 */
function CompaniesTab() {
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
				<CompanyStatusWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-2">
				<CompanyStatusChartWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-4">
				<TopVisitedCompaniesWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2 md:col-span-4">
				<CompanyTimeSeriesWidget />
			</motion.div>
		</motion.div>
	);
}

export default CompaniesTab;

