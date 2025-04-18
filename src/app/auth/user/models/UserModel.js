import _ from '@lodash';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data) {
	data = data || {};
	return _.defaults(data, {
		id: null,
		firstName: '',
		lastName: '',
		email: '',
		username: '',
		phone: '',
		status: 0,
		roles: [],
		roleIds: null,
		accesses: [],
		accessIds: null,
		active: false,
		credit: 0,
		online: false,
		avatar: {
			fileName: '',
			filePath: ''
		},
		lastLogin: null,
		lastLogout: null,
		address: '',
		cityId: null,
		provinceId: null,
		city: {
			id: null,
			nameFa: '',
			nameEn: ''
		},
		province: {
			id: null,
			name: ''
		},
		postalCode: '',
		individualType: '',
		jobPosition: null,
		birthDate: '',
		pelak: null,
		nationalCode: null,
		shenasCode: null,
		profileIncomplete: false,
		uid: '',
		role: null, // guest
		data: {
			firstName: '',
			lastName: '',
			displayName: '',
			avatar: '',
			photoURL: '',
			email: '',
			shortcuts: [],
			settings: {}
		}
	});
}

export default UserModel;
