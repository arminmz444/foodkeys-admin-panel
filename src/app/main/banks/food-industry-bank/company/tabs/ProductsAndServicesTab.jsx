// import { useFormContext } from 'react-hook-form';
// // import DynamicFormGenerator from 'app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx';
// import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
// import DynamicFormGenerator from 'app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx';
//
// /**
//  * The products and services tab.
//  */
//
// const productsSchema = {
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
// // 	{
// // 	title: 'محصولات و خدمات',
// // 	type: 'object',
// // 	properties: {
// // 		products: {
// // 			type: 'array',
// // 			title: 'محصولات و خدمات',
// // 			items: {
// // 				type: 'object',
// // 				properties: {
// // 					name: {
// // 						type: 'string',
// // 						title: 'نام محصول'
// // 					},
// // 					description: {
// // 						type: 'string',
// // 						title: 'توضیحات محصول'
// // 					},
// // 					categoryType: {
// // 						type: 'string',
// // 						title: 'دسته‌بندی محصول'
// // 					},
// // 					showProduct: {
// // 						type: 'boolean',
// // 						title: 'نمایش در صفحه اختصاصی؟'
// // 					},
// // 					pictures: {
// // 						type: 'array',
// // 						title: 'تصاویر',
// // 						items: {
// // 							type: 'object',
// // 							properties: {
// // 								url: {
// // 									type: 'string',
// // 									uniforms: { component: ImageField },
// // 									title: 'آدرس عکس آپلود شده'
// // 								},
// // 								description: { type: 'string', title: 'توضیحات عکس' }
// // 							}
// // 						}
// // 					}
// // 				},
// // 				required: ['name', 'categoryType']
// // 			}
// // 		}
// // 	}
// // };
//
// function ProductsAndServicesTab() {
// 	const methods = useFormContext();
// 	const handleSubmit = async (formData) => {
// 		alert('Product saved!');
// 		console.log(JSON.stringify(formData));
// 	};
// 	const { control } = methods;
// 	return (
// 		// 	<Controller
// 		// 		name="priceTaxExcl"
// 		// 		control={control}
// 		// 		render={({ field }) => (
// 		// 			<TextField
// 		// 				{...field}
// 		// 				className="mt-8 mb-16"
// 		// 				label="Tax Excluded Price"
// 		// 				id="priceTaxExcl"
// 		// 				InputProps={{
// 		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
// 		// 				}}
// 		// 				type="number"
// 		// 				variant="outlined"
// 		// 				autoFocus
// 		// 				fullWidth
// 		// 			/>
// 		// 		)}
// 		// 	/>
// 		// 	<Controller
// 		// 		name="priceTaxIncl"
// 		// 		control={control}
// 		// 		render={({ field }) => (
// 		// 			<TextField
// 		// 				{...field}
// 		// 				className="mt-8 mb-16"
// 		// 				label="Tax Included Price"
// 		// 				id="priceTaxIncl"
// 		// 				InputProps={{
// 		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
// 		// 				}}
// 		// 				type="number"
// 		// 				variant="outlined"
// 		// 				fullWidth
// 		// 			/>
// 		// 		)}
// 		// 	/>
// 		// 	<Controller
// 		// 		name="taxRate"
// 		// 		control={control}
// 		// 		render={({ field }) => (
// 		// 			<TextField
// 		// 				{...field}
// 		// 				className="mt-8 mb-16"
// 		// 				label="Tax Rate"
// 		// 				id="taxRate"
// 		// 				InputProps={{
// 		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
// 		// 				}}
// 		// 				type="number"
// 		// 				variant="outlined"
// 		// 				fullWidth
// 		// 			/>
// 		// 		)}
// 		// 	/>
// 		// 	<Controller
// 		// 		name="comparedPrice"
// 		// 		control={control}
// 		// 		render={({ field }) => (
// 		// 			<TextField
// 		// 				{...field}
// 		// 				className="mt-8 mb-16"
// 		// 				label="Compared Price"
// 		// 				id="comparedPrice"
// 		// 				InputProps={{
// 		// 					startAdornment: <InputAdornment position="start">$</InputAdornment>
// 		// 				}}
// 		// 				type="number"
// 		// 				variant="outlined"
// 		// 				fullWidth
// 		// 				helperText="Add a compare price to show next to the real price"
// 		// 			/>
// 		// 		)}
// 		// 	/>
//
// 		<div>
// 			<DynamicFormGenerator
// 				formHeaderTitle="فرم محصولات و خدمات شرکت"
// 				initialData={[]}
// 				onSubmit={handleSubmit}
// 				schema={productsSchema}
// 				formGenerationType="AUTO"
// 				formValidationStruct="JSON_SCHEMA"
// 			/>
// 		</div>
// 	);
// }
//
// export default ProductsAndServicesTab;

