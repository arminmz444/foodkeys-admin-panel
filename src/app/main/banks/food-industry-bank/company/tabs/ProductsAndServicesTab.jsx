import { useFormContext } from 'react-hook-form';
// import DynamicFormGenerator from 'app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx';
import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
import DynamicFormGenerator from 'app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx';

/**
 * The products and services tab.
 */

const productsSchema = {
	title: 'محصولات و خدمات',
	type: 'object',
	properties: {
		products: {
			type: 'array',
			title: 'محصولات و خدمات',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						title: 'نام محصول'
					},
					description: {
						type: 'string',
						title: 'توضیحات محصول'
					},
					// otherTypeName: {
					// 	type: 'string',
					// 	title: 'Other Type Name',
					// 	description: 'If categoryType is something custom, store it here'
					// },
					categoryType: {
						type: 'string',
						title: 'دسته‌بندی محصول'
					},
					showProduct: {
						type: 'boolean',
						title: 'نمایش در صفحه اختصاصی؟'
					},
					pictures: {
						type: 'array',
						title: 'تصاویر',
						items: {
							type: 'object',
							properties: {
								url: {
									type: 'string',
									uniforms: { component: ImageField },
									title: 'آدرس عکس آپلود شده'
								},
								description: { type: 'string', title: 'توضیحات عکس' }
							}
						}
					}
				},
				required: ['name', 'categoryType']
			}
		}
	}
};
// 	{
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

function ProductsAndServicesTab() {
	const methods = useFormContext();
	const handleSubmit = async (formData) => {
		alert('Product saved!');
		console.log(JSON.stringify(formData));
	};
	const { control } = methods;
	return (
		// 	<Controller
		// 		name="priceTaxExcl"
		// 		control={control}
		// 		render={({ field }) => (
		// 			<TextField
		// 				{...field}
		// 				className="mt-8 mb-16"
		// 				label="Tax Excluded Price"
		// 				id="priceTaxExcl"
		// 				InputProps={{
		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
		// 				}}
		// 				type="number"
		// 				variant="outlined"
		// 				autoFocus
		// 				fullWidth
		// 			/>
		// 		)}
		// 	/>
		// 	<Controller
		// 		name="priceTaxIncl"
		// 		control={control}
		// 		render={({ field }) => (
		// 			<TextField
		// 				{...field}
		// 				className="mt-8 mb-16"
		// 				label="Tax Included Price"
		// 				id="priceTaxIncl"
		// 				InputProps={{
		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
		// 				}}
		// 				type="number"
		// 				variant="outlined"
		// 				fullWidth
		// 			/>
		// 		)}
		// 	/>
		// 	<Controller
		// 		name="taxRate"
		// 		control={control}
		// 		render={({ field }) => (
		// 			<TextField
		// 				{...field}
		// 				className="mt-8 mb-16"
		// 				label="Tax Rate"
		// 				id="taxRate"
		// 				InputProps={{
		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
		// 				}}
		// 				type="number"
		// 				variant="outlined"
		// 				fullWidth
		// 			/>
		// 		)}
		// 	/>
		// 	<Controller
		// 		name="comparedPrice"
		// 		control={control}
		// 		render={({ field }) => (
		// 			<TextField
		// 				{...field}
		// 				className="mt-8 mb-16"
		// 				label="Compared Price"
		// 				id="comparedPrice"
		// 				InputProps={{
		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
		// 				}}
		// 				type="number"
		// 				variant="outlined"
		// 				fullWidth
		// 				helperText="Add a compare price to show next to the real price"
		// 			/>
		// 		)}
		// 	/>

		<div>
			<DynamicFormGenerator
				formHeaderTitle="فرم محصولات و خدمات شرکت"
				initialData={[]}
				onSubmit={handleSubmit}
				schema={productsSchema}
			/>
		</div>
	);
}

export default ProductsAndServicesTab;
