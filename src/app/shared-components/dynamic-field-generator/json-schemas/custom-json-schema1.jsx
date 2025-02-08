// import Ajv from 'ajv';
// import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
// import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
//
// const ajv = new Ajv({ strict: false, allErrors: false, useDefaults: true });
// ajv.addKeyword('uniforms');
//
// function createValidator(schema) {
// 	const validator = ajv.compile(schema);
// 	return (model) => {
// 		validator(model);
// 		return validator.errors?.length ? { details: validator.errors } : null;
// 	};
// }
// const validator = createValidator(schema);
//
// export const bridge = new JSONSchemaBridge({ schema, validator });

// const schema = {
// 	title: 'Address',
// 	type: 'object',
// 	properties: {
// 		city: { type: 'string' },
// 		state: { type: 'string' },
// 		street: { type: 'string' },
// 		zip: { type: 'string', pattern: '[0-9]{5}' },
// 	},
// 	required: ['street', 'zip', 'state'],
// };
// $schema: 'https://json-schema.org/draft/2020-12/schema',

// const schema = {
// 	title: 'Company Data Schema',
// 	description: 'Schema for validating company and related entity data',
// 	type: 'object',
// 	properties: {
// 		company_name: { type: 'string' },
// 		ceo: { type: 'string' },
// 		owner: { type: 'string' },
// 		answer_name: { type: 'string' },
// 		history: { type: 'string' },
// 		visit: { type: 'integer', minimum: 0 },
// 		ranking: { type: 'integer', minimum: 0 },
// 		ranking_all: { type: 'integer', minimum: 0 },
// 		building_area: { type: 'string' },
// 		land_area: { type: 'string' },
// 		holding: { type: 'string' },
// 		description: { type: 'string' },
// 		advertising_slogan: { type: 'string' },
// 		employees_count: { type: 'string' },
// 		company_type: { type: 'string' },
// 		background_image: {
// 			type: 'string'
// 		},
// 		logo: {
// 			type: 'string'
// 		},
// 		subject_of_activity: { type: 'string' },
// 		info_status_description: { type: 'string' },
// 		info_status: { type: 'integer' },
// 		created_at: {
// 			type: 'string'
// 		},
// 		updated_at: {
// 			type: 'string'
// 		},
// 		establish_date: { type: 'string' },
// 		registrant: { type: 'string' },
// 		registrant_phone: {
// 			type: 'string',
// 			pattern: '^\\+?[0-9]{10,15}$'
// 		},
// 		registrant_tel: { type: 'string' },
// 		record: { type: 'string' },
// 		key_words: { type: 'string' },
// 		tags: { type: 'string' },
// 		registrant_username: { type: 'string' },
// 		raw_materials_origin: { type: 'integer' },
// 		category_type: { type: 'integer' },
// 		subcategory_type: { type: 'integer' },
// 		admin_comment: { type: 'string' },
// 		select: {
// 			type: 'string',
// 			title: 'Example select',
// 			enum: ['Yes', 'No']
// 		},
// 		brands: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' },
// 					is_english: { type: 'boolean' },
// 					is_primary: { type: 'boolean' }
// 				},
// 				required: ['name', 'is_english', 'is_primary'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		stakeholders: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' },
// 					last_name: { type: 'string' },
// 					phone: {
// 						type: 'string',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					email: {
// 						type: 'string'
// 					}
// 				},
// 				required: ['name', 'last_name', 'phone', 'email'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		tels: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					tel_number: {
// 						type: 'string',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					tel_type: { type: 'string' }
// 				},
// 				required: ['tel_number', 'tel_type'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		locations: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					country: { type: 'string' },
// 					office_location: { type: 'string' },
// 					factory_location: { type: 'string' },
// 					office_po_box: { type: 'string' },
// 					factory_po_box: { type: 'string' },
// 					office_state: { type: 'string' },
// 					office_city: { type: 'string' },
// 					factory_state: { type: 'string' },
// 					factory_city: { type: 'string' },
// 					industrial_city: { type: 'string' }
// 				},
// 				required: ['country', 'office_location', 'factory_location', 'office_po_box', 'factory_po_box'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		products: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' },
// 					type: { type: 'integer' },
// 					is_outsourced: { type: 'boolean' }
// 				},
// 				required: ['name', 'type', 'is_outsourced'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		contacts: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' },
// 					last_name: { type: 'string' },
// 					email: {
// 						type: 'string'
// 					},
// 					phone: {
// 						type: 'string',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					isCEO: { type: 'boolean' },
// 					position: { type: 'string' }
// 				},
// 				required: ['name', 'last_name', 'email', 'phone', 'isCEO', 'position'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		socialMedia: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' },
// 					type: { type: 'integer' }
// 				},
// 				required: ['name', 'type'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		subCompanies: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: { type: 'string' }
// 				},
// 				required: ['name'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		fileIds: {
// 			type: 'array',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					fileId: {
// 						type: 'string',
// 						pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
// 					},
// 					fileServiceType: {
// 						type: 'string',
// 						enum: ['COMPANY_LOGO', 'COMPANY_BACKGROUND', 'DOCUMENT', 'OTHER']
// 					}
// 				},
// 				required: ['fileId', 'fileServiceType'],
// 				additionalProperties: false
// 			}
// 		}
// 	},
// 	required: [
// 		'company_name',
// 		'ceo',
// 		'owner',
// 		'answer_name',
// 		'history',
// 		'visit',
// 		'ranking',
// 		'ranking_all',
// 		'building_area',
// 		'land_area',
// 		'holding',
// 		'description',
// 		'advertising_slogan',
// 		'employees_count',
// 		'company_type',
// 		'background_image',
// 		'logo',
// 		'subject_of_activity',
// 		'info_status_description',
// 		'info_status',
// 		'created_at',
// 		'updated_at',
// 		'establish_date',
// 		'registrant',
// 		'registrant_phone',
// 		'registrant_tel',
// 		'record',
// 		'key_words',
// 		'tags',
// 		'registrant_username',
// 		'raw_materials_origin',
// 		'category_type',
// 		'subcategory_type',
// 		'admin_comment',
// 		'brands',
// 		'stakeholders',
// 		'tels',
// 		'locations',
// 		'products',
// 		'contacts',
// 		'socialMedia',
// 		'subCompanies',
// 		'fileIds'
// 	],
// 	additionalProperties: false
// };

