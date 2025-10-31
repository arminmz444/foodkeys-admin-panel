import { motion } from 'framer-motion';
import CompaniesStatsWidget from './widgets/CompaniesStatsWidget';
import ServicesStatsWidget from './widgets/ServicesStatsWidget';
import ProductsStatsWidget from './widgets/ProductsStatsWidget';
import UsersStatsWidget from './widgets/UsersStatsWidget';
import RequestsStatsWidget from './widgets/RequestsStatsWidget';
import VisitsStatsWidget from './widgets/VisitsStatsWidget';
import TransactionsStatsWidget from './widgets/TransactionsStatsWidget';

/**
 * The OverviewTab component.
 */
function OverviewTab() {
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
				<CompaniesStatsWidget />
			</motion.div>
			<motion.div variants={item}>
				<ServicesStatsWidget />
			</motion.div>
			<motion.div variants={item}>
				<ProductsStatsWidget />
			</motion.div>
			<motion.div variants={item}>
				<UsersStatsWidget />
			</motion.div>
			<motion.div variants={item}>
				<RequestsStatsWidget />
			</motion.div>
			<motion.div variants={item}>
				<VisitsStatsWidget />
			</motion.div>
			<motion.div variants={item} className="sm:col-span-2">
				<TransactionsStatsWidget />
			</motion.div>
		</motion.div>
	);
}

export default OverviewTab;

