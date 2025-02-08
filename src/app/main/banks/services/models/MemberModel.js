import FuseUtils from '@fuse/utils/index.js';
import _ from '@lodash';

/**
 * The Member model.
 */
function MemberModel(data) {
	data = data || {};
	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		name: '',
		avatar: '',
		class: ''
	});
}

export default MemberModel;