// const schema = {
// 	title: 'Company Data Schema',
// 	description: 'Schema for validating company and related entity data',
// 	type: 'object',
// 	properties: {
// 		company_name: {
// 			type: 'string',
// 			title: 'نام شرکت'
// 		},
// 		ceo: {
// 			type: 'string',
// 			title: 'مدیر عامل'
// 		},
// 		owner: {
// 			type: 'string',
// 			title: 'مالک'
// 		},
// 		answer_name: {
// 			type: 'string',
// 			title: 'نام پاسخگو'
// 		},
// 		history: {
// 			type: 'string',
// 			title: 'تاریخچه'
// 		},
// 		visit: {
// 			type: 'integer',
// 			title: 'بازدید',
// 			minimum: 0
// 		},
// 		ranking: {
// 			type: 'integer',
// 			title: 'رتبه',
// 			minimum: 0
// 		},
// 		ranking_all: {
// 			type: 'integer',
// 			title: 'رتبه کل',
// 			minimum: 0
// 		},
// 		building_area: {
// 			type: 'string',
// 			title: 'مساحت ساختمان'
// 		},
// 		land_area: {
// 			type: 'string',
// 			title: 'مساحت زمین'
// 		},
// 		holding: {
// 			type: 'string',
// 			title: 'هولدینگ'
// 		},
// 		description: {
// 			type: 'string',
// 			title: 'توضیحات'
// 		},
// 		advertising_slogan: {
// 			type: 'string',
// 			title: 'شعار تبلیغاتی'
// 		},
// 		employees_count: {
// 			type: 'string',
// 			title: 'تعداد کارکنان'
// 		},
// 		company_type: {
// 			type: 'string',
// 			title: 'نوع شرکت'
// 		},
// 		background_image: {
// 			type: 'string',
// 			title: 'تصویر پس‌زمینه'
// 		},
// 		logo: {
// 			type: 'string',
// 			title: 'لوگو'
// 		},
// 		subject_of_activity: {
// 			type: 'string',
// 			title: 'موضوع فعالیت'
// 		},
// 		info_status_description: {
// 			type: 'string',
// 			title: 'توضیحات وضعیت اطلاعات'
// 		},
// 		info_status: {
// 			type: 'integer',
// 			title: 'وضعیت اطلاعات'
// 		},
// 		created_at: {
// 			type: 'string',
// 			title: 'تاریخ ایجاد'
// 		},
// 		updated_at: {
// 			type: 'string',
// 			title: 'تاریخ بروزرسانی'
// 		},
// 		establish_date: {
// 			type: 'string',
// 			title: 'تاریخ تأسیس'
// 		},
// 		registrant: {
// 			type: 'string',
// 			title: 'نام ثبت‌کننده'
// 		},
// 		registrant_phone: {
// 			type: 'string',
// 			title: 'شماره موبایل ثبت‌کننده',
// 			pattern: '^\\+?[0-9]{10,15}$'
// 		},
// 		registrant_tel: {
// 			type: 'string',
// 			title: 'شماره تلفن ثبت‌کننده'
// 		},
// 		record: {
// 			type: 'string',
// 			title: 'سوابق'
// 		},
// 		key_words: {
// 			type: 'string',
// 			title: 'کلمات کلیدی'
// 		},
// 		tags: {
// 			type: 'string',
// 			title: 'تگ‌ها'
// 		},
// 		registrant_username: {
// 			type: 'string',
// 			title: 'نام کاربری ثبت‌کننده'
// 		},
// 		raw_materials_origin: {
// 			type: 'integer',
// 			title: 'منبع مواد اولیه'
// 		},
// 		category_type: {
// 			type: 'integer',
// 			title: 'نوع دسته‌بندی'
// 		},
// 		subcategory_type: {
// 			type: 'integer',
// 			title: 'نوع زیرگروه'
// 		},
// 		admin_comment: {
// 			type: 'string',
// 			title: 'نظر مدیر'
// 		},
// 		select: {
// 			type: 'string',
// 			title: 'مثال انتخاب',
// 			enum: ['Yes', 'No']
// 		},
// 		brands: {
// 			type: 'array',
// 			title: 'برندها',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام برند'
// 					},
// 					is_english: {
// 						type: 'boolean',
// 						title: 'انگلیسی است؟'
// 					},
// 					is_primary: {
// 						type: 'boolean',
// 						title: 'اصلی است؟'
// 					}
// 				},
// 				required: ['name', 'is_english', 'is_primary'],
// 				additionalProperties: false
// 			}
// 		},
// 		stakeholders: {
// 			type: 'array',
// 			title: 'سهام‌داران',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام'
// 					},
// 					last_name: {
// 						type: 'string',
// 						title: 'نام خانوادگی'
// 					},
// 					phone: {
// 						type: 'string',
// 						title: 'شماره تماس',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					email: {
// 						type: 'string',
// 						title: 'ایمیل'
// 					}
// 				},
// 				required: ['name', 'last_name', 'phone', 'email'],
// 				additionalProperties: false
// 			}
// 		},
// 		tels: {
// 			type: 'array',
// 			title: 'شماره تلفن‌ها',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					tel_number: {
// 						type: 'string',
// 						title: 'شماره تلفن',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					tel_type: {
// 						type: 'string',
// 						title: 'نوع تلفن'
// 					}
// 				},
// 				required: ['tel_number', 'tel_type'],
// 				additionalProperties: false
// 			}
// 		},
// 		locations: {
// 			type: 'array',
// 			title: 'موقعیت‌ها',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					country: {
// 						type: 'string',
// 						title: 'کشور'
// 					},
// 					office_location: {
// 						type: 'string',
// 						title: 'آدرس دفتر'
// 					},
// 					factory_location: {
// 						type: 'string',
// 						title: 'آدرس کارخانه'
// 					},
// 					office_po_box: {
// 						type: 'string',
// 						title: 'صندوق پستی دفتر'
// 					},
// 					factory_po_box: {
// 						type: 'string',
// 						title: 'صندوق پستی کارخانه'
// 					},
// 					office_state: {
// 						type: 'string',
// 						title: 'استان دفتر'
// 					},
// 					office_city: {
// 						type: 'string',
// 						title: 'شهر دفتر'
// 					},
// 					factory_state: {
// 						type: 'string',
// 						title: 'استان کارخانه'
// 					},
// 					factory_city: {
// 						type: 'string',
// 						title: 'شهر کارخانه'
// 					},
// 					industrial_city: {
// 						type: 'string',
// 						title: 'شهرک صنعتی'
// 					}
// 				},
// 				required: ['country', 'office_location', 'factory_location', 'office_po_box', 'factory_po_box'],
// 				additionalProperties: false
// 			}
// 		},
// 		products: {
// 			type: 'array',
// 			title: 'محصولات',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام محصول'
// 					},
// 					type: {
// 						type: 'integer',
// 						title: 'نوع'
// 					},
// 					is_outsourced: {
// 						type: 'boolean',
// 						title: 'برون‌سپاری شده؟'
// 					}
// 				},
// 				required: ['name', 'type', 'is_outsourced'],
// 				additionalProperties: false
// 			}
// 		},
// 		contacts: {
// 			type: 'array',
// 			title: 'مخاطبین',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام'
// 					},
// 					last_name: {
// 						type: 'string',
// 						title: 'نام خانوادگی'
// 					},
// 					email: {
// 						type: 'string',
// 						title: 'ایمیل'
// 					},
// 					phone: {
// 						type: 'string',
// 						title: 'شماره تماس',
// 						pattern: '^\\+?[0-9]{10,15}$'
// 					},
// 					isCEO: {
// 						type: 'boolean',
// 						title: 'مدیر عامل است؟'
// 					},
// 					position: {
// 						type: 'string',
// 						title: 'سمت'
// 					}
// 				},
// 				required: ['name', 'last_name', 'email', 'phone', 'isCEO', 'position'],
// 				additionalProperties: false
// 			}
// 		},
// 		socialMedia: {
// 			type: 'array',
// 			title: 'رسانه‌های اجتماعی',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام رسانه'
// 					},
// 					type: {
// 						type: 'integer',
// 						title: 'نوع رسانه'
// 					}
// 				},
// 				required: ['name', 'type'],
// 				additionalProperties: false
// 			}
// 		},
// 		subCompanies: {
// 			type: 'array',
// 			title: 'شرکت‌های تابعه',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام شرکت تابعه'
// 					}
// 				},
// 				required: ['name'],
// 				additionalProperties: false
// 			}
// 		},
// 		fileIds: {
// 			type: 'array',
// 			title: 'فایل‌ها',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					fileId: {
// 						type: 'string',
// 						title: 'شناسه فایل',
// 						pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
// 					},
// 					fileServiceType: {
// 						type: 'string',
// 						title: 'نوع فایل',
// 						enum: ['COMPANY_LOGO', 'COMPANY_BACKGROUND', 'DOCUMENT', 'OTHER']
// 					}
// 				},
// 				required: ['fileId', 'fileServiceType'],
// 				additionalProperties: false
// 			}
// 		},
//
// 		additionalInfo: {
// 			title: 'اطلاعات اضافی',
// 			type: 'array',
// 			items: {
// 				$ref: '#/definitions/genericRecursive'
// 			}
// 		}
// 	},
// 	required: [
// 		'company_name',
// 		'ceo',
// 		'owner',
// 		'answer_name',
// 		'history',
// 		'visit',
// 		'ranking',
// 		'ranking_all',
// 		'building_area',
// 		'land_area',
// 		'holding',
// 		'description',
// 		'advertising_slogan',
// 		'employees_count',
// 		'company_type',
// 		'background_image',
// 		'logo',
// 		'subject_of_activity',
// 		'info_status_description',
// 		'info_status',
// 		'created_at',
// 		'updated_at',
// 		'establish_date',
// 		'registrant',
// 		'registrant_phone',
// 		'registrant_tel',
// 		'record',
// 		'key_words',
// 		'tags',
// 		'registrant_username',
// 		'raw_materials_origin',
// 		'category_type',
// 		'subcategory_type',
// 		'admin_comment',
// 		'brands',
// 		'stakeholders',
// 		'tels',
// 		'locations',
// 		'products',
// 		'contacts',
// 		'socialMedia',
// 		'subCompanies',
// 		'fileIds'
// 	],
// 	additionalProperties: false,
//
// 	definitions: {
// 		genericRecursive: {
// 			title: 'مقدار دلخواه',
// 			anyOf: [
// 				{ type: 'string' },
// 				{ type: 'number' },
// 				{ type: 'boolean' },
// 				{
// 					type: 'array',
// 					items: {
// 						$ref: '#/definitions/genericRecursive'
// 					}
// 				},
// 				{
// 					type: 'object',
// 					additionalProperties: {
// 						$ref: '#/definitions/genericRecursive'
// 					}
// 				}
// 			]
// 		}
// 	}
// };
// const schema = {
// 	type: 'object',
// 	title: 'Association Configuration',
// 	// $schema: 'https://json-schema.org/draft/2020-12/schema',
// 	message: {
// 		required: {
// 			title: 'فیلد عنوان الزامی است',
// 			address: 'فیلد آدرس الزامی است',
// 			website: 'فیلد وب‌سایت الزامی است',
// 			chairman: 'فیلد رئیس الزامی است',
// 			telNumbers: 'فیلد شماره تلفن الزامی است',
// 			association_secretary: 'فیلد دبیر انجمن الزامی است'
// 		}
// 	},
// 	required: ['title', 'chairman', 'association_secretary', 'address', 'website', 'telNumbers'],
// 	properties: {
// 		title: {
// 			type: 'string',
// 			message: {
// 				type: 'عنوان باید از نوع رشته باشد',
// 				minLength: 'فیلد عنوان الزامی است'
// 			},
// 			minLength: 1
// 		},
// 		address: {
// 			type: 'string',
// 			message: {
// 				type: 'آدرس باید از نوع رشته باشد',
// 				minLength: 'فیلد آدرس باید حداقل ۵ کاراکتر باشد'
// 			},
// 			minLength: 5
// 		},
// 		website: {
// 			type: 'string',
// 			format: 'uri',
// 			message: {
// 				format: 'آدرس وب‌سایت نامعتبر است'
// 			}
// 		},
// 		chairman: {
// 			type: 'string',
// 			message: {
// 				type: 'رئیس باید از نوع رشته باشد',
// 				minLength: 'فیلد رئیس الزامی است'
// 			},
// 			minLength: 1
// 		},
// 		faxNumbers: {
// 			type: 'array',
// 			items: {
// 				type: 'string',
// 				message: {
// 					type: 'شماره فکس باید از نوع رشته باشد',
// 					pattern: 'شماره فکس نامعتبر است'
// 				},
// 				pattern: '^\\+?[0-9\\- ]{7,15}$'
// 			},
// 			message: {
// 				minItems: 'حداقل یک شماره فکس الزامی است'
// 			},
// 			minItems: 1
// 		},
// 		telNumbers: {
// 			type: 'array',
// 			items: {
// 				type: 'string',
// 				message: {
// 					type: 'شماره تلفن باید از نوع رشته باشد',
// 					pattern: 'شماره تلفن نامعتبر است'
// 				},
// 				pattern: '^\\+?[0-9\\- ]{7,15}$'
// 			},
// 			message: {
// 				minItems: 'حداقل یک شماره تلفن الزامی است'
// 			},
// 			minItems: 1
// 		},
// 		association_secretary: {
// 			type: 'string',
// 			message: {
// 				type: 'دبیر انجمن باید از نوع متن باشد',
// 				minLength: 'فیلد دبیر انجمن الزامی است'
// 			},
// 			minLength: 1
// 		}
// 	},
// 	description: 'Schema for validating association configuration settings',
// 	additionalProperties: false
// };
// const schema = {
// 	title: 'Product',
// 	type: 'object',
// 	properties: {
// 		name: {
// 			type: 'string',
// 			title: 'Name'
// 		},
// 		description: {
// 			type: 'string',
// 			title: 'Description'
// 		},
// 		otherTypeName: {
// 			type: 'string',
// 			title: 'Other Type Name',
// 			description: 'If categoryType is something custom, store it here'
// 		},
// 		categoryType: {
// 			type: 'string',
// 			title: 'Category Type'
// 		},
// 		showProduct: {
// 			type: 'boolean',
// 			title: 'Show Product?'
// 		},
// 		// pictures: Could be an array of objects. You can add more detail here if needed
// 		pictures: {
// 			type: 'array',
// 			title: 'Pictures',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					url: { type: 'string' },
// 					description: { type: 'string' }
// 				}
// 			}
// 		}
// 		// company: references a Company ID, or sub-object if you want to embed
// 	},
// 	required: ['name', 'categoryType']
// };

