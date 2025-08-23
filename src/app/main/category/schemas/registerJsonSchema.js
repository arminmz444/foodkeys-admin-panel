// registerJsonSchema.js
import * as monaco from 'monaco-editor';

export function registerJsonSchema(schemaUri, schemaObject) {
	monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
		validate: true,
		schemas: [
			{
				uri: schemaUri, // "http://localhost:8080/service/schema/23"
				fileMatch: ['*'], // TODO: match only json files
				schema: schemaObject
			}
		]
	});
}
