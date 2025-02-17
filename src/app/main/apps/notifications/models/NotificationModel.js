import _ from '@lodash';
import FuseUtils from '@fuse/utils';

/**
 * The NotificationModel class.
 * Implements NotificationModelProps interface.
 */
function NotificationModel(data) {
	data = data || {};
	const currentTime = new Date().toISOString()
	return _.defaults(data, {
		// id: FuseUtils.generateGUID(),
		icon: 'heroicons-solid:star',
		title: '',
		message: '',
		description: '',
		// time: currentTime,
		timestamp: currentTime,
		read: false,
		variant: 'default',
		link: '/apps/file-manager',
		useRouter: true
	});
}

export default NotificationModel;