// const schema = {
// 	title: 'Products',
// 	type: 'array',
// 	items: {
// 		type: 'object',
// 		properties: {
// 			name: {
// 				type: 'string',
// 				title: 'Name'
// 			},
// 			description: {
// 				type: 'string',
// 				title: 'Description'
// 			},
// 			otherTypeName: {
// 				type: 'string',
// 				title: 'Other Type Name',
// 				description: 'If categoryType is something custom, store it here'
// 			},
// 			categoryType: {
// 				type: 'string',
// 				title: 'Category Type'
// 			},
// 			showProduct: {
// 				type: 'boolean',
// 				title: 'Show Product?'
// 			},
// 			pictures: {
// 				type: 'array',
// 				title: 'Pictures',
// 				items: {
// 					type: 'object',
// 					properties: {
// 						url: { type: 'string' },
// 						description: { type: 'string' }
// 					}
// 				}
// 			}
// 		},
// 		required: ['name', 'categoryType', 'showProduct']
// 	}
// };

// const schema = {
// 	title: 'محصولات و خدمات',
// 	type: 'object',
// 	properties: {
// 		products: {
// 			type: 'array',
// 			title: 'محصولات و خدمات',
// 			items: {
// 				type: 'object',
// 				properties: {
// 					name: {
// 						type: 'string',
// 						title: 'نام محصول'
// 					},
// 					description: {
// 						type: 'string',
// 						title: 'توضیحات محصول'
// 					},
// 					// otherTypeName: {
// 					// 	type: 'string',
// 					// 	title: 'Other Type Name',
// 					// 	description: 'If categoryType is something custom, store it here'
// 					// },
// 					categoryType: {
// 						type: 'string',
// 						title: 'دسته‌بندی محصول'
// 					},
// 					showProduct: {
// 						type: 'boolean',
// 						title: 'نمایش در صفحه اختصاصی؟'
// 					},
// 					pictures: {
// 						type: 'array',
// 						title: 'تصاویر',
// 						items: {
// 							type: 'object',
// 							properties: {
// 								url: {
// 									type: 'string',
// 									uniforms: { component: ImageField },
// 									title: 'آدرس عکس آپلود شده'
// 								},
// 								description: { type: 'string', title: 'توضیحات عکس' }
// 							}
// 						}
// 					}
// 				},
// 				required: ['name', 'categoryType']
// 			}
// 		}
// 	}
// };