// import { useFormContext, useFieldArray } from 'react-hook-form';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
// import { Typography } from '@mui/material';
//
// // Custom component to render the pictures field array for a single product
// function PicturesFieldArray({ productIndex }) {
// 	const {
// 		control,
// 		register,
// 		formState: { errors }
// 	} = useFormContext();
// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: `products.${productIndex}.pictures`
// 	});
//
// 	return (
// 		<div style={{ marginTop: '16px', marginBottom: '16px' }}>
// 			<h4>تصاویر محصول</h4>
// 			{fields.map((field, picIndex) => (
// 				<div
// 					key={field.id}
// 					style={{ border: '1px dashed #999', padding: '8px', marginBottom: '8px' }}
// 				>
// 					<TextField
// 						label="آدرس عکس آپلود شده"
// 						{...register(`products.${productIndex}.pictures.${picIndex}.url`)}
// 						error={!!errors.products?.[productIndex]?.pictures?.[picIndex]?.url}
// 						helperText={errors.products?.[productIndex]?.pictures?.[picIndex]?.url?.message}
// 						fullWidth
// 						margin="normal"
// 					/>
// 					<TextField
// 						label="توضیحات عکس"
// 						{...register(`products.${productIndex}.pictures.${picIndex}.description`)}
// 						fullWidth
// 						margin="normal"
// 					/>
// 					<Button
// 						variant="outlined"
// 						color="secondary"
// 						onClick={() => remove(picIndex)}
// 					>
// 						حذف تصویر
// 					</Button>
// 				</div>
// 			))}
// 			<Button
// 				variant="contained"
// 				onClick={() => append({ url: '', description: '' })}
// 			>
// 				افزودن تصویر
// 			</Button>
// 		</div>
// 	);
// }
//
// // Custom component to render an individual product (with its nested pictures)
// function ProductFields({ index, remove }) {
// 	const {
// 		register,
// 		formState: { errors }
// 	} = useFormContext();
//
// 	return (
// 		<div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
// 			<h3>محصول {index + 1}</h3>
// 			<TextField
// 				label="نام محصول"
// 				{...register(`products.${index}.name`)}
// 				error={!!errors.products?.[index]?.name}
// 				helperText={errors.products?.[index]?.name?.message}
// 				fullWidth
// 				margin="normal"
// 			/>
// 			<TextField
// 				label="توضیحات محصول"
// 				{...register(`products.${index}.description`)}
// 				fullWidth
// 				margin="normal"
// 			/>
// 			<TextField
// 				label="دسته‌بندی محصول"
// 				{...register(`products.${index}.categoryType`)}
// 				error={!!errors.products?.[index]?.categoryType}
// 				helperText={errors.products?.[index]?.categoryType?.message}
// 				fullWidth
// 				margin="normal"
// 			/>
// 			<FormControlLabel
// 				control={<Checkbox {...register(`products.${index}.showProduct`)} />}
// 				label="نمایش در صفحه اختصاصی؟"
// 			/>
// 			{/* Nested pictures field array */}
// 			<PicturesFieldArray productIndex={index} />
// 			<Button
// 				variant="contained"
// 				color="secondary"
// 				onClick={() => remove(index)}
// 			>
// 				حذف محصول
// 			</Button>
// 		</div>
// 	);
// }
//
// // Custom component to render the products field array
// function ProductsFieldArray() {
// 	const { control } = useFormContext();
// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: 'products'
// 	});
//
// 	return (
// 		<div>
// 			{fields.map((field, index) => (
// 				<ProductFields
// 					key={field.id}
// 					index={index}
// 					remove={remove}
// 				/>
// 			))}
// 			<Button
// 				variant="contained"
// 				onClick={() =>
// 					append({ name: '', description: '', categoryType: '', showProduct: false, pictures: [] })
// 				}
// 			>
// 				افزودن محصول
// 			</Button>
// 		</div>
// 	);
// }
//
// // The JSON schema for the products and services tab
// const productsSchema = {
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
// 			},
// 			uniforms: { component: ProductsFieldArray }
// 		}
// 	}
// };
//
// function ProductsAndServicesTab() {
// 	const methods = useFormContext();
// 	const handleSubmit = async (formData) => {
// 		alert('Product saved!');
// 		console.log(JSON.stringify(formData));
// 	};
// 	const { control } = methods;
// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: 'products'
// 	});
//
// 	return (
// 		<div>
// 			<Typography
// 				variant="h5"
// 				color="WindowText"
// 				className="font-bold mb-16"
// 			>
// 				محصولات و خدمات شرکت{' '}
// 			</Typography>
// 			{fields.map((field, index) => (
// 				<ProductFields
// 					key={field.id}
// 					index={index}
// 					remove={remove}
// 				/>
// 			))}
// 			<Button
// 				variant="contained"
// 				onClick={() =>
// 					append({ name: '', description: '', categoryType: '', showProduct: false, pictures: [] })
// 				}
// 			>
// 				ثبت محصول جدید
// 			</Button>
// 		</div>
// 	);
// }
//
// export default ProductsAndServicesTab;

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

