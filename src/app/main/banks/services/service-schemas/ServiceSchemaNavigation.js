const ServiceSchemaNavigation = {
	id: 'banks',
	title: 'Banks',
	type: 'collapse',
	icon: 'heroicons-outline:cog',
	url: '/banks',
	translate: 'BANKS',
	children: [
		{
			id: 'banks.service-bank',
			icon: 'heroicons-outline:home',
			title: 'بانک خدمات',
			type: 'item',
			url: '/banks/service',
			subtitle: 'مدیریت بانک خدمات'
		},
		{
			id: 'banks.service-bank.schema',
			icon: 'heroicons-outline:home',
			title: 'ساختار خدمات',
			type: 'item',
			url: '/banks/service/schema',
			subtitle: 'مدیریت ساختار خدمات'
		}
	]
};
export default ServiceSchemaNavigation;
