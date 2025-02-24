import _ from '@lodash';
/**
 * The product model.
 */
const CompanyModel = (data) =>
	_.defaults(data || {}, {
		id: _.uniqueId('company-'),
		name: '',
		handle: '',
		description: '',
		categories: [],
		tags: [],
		featuredImageId: '',
		images: [],
		priceTaxExcl: 0,
		priceTaxIncl: 0,
		taxRate: 0,
		comparedPrice: 0,
		quantity: 0,
		sku: '',
		width: '',
		height: '',
		depth: '',
		weight: '',
		extraShippingFee: 0,
		price: '',
		active: true,
		image: '',
		registrantUserId: 0,
		total: ''
	});
export default CompanyModel;
