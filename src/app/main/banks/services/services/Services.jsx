import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import ServiceItem from './ServiceItem.jsx';
import NewServiceItem from './NewServiceItem.jsx';

/**
 * The services component.
 */
function Services() {
	// const { data: boards, isLoading } = useGetScrumboardBoardsQuery();
	const boards = [
		{
			id: 1,
			nameEn: 'used_machinery',
			name: 'خرید و فروش ماشین آلات دسته دوم',
			description: 'بازار خرید و فروش ماشین آلات صنعتی کارکرده با قیمت مناسب و شرایط ویژه.',
			websiteRelativePath: '/view/used_machinery',
			lastActivity: '2024-02-05T14:30:00.000Z',
			icon: 'heroicons-outline:cog'
		},
		{
			id: 2,
			nameEn: 'labs',
			name: 'آزمایشگاه‌های کنترل کیفیت',
			description: 'لیستی از آزمایشگاه‌های معتبر برای کنترل کیفیت محصولات صنعتی و غذایی.',
			websiteRelativePath: '/view/labs',
			lastActivity: '2023-12-20T09:15:00.000Z',
			icon: 'heroicons-outline:beaker'
		},
		{
			id: 3,
			nameEn: 'jobs',
			name: 'سامانه کاریابی',
			description: 'پلتفرمی برای یافتن فرصت‌های شغلی مناسب در صنایع مختلف.',
			websiteRelativePath: '/view/jobs',
			lastActivity: '2024-02-07T08:10:00.000Z',
			icon: 'heroicons-outline:briefcase'
		},
		{
			id: 4,
			nameEn: 'employment',
			name: 'آگهی‌های استخدام',
			description: 'جدیدترین آگهی‌های استخدامی در حوزه‌های مختلف کاری و صنعتی.',
			websiteRelativePath: '/view/employment',
			lastActivity: '2023-10-11T18:45:00.000Z',
			icon: 'heroicons-outline:user-group'
		},
		{
			id: 5,
			nameEn: 'reseller',
			name: 'اعطاکنندگان نمایندگی فروش',
			description: 'فرصت‌های دریافت نمایندگی فروش از برندهای معتبر در صنایع مختلف.',
			websiteRelativePath: '/view/reseller',
			lastActivity: '2024-01-29T16:20:00.000Z',
			icon: 'heroicons-outline:shopping-cart'
		},
		{
			id: 6,
			nameEn: 'certification',
			name: 'صادرکنندگان گواهینامه‌های بین‌المللی',
			description: 'لیستی از موسسات صادرکننده گواهینامه‌های بین‌المللی برای کسب و کارها.',
			websiteRelativePath: '/view/certification',
			lastActivity: '2022-11-14T10:00:00.000Z',
			icon: 'heroicons-outline:clipboard-check'
		},
		{
			id: 7,
			nameEn: 'sale_factory',
			name: 'کارخانه و کارگاه‌های فروشی',
			description: 'لیست کارخانه‌ها و کارگاه‌های آماده فروش در مناطق مختلف.',
			websiteRelativePath: '/view/sale_factory',
			lastActivity: '2023-07-30T13:55:00.000Z',
			icon: 'heroicons-outline:home'
		},
		{
			id: 8,
			nameEn: 'surplus',
			name: 'اعلان ظرفیت مازاد تولید کارخانجات',
			description: 'امکان اعلام و استفاده از ظرفیت مازاد تولیدی کارخانجات برای همکاری‌های صنعتی.',
			websiteRelativePath: '/view/surplus',
			lastActivity: '2023-05-19T21:10:00.000Z',
			icon: 'heroicons-outline:server'
		},
		{
			id: 9,
			nameEn: 'exhibitions',
			name: 'نمایشگاه‌های داخلی و خارجی',
			description: 'آخرین اطلاعات و اخبار مربوط به نمایشگاه‌های داخلی و بین‌المللی صنایع مختلف.',
			websiteRelativePath: '/view/exhibitions',
			lastActivity: '2024-02-06T05:25:00.000Z',
			icon: 'heroicons-outline:photograph'
		},
		{
			id: 10,
			nameEn: 'conferences',
			name: 'همایش‌های صنعت غذا',
			description: 'لیست همایش‌ها و کنفرانس‌های مرتبط با صنعت غذا و فناوری‌های مرتبط.',
			websiteRelativePath: '/view/conferences',
			lastActivity: '2022-08-22T17:40:00.000Z',
			icon: 'heroicons-outline:presentation-chart-line'
		},
		{
			id: 11,
			nameEn: 'educations',
			name: 'دوره‌های آموزشی',
			description: 'فرصت‌های یادگیری و شرکت در دوره‌های آموزشی تخصصی در حوزه‌های مختلف.',
			websiteRelativePath: '/view/educations',
			lastActivity: '2023-09-12T12:00:00.000Z',
			icon: 'heroicons-outline:academic-cap'
		}
	];
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

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	return (
		<div className="flex grow shrink-0 flex-col items-center container p-24 sm:p-40">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
			>
				<Typography className="mt-16 md:mt-96 text-3xl md:text-6xl font-extrabold tracking-tight leading-7 sm:leading-10 text-center">
					لیست سرویس‌های بانک خدمات
				</Typography>
			</motion.div>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-32 md:mt-64"
			>
				{boards?.map((board) => (
					<motion.div
						variants={item}
						className="min-w-full sm:min-w-224 min-h-360"
						key={board.id}
					>
						<ServiceItem
							board={board}
							key={board.id}
						/>
					</motion.div>
				))}

				<motion.div
					variants={item}
					className="min-w-full sm:min-w-224 min-h-360"
				>
					<NewServiceItem />
				</motion.div>
			</motion.div>
		</div>
	);
}

export default Services;
