// src/app/shared-components/dynamic-form-generator/FormSchemaBridge.js
import { z } from 'zod';
import { ZodBridge } from 'uniforms-bridge-zod';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import Ajv from 'ajv';

/**
 * Creates a Uniforms bridge from a schema
 * 
 * @param {Object|z.ZodObject} schema - JSON Schema object or Zod schema
 * @param {String} type - 'json' or 'zod'
 * @returns {ZodBridge|JSONSchemaBridge} Uniforms bridge
 */
export function createBridge(schema, type = 'json') {
  if (type === 'zod') {
    return new ZodBridge({ schema });
  } else {
    const ajv = new Ajv({ strict: false, allErrors: true, useDefaults: true });
    
    // Add custom Uniforms keyword for UI specific properties
    ajv.addKeyword({
      keyword: 'uniforms',
      type: 'object',
      validate: () => true,
    });
    
    const validator = ajv.compile(schema);
    
    const validate = (model) => {
      validator(model);
      return validator.errors?.length ? { details: validator.errors } : null;
    };
    
    return new JSONSchemaBridge({ schema, validate });
  }
}

/**
 * Converts a JSON Schema to Zod Schema
 * 
 * @param {Object} jsonSchema - JSON Schema object
 * @returns {String} Zod schema code
 */
export function convertJsonToZod(jsonSchema) {
  let zodCode = `import { z } from 'zod';\n\n`;
  zodCode += `const schema = z.object({\n`;
  
  const properties = jsonSchema.properties || {};
  const required = jsonSchema.required || [];
  
  Object.entries(properties).forEach(([key, prop]) => {
    const isRequired = required.includes(key);
    zodCode += `  ${key}: `;
    
    switch (prop.type) {
      case 'string':
        zodCode += 'z.string()';
        if (prop.format === 'email') zodCode += '.email()';
        if (prop.format === 'uri') zodCode += '.url()';
        if (prop.minLength) zodCode += `.min(${prop.minLength})`;
        if (prop.maxLength) zodCode += `.max(${prop.maxLength})`;
        if (prop.pattern) zodCode += `.regex(/${prop.pattern}/)`;
        if (prop.enum) zodCode += `.refine(val => [${prop.enum.map(e => `"${e}"`).join(', ')}].includes(val))`;
        break;
        
      case 'number':
      case 'integer':
        zodCode += 'z.number()';
        if (prop.minimum !== undefined) zodCode += `.min(${prop.minimum})`;
        if (prop.maximum !== undefined) zodCode += `.max(${prop.maximum})`;
        if (prop.multipleOf) zodCode += `.multipleOf(${prop.multipleOf})`;
        break;
        
      case 'boolean':
        zodCode += 'z.boolean()';
        break;
        
      case 'array':
        zodCode += 'z.array(';
        if (prop.items?.type === 'string') {
          zodCode += 'z.string()';
        } else if (prop.items?.type === 'number') {
          zodCode += 'z.number()';
        } else {
          zodCode += 'z.any()';
        }
        zodCode += ')';
        if (prop.minItems) zodCode += `.min(${prop.minItems})`;
        if (prop.maxItems) zodCode += `.max(${prop.maxItems})`;
        break;
        
      case 'object':
        zodCode += 'z.object({})';
        break;
        
      default:
        zodCode += 'z.any()';
    }
    
    // Add Uniforms metadata
    if (prop.title || prop.description || prop.uniforms) {
      zodCode += '.uniforms({';
      if (prop.title) zodCode += `\n    label: "${prop.title}",`;
      if (prop.description) zodCode += `\n    description: "${prop.description}",`;
      if (prop.default !== undefined) {
        const defaultVal = typeof prop.default === 'string' 
          ? `"${prop.default}"` 
          : prop.default;
        zodCode += `\n    defaultValue: ${defaultVal},`;
      }
      if (prop.uniforms) {
        Object.entries(prop.uniforms).forEach(([uKey, uVal]) => {
          if (typeof uVal === 'string') {
            zodCode += `\n    ${uKey}: "${uVal}",`;
          } else if (Array.isArray(uVal)) {
            zodCode += `\n    ${uKey}: [${uVal.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}],`;
          } else if (typeof uVal === 'object') {
            zodCode += `\n    ${uKey}: ${JSON.stringify(uVal)},`;
          } else {
            zodCode += `\n    ${uKey}: ${uVal},`;
          }
        });
      }
      zodCode += '\n  })';
    }
    
    // Make optional if not required
    if (!isRequired) {
      zodCode += '.optional()';
    }
    
    zodCode += ',\n';
  });
  
  zodCode += '});\n\nexport default schema;';
  
  return zodCode;
}

