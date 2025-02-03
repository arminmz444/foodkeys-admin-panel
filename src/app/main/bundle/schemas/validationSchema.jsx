import { z } from 'zod';

const schemaZod = z.object({
	title: z.string(),
	description: z.string().optional(),
	properties: z.object({
		companyName: z.object({ type: z.string(), required: z.boolean().optional() }),
		subCategory: z.object({ type: z.string().optional() }).optional()
	})
});

function handleSubmitSchema(schemaValue) {
	try {
		const parsedJson = JSON.parse(schemaValue);
		schemaZod.parse(parsedJson);
		console.log('Schema is valid. Submitting...', parsedJson);
	} catch (err) {
		console.error('Schema validation failed:', err);
	}
}
