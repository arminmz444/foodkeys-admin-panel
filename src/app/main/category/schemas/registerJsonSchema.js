// registerJsonSchema.js
import * as monaco from 'monaco-editor';

export function registerJsonSchema(schemaUri, schemaObject) {
	monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
		validate: true,
		schemas: [
			{
				uri: schemaUri, // "https://foodkeys-api-dev.liara.run/service/schema/23"
				fileMatch: ['*'], // TODO: match only json files
				schema: schemaObject
			}
		]
	});
}
