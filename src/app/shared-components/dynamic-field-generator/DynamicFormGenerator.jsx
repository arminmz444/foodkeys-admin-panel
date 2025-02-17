import { AutoField, AutoForm } from 'uniforms-mui';
import { SubmitField } from 'app/shared-components/dynamic-field-generator/custom-fields/index.js';
import { Box, Button, Paper, Typography } from '@mui/material';
import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
import ZodBridge from 'uniforms-bridge-zod';
import { z } from 'zod';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

function DynamicFormGenerator({
	initialData = {},
	onSubmit,
	formHeaderTitle,
	schema,
	formValidationStruct = 'JSON_SCHEMA',
	isSubmitting = false,
	formFieldsInputTypes = null,
	formGenerationType = 'AUTO',
	hideSubmitField = false,
	setCreateDialogOpen
}) {
	const [loading, setLoading] = useState(false);
	const defaultSchema =
		formValidationStruct === 'ZOD_SCHEMA'
			? z.object({
					text: z.string(),
					num: z.number(),
					bool: z.boolean(),
					nested: z.object({ text: z.string(), t: z.number() }).array(),
					date: z.date(),
					list: z.string().uniforms({ label: 'List Text', placeholder: 'List Text Placeholder' }).array(),
					select: z.enum(['a', 'b']),
					radio: z.enum(['a', 'b']).uniforms({ checkboxes: true })
				})
			: {
					title: formHeaderTitle || 'محصولات و خدمات',
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

	if (!schema) schema = defaultSchema;

	console.log(
		`Inside Uniforms: FORM_HEADER_TITLE = ${formHeaderTitle}, INITIAL_DATA = ${JSON.stringify(initialData)}, SCHEMA = ${JSON.stringify(schema)}, FORM_VALIDATION_STRUCT = ${formValidationStruct}`
	);
	const ajv = new Ajv({ strict: false, allErrors: false, useDefaults: true });
	ajv.addKeyword('uniforms');

	function createValidator(schema) {
		if (formValidationStruct === 'ZOD_SCHEMA') return null;

		const validator = ajv.compile(schema);
		return (model) => {
			validator(model);
			return validator.errors?.length ? { details: validator.errors } : null;
		};
	}

	const validator = createValidator(schema);

	const bridge =
		formValidationStruct === 'ZOD_SCHEMA' ? new ZodBridge({ schema }) : new JSONSchemaBridge({ schema, validator });

	return (
		<Paper
			sx={{ p: 2, width: '100%', maxWidth: 600, margin: 'auto' }}
			elevation={0}
		>
			<Box mb={2}>
				<Typography
					variant="h5"
					gutterBottom
				>
					{formHeaderTitle || 'فرم خودکار ایجاد شده'}
				</Typography>
			</Box>

			<AutoForm
				schema={bridge}
				model={initialData}
				onSubmit={async (doc) => {
					setLoading(true);
					try {
						if (onSubmit) {
							await onSubmit(doc);
						}
					} catch (error) {
						console.error('Form submission error:', error);
						throw error;
					}
					setLoading(false);
				}}
				showInlineError
			>
				{/* <Box */}
				{/*	mt={2} */}
				{/*	display="flex" */}
				{/*	justifyContent="flex-end" */}
				{/* > */}
				{/*	<Button */}
				{/*		type="submit" */}
				{/*		variant="contained" */}
				{/*		color="primary" */}
				{/*		hidden */}
				{/*		disabled={isSubmitting} */}
				{/*	/> */}
				{/*		{isSubmitting ? 'در حال ارسال...' : 'ارسال'} */}
				{/*	</Button> */}
				{/* </Box> */}
				{/* onSubmit={(doc) => { */}
				{/*	console.log('Submitted data:', doc); */}
				{/*	if (onSubmit) { */}
				{/*		onSubmit(doc); */}
				{/*	} */}
				{/* }} */}
				{/* showInlineError */}
				{/* <Box */}
				{/*	mt={2} */}
				{/*	display="flex" */}
				{/*	justifyContent="flex-end" */}
				{/*	gap={2} */}
				{/* > */}
				{/*	/!* Add a custom "Submit" button *!/ */}
				{/*	<Button */}
				{/*		variant="contained" */}
				{/*		type="submit" */}
				{/*	> */}
				{/*		Save */}
				{/*	</Button> */}
				{/* </Box> */}
				{formGenerationType !== 'AUTO' &&
					formFieldsInputTypes &&
					formFieldsInputTypes?.length &&
					formFieldsInputTypes.map((item) => {
						return (
							<>
								<AutoField name={item} />
								{/* <ErrorField name={item} errorMessage="این فیلد الزامی است" /> */}
								{/* <span>ارررررورر</span> */}
								{/* </ErrorField> */}
							</>
						);
					})}
				{formGenerationType !== 'AUTO' && !hideSubmitField && (
					<Stack
						className="mt-16 mb-0 flex flex-row justify-end"
						spacing={2}
						direction="row"
					>
						<Button onClick={() => setCreateDialogOpen(false)}>بستن</Button>
						<SubmitField
							variant="contained"
							type="submit"
							color="secondary"
							label="ثبت"
							loading={loading}
						/>
					</Stack>
				)}
				{/* <ErrorsField className="mt-4" /> */}
			</AutoForm>
		</Paper>
	);
}

export default DynamicFormGenerator;

// import React from 'react';
// import MaterialJsonSchemaForm from 'react-jsonschema-form-material-ui';
// import './index.css';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/system/Box';
// import schema from './json-schemas/schema.json';
// import uiSchema from './json-schemas/ui-schema.json';
// import useStyles from './example-styles';
// // const givenXhrSchema = require('./path-to your-xhr-schema.json'); // Optional
// // import givenFormData from '../simple/form-data.json';
//
// export default function DynamicFormGenerator() {
// 	const [formData, setFormData] = React.useState({});
// 	const theme = useTheme();
// 	const classes = useStyles(theme);
// 	return (
// 		<Box className={classes.root}>
// 			<MaterialJsonSchemaForm
// 				classes={classes}
// 				className={classes}
// 				schema={schema}
// 				uiSchema={uiSchema}
// 				xhrSchema={{}}
// 				theme={theme}
// 				formData={formData}
// 				onChange={({ formData }) => setFormData(formData)}
// 				onSubmit={(submittedData) => console.log('form submitted', submittedData)}
// 				widgets={{
// 					BaseInput: (props) => (
// 						<input
// 							{...props}
// 							className={classes.input}
// 						/>
// 					)
// 				}}
// 			/>
// 		</Box>
// 	);
// }