/**
 * Converts a Zod Schema to JSON Schema
 * 
 * @param {z.ZodSchema} zodSchema - Zod schema
 * @returns {Object} JSON Schema object
 */
export function convertZodToJson(zodSchema) {
  // Get the shape of the Zod object
  const shape = zodSchema._def.shape();
  
  const properties = {};
  const required = [];
  
  // Process each property
  Object.entries(shape).forEach(([key, def]) => {
    const isOptional = def._def.typeName === 'ZodOptional';
    const actualDef = isOptional ? def._def.innerType : def;
    const typeName = actualDef._def.typeName;
    
    let property = {};
    
    switch (typeName) {
      case 'ZodString':
        property.type = 'string';
        if (actualDef._def.checks) {
          actualDef._def.checks.forEach(check => {
            if (check.kind === 'min') property.minLength = check.value;
            if (check.kind === 'max') property.maxLength = check.value;
            if (check.kind === 'regex') property.pattern = check.regex.source;
            if (check.kind === 'email') property.format = 'email';
            if (check.kind === 'url') property.format = 'uri';
          });
        }
        break;
        
      case 'ZodNumber':
        property.type = 'number';
        if (actualDef._def.checks) {
          actualDef._def.checks.forEach(check => {
            if (check.kind === 'min') property.minimum = check.value;
            if (check.kind === 'max') property.maximum = check.value;
            if (check.kind === 'multipleOf') property.multipleOf = check.value;
          });
        }
        break;
        
      case 'ZodBoolean':
        property.type = 'boolean';
        break;
        
      case 'ZodArray':
        property.type = 'array';
        property.items = { type: 'string' }; // Default
        
        // Try to determine the item type
        const innerType = actualDef._def.type;
        if (innerType._def.typeName === 'ZodString') {
          property.items = { type: 'string' };
        } else if (innerType._def.typeName === 'ZodNumber') {
          property.items = { type: 'number' };
        } else if (innerType._def.typeName === 'ZodBoolean') {
          property.items = { type: 'boolean' };
        } else if (innerType._def.typeName === 'ZodObject') {
          property.items = { type: 'object' };
        }
        
        if (actualDef._def.checks) {
          actualDef._def.checks.forEach(check => {
            if (check.kind === 'min') property.minItems = check.value;
            if (check.kind === 'max') property.maxItems = check.value;
          });
        }
        break;
        
      case 'ZodObject':
        property.type = 'object';
        property.properties = {};
        break;
        
      case 'ZodEnum':
        property.type = 'string';
        property.enum = actualDef._def.values;
        break;
        
      default:
        property.type = 'string';
    }
    
    // Add Uniforms metadata if present
    if (actualDef._def.uniforms) {
      property.uniforms = actualDef._def.uniforms;
      
      if (actualDef._def.uniforms.label) {
        property.title = actualDef._def.uniforms.label;
      }
      
      if (actualDef._def.uniforms.description) {
        property.description = actualDef._def.uniforms.description;
      }
      
      if (actualDef._def.uniforms.defaultValue !== undefined) {
        property.default = actualDef._def.uniforms.defaultValue;
      }
    }
    
    properties[key] = property;
    
    if (!isOptional) {
      required.push(key);
    }
  });
  
  const jsonSchema = {
    type: 'object',
    properties,
  };
  
  if (required.length > 0) {
    jsonSchema.required = required;
  }
  
  return jsonSchema;
}

/**
 * Example of creating a dynamic form with EnhancedDynamicFormGenerator
 * 
 * @example
 * // With JSON Schema
 * const jsonSchema = {
 *   type: 'object',
 *   properties: {
 *     name: { type: 'string', title: 'Name' },
 *     age: { type: 'number', title: 'Age', minimum: 0 }
 *   },
 *   required: ['name']
 * };
 * 
 * const bridge = createBridge(jsonSchema, 'json');
 * 
 * return (
 *   <EnhancedDynamicFormGenerator
 *     schema={jsonSchema}
 *     formValidationStruct="JSON_SCHEMA"
 *     initialData={{}}
 *     onSubmit={handleSubmit}
 *   />
 * );
 * 
 * // With Zod Schema
 * const zodSchema = z.object({
 *   name: z.string().min(1, 'Name is required').uniforms({ label: 'Name' }),
 *   age: z.number().min(0).uniforms({ label: 'Age' }).optional()
 * });
 * 
 * const bridge = createBridge(zodSchema, 'zod');
 * 
 * return (
 *   <EnhancedDynamicFormGenerator
 *     schema={zodSchema}
 *     formValidationStruct="ZOD_SCHEMA"
 *     initialData={{}}
 *     onSubmit={handleSubmit}
 *   />
 * );
 */