// Custom component for file input with preview and upload for a picture
function PictureFileInput({ fieldName, defaultValue }) {
	const { setValue } = useFormContext();
	const [preview, setPreview] = useState(defaultValue || null);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];

		if (file) {
			// Set a local preview using the file URL
			setPreview(URL.createObjectURL(file));
			setUploading(true);
			// Prepare the file for upload
			const formData = new FormData();
			formData.append('file', file);
			try {
				// Post to the backend and get a tempId
				const response = await axios.post('/file/temp', formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
				const { tempId } = response.data;
				// Set the form field value to the returned tempId
				setValue(fieldName, tempId);
			} catch (error) {
				console.error('Upload failed:', error);
			} finally {
				setUploading(false);
			}
		}
	};

	return (
		<div className="flex flex-col items-center">
			<label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300">
				<svg
					className="w-28 h-28"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M16.88 9.94a.66.66 0 00-.44-.24H13V7.42a.66.66 0 00-.66-.66H7.66A.66.66 0 007 7.42v2.28H3.56a.66.66 0 00-.66.66v3.05a2.66 2.66 0 002.66 2.66h8.4a2.66 2.66 0 002.66-2.66v-3.05zM11 12v3H9v-3H6.66l3.34-3.34 3.34 3.34H11z" />
				</svg>
				<span className="mt-2 text-sm leading-normal">انتخاب تصویر</span>
				<input
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>
			</label>
			{uploading && <CircularProgress className="text-center mt-8 mb-10" />}
			{!uploading && preview && (
				<img
					src={preview}
					alt="Preview"
					className="mt-16 max-w-xs rounded-md shadow-md"
				/>
			)}
		</div>
	);
}

// Custom component to render the pictures field array for a single product
function PicturesFieldArray({ productIndex }) {
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: `products.${productIndex}.pictures`
	});

	return (
		<div style={{ marginTop: '16px', marginBottom: '16px' }}>
			<h4>تصاویر محصول</h4>
			{fields.map((field, picIndex) => (
				<div
					key={field.id}
					style={{ border: '1px dashed #999', padding: '8px', marginBottom: '8px' }}
				>
					<PictureFileInput fieldName={`products.${productIndex}.pictures.${picIndex}.url`} />
					<TextField
						label="توضیحات عکس"
						{...register(`products.${productIndex}.pictures.${picIndex}.description`)}
						fullWidth
						margin="normal"
					/>
					<Button
						variant="outlined"
						color="secondary"
						onClick={() => remove(picIndex)}
					>
						حذف تصویر
					</Button>
				</div>
			))}
			<Button
				variant="contained"
				onClick={() => append({ url: '', description: '' })}
			>
				افزودن تصویر
			</Button>
		</div>
	);
}

// Custom component to render an individual product (with its nested pictures)
function ProductFields({ index, remove }) {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	return (
		<div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
			<h3>محصول {index + 1}</h3>
			<TextField
				label="نام محصول"
				{...register(`products.${index}.name`)}
				error={!!errors.products?.[index]?.name}
				helperText={errors.products?.[index]?.name?.message}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="توضیحات محصول"
				{...register(`products.${index}.description`)}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="دسته‌بندی محصول"
				{...register(`products.${index}.categoryType`)}
				error={!!errors.products?.[index]?.categoryType}
				helperText={errors.products?.[index]?.categoryType?.message}
				fullWidth
				margin="normal"
			/>
			<FormControlLabel
				control={<Checkbox {...register(`products.${index}.showProduct`)} />}
				label="نمایش در صفحه اختصاصی؟"
			/>
			{/* Nested pictures field array */}
			<PicturesFieldArray productIndex={index} />
			<Button
				variant="contained"
				color="secondary"
				onClick={() => remove(index)}
			>
				حذف محصول
			</Button>
		</div>
	);
}

// Custom component to render the products field array
function ProductsFieldArray() {
	const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'products'
	});

	return (
		<div>
			{fields.map((field, index) => (
				<ProductFields
					key={field.id}
					index={index}
					remove={remove}
				/>
			))}
			<Button
				variant="contained"
				onClick={() =>
					append({
						name: '',
						description: '',
						categoryType: '',
						showProduct: false,
						pictures: []
					})
				}
			>
				افزودن محصول
			</Button>
		</div>
	);
}

// The JSON schema for the products and services tab
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
			},
			uniforms: { component: ProductsFieldArray }
		}
	}
};

function ProductsAndServicesTab() {
	const methods = useFormContext();
	const handleSubmit = async (formData) => {
		alert('Product saved!');
		console.log(JSON.stringify(formData));
	};
	const { control } = methods;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'products'
	});

	return (
		<div>
			<Typography
				variant="h5"
				color="WindowText"
				className="font-bold mb-16"
			>
				محصولات و خدمات شرکت
			</Typography>
			{fields.map((field, index) => (
				<ProductFields
					key={field.id}
					index={index}
					remove={remove}
				/>
			))}
			<Button
				variant="contained"
				onClick={() =>
					append({
						name: '',
						description: '',
						categoryType: '',
						showProduct: false,
						pictures: []
					})
				}
			>
				ثبت محصول جدید
			</Button>
		</div>
	);
}

export default ProductsAndServicesTab;
