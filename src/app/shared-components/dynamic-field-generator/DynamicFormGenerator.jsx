// import Form from '@rjsf/core';
// import validator from '@rjsf/validator-ajv8';
//
// const schema = {
// 	title: 'User Info',
// 	type: 'object',
// 	properties: {
// 		firstName: { type: 'string', title: 'First Name' },
// 		lastName: { type: 'string', title: 'Last Name' },
// 		age: { type: 'number', title: 'Age' }
// 	}
// };
// const log = (type) => console.log.bind(console, type);
//
// export default function DynamicFormGenerator() {
// 	return (
// 		<Form
// 			schema={schema}
// 			validator={validator}
// 			onChange={log('changed')}
// 			onSubmit={log('submitted')}
// 			onError={log('errors')}
// 		/>
// 	);
// }

// import { AutoForm } from 'uniforms-mui';
//
// // 3. Define your JSON schema (for guests).
// const guestSchema = {
// 	title: 'Guest',
// 	type: 'object',
// 	properties: {
// 		firstName: { type: 'string' },
// 		lastName: { type: 'string' },
// 		workExperience: {
// 			description: 'Work experience in years',
// 			type: 'integer',
// 			minimum: 0,
// 			maximum: 100
// 		}
// 	},
// 	required: ['firstName', 'lastName']
// };
//
// // 5. Create a reusable form component.
// //    - The onSubmit handler just logs data, but you can replace it with anything.
// export default function DynamicFormGenerator() {
// 	return (
// 		<AutoForm
// 			schema={schema}
// 			onSubmit={(data) => console.log('Form submitted:', data)}
// 		/>
// 	);
// }

import { AutoForm } from 'uniforms-mui';
import { Box, Paper, Typography } from '@mui/material';
import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';

/**
 * A generic form generator using Uniforms + MUI.
 */
function DynamicFormGenerator({ initialData = {}, onSubmit, formHeaderTitle, schema }) {
	const defaultSchema = {
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

	if (!schema) schema = defaultSchema;

	const ajv = new Ajv({ strict: false, allErrors: false, useDefaults: true });
	ajv.addKeyword('uniforms');

	function createValidator(schema) {
		const validator = ajv.compile(schema);
		return (model) => {
			validator(model);
			return validator.errors?.length ? { details: validator.errors } : null;
		};
	}

	const validator = createValidator(schema);

	const bridge = new JSONSchemaBridge({ schema, validator });

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
				onSubmit={(doc) => {
					console.log('Submitted data:', doc);

					if (onSubmit) {
						onSubmit(doc);
					}
				}}
				showInlineError
			>
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
			</AutoForm>
		</Paper>
	);
}

export default DynamicFormGenerator;

// import React from 'react';
// import MaterialJsonSchemaForm from 'react-jsonschema-form-material-ui';
// import './index.css';
// // Internals
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
