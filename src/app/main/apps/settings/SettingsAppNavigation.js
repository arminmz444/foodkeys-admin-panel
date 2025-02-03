const SettingsAppNavigation = {
	id: 'apps.settings',
	title: 'Settings',
	type: 'collapse',
	icon: 'heroicons-outline:cog',
	url: '/apps/settings',
	translate: 'SETTINGS',
	children: [
		{
			id: 'apps.settings.homepage',
			icon: 'heroicons-outline:home',
			title: 'صفحه اول (خانه)',
			type: 'item',
			url: '/apps/settings/homepage',
			subtitle: 'تنظیمات صفحه اول سایت شامل: اسلایدر، لوگوها و ...'
		},
		{
			id: 'apps.settings.aboutUsPage',
			icon: 'heroicons-outline:home',
			title: 'صفحه درباره ما',
			type: 'item',
			url: '/apps/settings/aboutUsPage',
			subtitle: 'تنظیمات صفحه درباره ما سایت'
		},
		{
			id: 'apps.settings.aboutUsPage',
			icon: 'heroicons-outline:home',
			title: 'صفحه درباره ما',
			type: 'item',
			url: '/apps/settings/aboutUsPage',
			subtitle: 'تنظیمات صفحه درباره ما سایت'
		},
		{
			id: 'apps.settings.aboutUsPage',
			icon: 'heroicons-outline:home',
			title: 'صفحه درباره ما',
			type: 'item',
			url: '/apps/settings/aboutUsPage',
			subtitle: 'تنظیمات صفحه درباره ما سایت'
		},
		{
			id: 'apps.settings.aboutUsPage',
			icon: 'heroicons-outline:home',
			title: 'صفحه درباره ما',
			type: 'item',
			url: '/apps/settings/aboutUsPage',
			subtitle: 'تنظیمات صفحه درباره ما سایت'
		},
		{
			id: 'apps.settings.websiteConfig',
			icon: 'heroicons-outline:home',
			title: 'تنظیمات سایت اصلی',
			type: 'item',
			url: '/apps/settings/website-config',
			subtitle: 'تنظیمات سایت اصلی شامل: تنظیمات صفحه اول، تنظیمات درباره ما و ...'
		},
		{
			id: 'apps.settings.account',
			icon: 'heroicons-outline:user-circle',
			title: 'Account',
			type: 'item',
			url: '/apps/settings/account',
			subtitle: 'Manage your public profile and private information'
		},
		{
			id: 'apps.settings.security',
			icon: 'heroicons-outline:lock-closed',
			title: 'Security',
			type: 'item',
			url: '/apps/settings/security',
			subtitle: 'Manage your password and 2-step verification preferences'
		},
		{
			id: 'apps.settings.planBilling',
			icon: 'heroicons-outline:credit-card',
			title: 'Plan & Billing',
			type: 'item',
			url: '/apps/settings/plan-billing',
			subtitle: 'Manage your subscription plan, payment method and billing information'
		},
		{
			id: 'apps.settings.notifications',
			icon: 'heroicons-outline:bell',
			title: 'Notifications',
			type: 'item',
			url: '/apps/settings/notifications',
			subtitle: "Manage when you'll be notified on which channels"
		},
		{
			id: 'apps.settings.team',
			icon: 'heroicons-outline:user-group',
			title: 'Team',
			type: 'item',
			url: '/apps/settings/team',
			subtitle: 'Manage your existing team and change roles/permissions'
		}
	]
};
export default SettingsAppNavigation;
