// // src/app/shared-components/form-builder/SchemaGenerator.js
// import { z } from 'zod';

// /**
//  * Generates a clean Zod schema string without imports
//  * 
//  * @param {Array} fields - Array of form field definitions
//  * @param {String} formTitle - Title of the form
//  * @returns {String} Zod schema code as string
//  */
// export function generateZodSchemaString(fields, formTitle = 'FormSchema') {
//   if (!fields || !fields.length) return '// No fields defined';
  
//   const formattedName = formTitle.replace(/\s+/g, '') || 'FormSchema';
//   let schemaString = `z.object({\n`;
  
//   fields.forEach((field) => {
//     schemaString += `    ${field.name}: `;
    
//     switch (field.type) {
//       case 'text':
//       case 'password':
//       case 'textarea':
//       case 'email':
//       case 'url':
//       case 'tel':
//         schemaString += 'z.string({ invalid_type_error: \'فرمت داده ورودی اشتباه است\'';
//         if (field.required) {
//           schemaString += ', required_error: \'این فیلد الزامی است\'';
//         }
//         schemaString += ' })';
        
//         if (field.required) {
//           schemaString += '.min(1, { message: \'این فیلد الزامی است\' })';
//         }
        
//         if (field.minLength) {
//           schemaString += `.min(${field.minLength}, { message: 'حداقل ${field.minLength} کاراکتر وارد کنید' })`;
//         }
        
//         if (field.maxLength) {
//           schemaString += `.max(${field.maxLength}, { message: 'حداکثر ${field.maxLength} کاراکتر مجاز است' })`;
//         }
        
//         if (field.type === 'email') {
//           schemaString += '.email({ message: \'ایمیل معتبر وارد کنید\' })';
//         }
        
//         if (field.type === 'url') {
//           schemaString += '.url({ message: \'آدرس اینترنتی معتبر وارد کنید\' })';
//         }
        
//         if (field.pattern) {
//           schemaString += `.regex(new RegExp('${field.pattern}'), { message: 'فرمت وارد شده صحیح نیست' })`;
//         }
//         break;
        
//       case 'number':
//       case 'range':
//         schemaString += 'z.number({ invalid_type_error: \'فرمت داده ورودی اشتباه است\'';
//         if (field.required) {
//           schemaString += ', required_error: \'این فیلد الزامی است\'';
//         }
//         schemaString += ' })';
        
//         if (field.min !== undefined && field.min !== '') {
//           schemaString += `.min(${field.min}, { message: 'حداقل مقدار ${field.min} است' })`;
//         }
        
//         if (field.max !== undefined && field.max !== '') {
//           schemaString += `.max(${field.max}, { message: 'حداکثر مقدار ${field.max} است' })`;
//         }
//         break;
        
//       case 'checkbox':
//         schemaString += 'z.boolean()';
//         break;
        
//       case 'select':
//       case 'radio':
//         if (field.options && field.options.length > 0) {
//           schemaString += `z.enum([${field.options.map(opt => `'${opt}'`).join(', ')}], {\n`;
//           if (field.required) {
//             schemaString += `        required_error: 'این فیلد الزامی است',\n`;
//           }
//           schemaString += `        invalid_type_error: 'فرمت داده ورودی اشتباه است',\n`;
//           schemaString += `        message: 'مقدار انتخاب شده معتبر نیست'\n`;
//           schemaString += `    })`;
//         } else {
//           schemaString += 'z.string()';
//         }
//         break;
        
//       case 'multiselect':
//         if (field.options && field.options.length > 0) {
//           schemaString += `z.array(z.string())`;
//           if (field.required) {
//             schemaString += `.min(1, { message: 'حداقل یک گزینه انتخاب کنید' })`;
//           }
//         } else {
//           schemaString += 'z.array(z.string())';
//         }
//         break;
        
//       case 'date':
//       case 'datetime-local':
//       case 'time':
//         schemaString += 'z.string()';
//         if (field.required) {
//           schemaString += '.min(1, { message: \'این فیلد الزامی است\' })';
//         }
//         break;
        
//       default:
//         schemaString += 'z.string()';
//     }
    
//     // Add uniforms metadata
//     schemaString += '.uniforms({\n';
//     schemaString += `        displayName: '${field.label || field.name}',\n`;
//     schemaString += `        label: '${field.label || field.name}',\n`;
//     if (field.placeholder) {
//       schemaString += `        placeholder: '${field.placeholder}',\n`;
//     }
//     if (field.description) {
//       schemaString += `        description: '${field.description}',\n`;
//     }
//     if (field.defaultValue !== undefined && field.defaultValue !== '') {
//       const formattedValue = typeof field.defaultValue === 'string' 
//         ? `'${field.defaultValue}'` 
//         : field.defaultValue;
//       schemaString += `        defaultValue: ${formattedValue},\n`;
//     }
//     if (field.isSearchable) {
//       schemaString += `        isSearchable: true,\n`;
//     }
//     if (field.showInList) {
//       schemaString += `        showInList: true,\n`;
//     }
//     if (field.clientDisplay && field.clientDisplay.length) {
//       schemaString += `        clientDisplay: [${field.clientDisplay.map(c => `'${c}'`).join(', ')}],\n`;
//     }
    
//     schemaString += '    })';
    
//     // Make optional if not required (except for checkboxes)
//     if (!field.required && field.type !== 'checkbox') {
//       schemaString += '.optional()';
//     }
    
//     schemaString += ',\n';
//   });
  
//   schemaString += '})';
  
//   return schemaString;
// }

// /**
//  * Generates a JSON Schema from fields
//  * 
//  * @param {Array} fields - Array of form field definitions
//  * @param {String} formTitle - Title of the form
//  * @param {String} formDescription - Description of the form
//  * @returns {Object} JSON Schema object
//  */
// export function generateJsonSchema(fields, formTitle = 'Form Schema', formDescription = '') {
//   if (!fields || !fields.length) return { type: 'object', properties: {} };
  
//   const properties = {};
//   const required = [];
  
//   fields.forEach((field) => {
//     let property = {};
    
//     switch (field.type) {
//       case 'text':
//       case 'password':
//       case 'textarea':
//       case 'email':
//       case 'url':
//       case 'tel':
//         property.type = 'string';
//         property.title = field.label || field.name;
        
//         if (field.minLength) {
//           property.minLength = parseInt(field.minLength);
//         }
        
//         if (field.maxLength) {
//           property.maxLength = parseInt(field.maxLength);
//         }
        
//         if (field.pattern) {
//           property.pattern = field.pattern;
//         }
        
//         if (field.type === 'email') {
//           property.format = 'email';
//         }
        
//         if (field.type === 'url') {
//           property.format = 'uri';
//         }
        
//         if (field.type === 'textarea') {
//           // Add uniforms hint for textarea
//           property.uniforms = {
//             component: 'LongTextField'
//           };
//         }
//         break;
        
//       case 'number':
//       case 'range':
//         property.type = 'number';
//         property.title = field.label || field.name;
        
//         if (field.min !== undefined && field.min !== '') {
//           property.minimum = parseFloat(field.min);
//         }
        
//         if (field.max !== undefined && field.max !== '') {
//           property.maximum = parseFloat(field.max);
//         }
        
//         if (field.step !== undefined && field.step !== '') {
//           property.multipleOf = parseFloat(field.step);
//         }
//         break;
        
//       case 'checkbox':
//         property.type = 'boolean';
//         property.title = field.label || field.name;
//         break;
        
//       case 'select':
//       case 'radio':
//         property.type = 'string';
//         property.title = field.label || field.name;
        
//         if (field.options && field.options.length > 0) {
//           property.enum = field.options;
//         }
        
//         if (field.type === 'radio') {
//           // Add uniforms hint for radio buttons
//           property.uniforms = {
//             checkboxes: true
//           };
//         }
//         break;
        
//       case 'multiselect':
//         property.type = 'array';
//         property.title = field.label || field.name;
//         property.items = {
//           type: 'string'
//         };
        
//         if (field.options && field.options.length > 0) {
//           property.items.enum = field.options;
//         }
        
//         property.uniqueItems = true;
//         break;
        
//       case 'date':
//         property.type = 'string';
//         property.format = 'date';
//         property.title = field.label || field.name;
//         break;
        
//       case 'datetime-local':
//         property.type = 'string';
//         property.format = 'date-time';
//         property.title = field.label || field.name;
//         break;
        
//       case 'time':
//         property.type = 'string';
//         property.format = 'time';
//         property.title = field.label || field.name;
//         break;
        
//       default:
//         property.type = 'string';
//         property.title = field.label || field.name;
//     }
    
//     // Add description if present
//     if (field.description) {
//       property.description = field.description;
//     }
    
//     // Add placeholder and other UI hints
//     if (!property.uniforms) {
//       property.uniforms = {};
//     }
    
//     if (field.placeholder) {
//       property.uniforms.placeholder = field.placeholder;
//     }
    
//     if (field.isSearchable) {
//       property.uniforms.isSearchable = true;
//     }
    
//     if (field.showInList) {
//       property.uniforms.showInList = true;
//     }
    
//     if (field.clientDisplay && field.clientDisplay.length) {
//       property.uniforms.clientDisplay = field.clientDisplay;
//     }
    
//     // Add default value if present
//     if (field.defaultValue !== undefined && field.defaultValue !== '') {
//       if (field.type === 'number' || field.type === 'range') {
//         property.default = parseFloat(field.defaultValue);
//       } else {
//         property.default = field.defaultValue;
//       }
//     }
    
//     properties[field.name] = property;
    
//     // Add to required fields if needed
//     if (field.required) {
//       required.push(field.name);
//     }
//   });
  
//   const schema = {
//     type: 'object',
//     title: formTitle,
//     properties
//   };
  
//   if (formDescription) {
//     schema.description = formDescription;
//   }
  
//   if (required.length > 0) {
//     schema.required = required;
//   }
  
//   return schema;
// }

// /**
//  * Builds a Zod schema object from field definitions
//  * 
//  * @param {Array} fields - Array of form field definitions
//  * @returns {z.ZodObject} Zod schema object
//  */
// export function buildZodSchema(fields) {
//   if (!fields || !fields.length) return z.object({});
  
//   const shape = {};
  
//   fields.forEach(field => {
//     let fieldSchema;
    
//     switch (field.type) {
//       case 'text':
//       case 'password':
//       case 'textarea':
//       case 'email':
//       case 'url':
//       case 'tel':
//         fieldSchema = z.string({
//           invalid_type_error: 'فرمت داده ورودی اشتباه است',
//           required_error: field.required ? 'این فیلد الزامی است' : undefined
//         });
        
//         if (field.required) {
//           fieldSchema = fieldSchema.min(1, { message: 'این فیلد الزامی است' });
//         }
        
//         if (field.minLength) {
//           fieldSchema = fieldSchema.min(Number(field.minLength), { 
//             message: `حداقل ${field.minLength} کاراکتر وارد کنید` 
//           });
//         }
        
//         if (field.maxLength) {
//           fieldSchema = fieldSchema.max(Number(field.maxLength), { 
//             message: `حداکثر ${field.maxLength} کاراکتر مجاز است` 
//           });
//         }
        
//         if (field.type === 'email') {
//           fieldSchema = fieldSchema.email({ message: 'ایمیل معتبر وارد کنید' });
//         }
        
//         if (field.type === 'url') {
//           fieldSchema = fieldSchema.url({ message: 'آدرس اینترنتی معتبر وارد کنید' });
//         }
        
//         if (field.pattern) {
//           fieldSchema = fieldSchema.regex(new RegExp(field.pattern), { 
//             message: 'فرمت وارد شده صحیح نیست' 
//           });
//         }
//         break;
        
//       case 'number':
//       case 'range':
//         fieldSchema = z.coerce.number({
//           invalid_type_error: 'فرمت داده ورودی اشتباه است',
//           required_error: field.required ? 'این فیلد الزامی است' : undefined
//         });
        
//         if (field.min !== undefined && field.min !== '') {
//           fieldSchema = fieldSchema.min(Number(field.min), { 
//             message: `حداقل مقدار ${field.min} است` 
//           });
//         }
        
//         if (field.max !== undefined && field.max !== '') {
//           fieldSchema = fieldSchema.max(Number(field.max), { 
//             message: `حداکثر مقدار ${field.max} است` 
//           });
//         }
//         break;
        
//       case 'checkbox':
//         fieldSchema = z.boolean();
//         break;
        
//       case 'select':
//       case 'radio':
//         if (field.options && field.options.length > 0) {
//           fieldSchema = z.enum(field.options, {
//             required_error: field.required ? 'این فیلد الزامی است' : undefined,
//             invalid_type_error: 'فرمت داده ورودی اشتباه است'
//           });
//         } else {
//           fieldSchema = z.string();
//         }
//         break;
        
//       case 'multiselect':
//         if (field.options && field.options.length > 0) {
//           fieldSchema = z.array(z.string());
//           if (field.required) {
//             fieldSchema = fieldSchema.min(1, { message: 'حداقل یک گزینه انتخاب کنید' });
//           }
//         } else {
//           fieldSchema = z.array(z.string());
//         }
//         break;
        
//       case 'date':
//       case 'datetime-local':
//       case 'time':
//         fieldSchema = z.string();
//         if (field.required) {
//           fieldSchema = fieldSchema.min(1, { message: 'این فیلد الزامی است' });
//         }
//         break;
        
//       default:
//         fieldSchema = z.string();
//     }
    
//     // Add uniforms metadata if supported
//     if (typeof fieldSchema.uniforms === 'function') {
//       fieldSchema = fieldSchema.uniforms({
//         displayName: field.label || field.name,
//         label: field.label || field.name,
//         placeholder: field.placeholder,
//         description: field.description,
//         isSearchable: field.isSearchable,
//         showInList: field.showInList,
//         clientDisplay: field.clientDisplay
//       });
//     }
    
//     // Make optional if not required (except for checkbox)
//     if (!field.required && field.type !== 'checkbox') {
//       fieldSchema = fieldSchema.optional();
//     }
    
//     shape[field.name] = fieldSchema;
//   });
  
//   return z.object(shape);
// }

// /**
//  * Generates a formatted JSON Schema string
//  * 
//  * @param {Array} fields - Array of form field definitions
//  * @param {String} formTitle - Title of the form
//  * @param {String} formDescription - Description of the form
//  * @returns {String} JSON Schema as a formatted string
//  */
// export function generateJsonSchemaString(fields, formTitle = 'Form Schema', formDescription = '') {
//   const schema = generateJsonSchema(fields, formTitle, formDescription);
//   return JSON.stringify(schema, null, 2);
// }

// /**
//  * Generates a Uniforms-compatible Zod Schema string
//  * 
//  * @param {Array} fields - Array of form field definitions 
//  * @param {String} formTitle - Title of the form
//  * @returns {String} Zod schema code string with Uniforms integration
//  */
// export function generateUniformsZodSchemaString(fields, formTitle = 'FormSchema') {
//   const formattedName = formTitle.replace(/\s+/g, '') || 'FormSchema';
//   let schemaCode = `import { z } from 'zod';\nimport { ZodBridge } from 'uniforms-bridge-zod';\n\n`;
  
//   // Add the schema definition
//   schemaCode += `const ${formattedName} = ${generateZodSchemaString(fields, formTitle)};\n\n`;
  
//   // Add bridge creation
//   schemaCode += `// Create a bridge for use with Uniforms\n`;
//   schemaCode += `const ${formattedName}Bridge = new ZodBridge({ schema: ${formattedName} });\n\n`;
  
//   // Export both schema and bridge
//   schemaCode += `export { ${formattedName}, ${formattedName}Bridge };\n`;
  
//   return schemaCode;
// }

// src/app/shared-components/form-builder/SchemaGenerator.js
import { z } from 'zod';

// Helper to convert fields to JSON Schema
export const generateJsonSchema = (fields, title, description) => {
  const properties = {};
  const required = [];

  fields.forEach(field => {
    // Add to required array if field is required
    if (field.required) {
      required.push(field.name);
    }

    // Create property based on field type
    properties[field.name] = createJsonProperty(field);
  });

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: title || "Service Form",
    description: description || "",
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined
  };
};

// Helper to create JSON schema property for a field
const createJsonProperty = (field) => {
  const property = {
    title: field.label || field.name,
    description: field.description || ""
  };

  switch (field.type) {
    case "text":
    case "password":
    case "textarea":
    case "email":
    case "url":
    case "tel":
      property.type = "string";
      if (field.minLength) property.minLength = parseInt(field.minLength, 10);
      if (field.maxLength) property.maxLength = parseInt(field.maxLength, 10);
      if (field.pattern) property.pattern = field.pattern;
      if (field.placeholder) property.examples = [field.placeholder];
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "number":
    case "range":
      property.type = "number";
      if (field.min !== undefined && field.min !== "") property.minimum = parseFloat(field.min);
      if (field.max !== undefined && field.max !== "") property.maximum = parseFloat(field.max);
      if (field.step) property.multipleOf = parseFloat(field.step);
      if (field.defaultValue) property.default = parseFloat(field.defaultValue);
      break;

    case "select":
      property.type = "string";
      property.enum = field.options || [];
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "multiselect":
      property.type = "array";
      property.items = {
        type: "string",
        enum: field.options || []
      };
      if (field.defaultValue) property.default = Array.isArray(field.defaultValue) ? field.defaultValue : [field.defaultValue];
      break;

    case "checkbox":
      property.type = "boolean";
      if (field.defaultValue !== undefined) property.default = field.defaultValue === true || field.defaultValue === "true";
      break;

    case "radio":
      property.type = "string";
      property.enum = field.options || [];
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "date":
      property.type = "string";
      property.format = "date";
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "time":
      property.type = "string";
      property.format = "time";
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "datetime-local":
      property.type = "string";
      property.format = "date-time";
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    case "file":
      if (field.maxFiles > 1) {
        property.type = "array";
        property.items = {
          type: "string",
          format: "uri"
        };
        property.maxItems = field.maxFiles;
      } else {
        property.type = "string";
        property.format = "uri";
      }
      property.contentMediaType = field.accept || "*/*";
      property.fileServiceType = field.fileServiceType || "SERVICE_FILE";
      property.maxSize = field.maxSize || 5 * 1024 * 1024; // 5MB default
      break;

    case "object":
      property.type = "object";
      property.properties = {};
      property.required = [];
      break;

    case "array":
      property.type = "array";
      property.items = field.items || { type: "string" };
      break;

    case "hidden":
      property.type = "string";
      property.hidden = true;
      if (field.defaultValue) property.default = field.defaultValue;
      break;

    default:
      property.type = "string";
  }

  // Add display conditions if present
  if (field.depends && field.displayCondition) {
    property.dependencies = {
      [field.depends]: {
        oneOf: [
          {
            properties: {
              [field.depends]: { 
                enum: Array.isArray(field.displayCondition) 
                  ? field.displayCondition 
                  : [field.displayCondition] 
              }
            }
          }
        ]
      }
    };
  }

  // Add client display info
  if (field.clientDisplay && field.clientDisplay.length > 0) {
    property.clientDisplay = field.clientDisplay;
  }

  // Add search and list display info
  if (field.isSearchable) {
    property.isSearchable = true;
  }

  if (field.showInList) {
    property.showInList = true;
  }

  return property;
};

// Convert JSON Schema to string
export const generateJsonSchemaString = (fields, title, description) => {
  const schema = generateJsonSchema(fields, title, description);
  return JSON.stringify(schema, null, 2);
};

// Build Zod schema for validation
export const buildZodSchema = (fields) => {
  const schemaObj = {};

  fields.forEach(field => {
    schemaObj[field.name] = createZodValidator(field);
  });

  return z.object(schemaObj);
};

// Helper to create a Zod validator for a field
const createZodValidator = (field) => {
  let validator;

  switch (field.type) {
    case "text":
    case "password":
    case "textarea":
    case "tel":
    case "hidden":
      validator = z.string();
      if (field.minLength) validator = validator.min(parseInt(field.minLength, 10));
      if (field.maxLength) validator = validator.max(parseInt(field.maxLength, 10));
      if (field.pattern) validator = validator.regex(new RegExp(field.pattern));
      break;

    case "email":
      validator = z.string().email();
      if (field.minLength) validator = validator.min(parseInt(field.minLength, 10));
      if (field.maxLength) validator = validator.max(parseInt(field.maxLength, 10));
      break;

    case "url":
      validator = z.string().url();
      if (field.minLength) validator = validator.min(parseInt(field.minLength, 10));
      if (field.maxLength) validator = validator.max(parseInt(field.maxLength, 10));
      break;

    case "number":
    case "range":
      validator = z.number();
      if (field.min !== undefined && field.min !== "") validator = validator.min(parseFloat(field.min));
      if (field.max !== undefined && field.max !== "") validator = validator.max(parseFloat(field.max));
      break;

    case "select":
    case "radio":
      if (field.options && field.options.length > 0) {
        validator = z.enum(field.options);
      } else {
        validator = z.string();
      }
      break;

    case "multiselect":
      if (field.options && field.options.length > 0) {
        validator = z.array(z.enum(field.options));
      } else {
        validator = z.array(z.string());
      }
      break;

    case "checkbox":
      validator = z.boolean();
      break;

    case "date":
      validator = z.union([z.string(), z.date()]);
      break;

    case "time":
    case "datetime-local":
      validator = z.string();
      break;

    case "file":
      if (field.maxFiles > 1) {
        // Array of file paths
        validator = z.array(z.string()).max(field.maxFiles || 1);
      } else {
        // Single file path
        validator = z.string();
      }
      break;

    case "object":
      validator = z.object({});
      break;

    case "array":
      validator = z.array(z.string());
      break;

    default:
      validator = z.string();
  }

  // Make optional if not required
  if (!field.required) {
    validator = validator.optional();
  }

  return validator;
};

// Generate Zod schema string for validation
export const generateZodSchemaString = (fields, title) => {
  let schemaString = `import { z } from 'zod';\n\n`;
  schemaString += `// Schema for ${title}\n`;
  schemaString += `export const ${title.replace(/\s+/g, '')}Schema = z.object({\n`;

  fields.forEach((field, index) => {
    schemaString += `  ${field.name}: ${generateZodFieldString(field)}${index < fields.length - 1 ? ',' : ''}\n`;
  });

  schemaString += `});\n`;
  return schemaString;
};

// Helper to generate Zod field validation as string
const generateZodFieldString = (field) => {
  let validatorString = '';

  switch (field.type) {
    case "text":
    case "password":
    case "textarea":
    case "tel":
    case "hidden":
      validatorString = `z.string()`;
      if (field.minLength) validatorString += `.min(${field.minLength})`;
      if (field.maxLength) validatorString += `.max(${field.maxLength})`;
      if (field.pattern) validatorString += `.regex(/${field.pattern}/)`;
      break;

    case "email":
      validatorString = `z.string().email()`;
      if (field.minLength) validatorString += `.min(${field.minLength})`;
      if (field.maxLength) validatorString += `.max(${field.maxLength})`;
      break;

    case "url":
      validatorString = `z.string().url()`;
      if (field.minLength) validatorString += `.min(${field.minLength})`;
      if (field.maxLength) validatorString += `.max(${field.maxLength})`;
      break;

    case "number":
    case "range":
      validatorString = `z.number()`;
      if (field.min !== undefined && field.min !== "") validatorString += `.min(${field.min})`;
      if (field.max !== undefined && field.max !== "") validatorString += `.max(${field.max})`;
      break;

    case "select":
    case "radio":
      if (field.options && field.options.length > 0) {
        validatorString = `z.enum([${field.options.map(opt => `"${opt}"`).join(', ')}])`;
      } else {
        validatorString = `z.string()`;
      }
      break;

    case "multiselect":
      if (field.options && field.options.length > 0) {
        validatorString = `z.array(z.enum([${field.options.map(opt => `"${opt}"`).join(', ')}]))`;
      } else {
        validatorString = `z.array(z.string())`;
      }
      break;

    case "checkbox":
      validatorString = `z.boolean()`;
      break;

    case "date":
      validatorString = `z.union([z.string(), z.date()])`;
      break;

    case "time":
    case "datetime-local":
      validatorString = `z.string()`;
      break;

    case "file":
      if (field.maxFiles > 1) {
        validatorString = `z.array(z.string()).max(${field.maxFiles})`;
      } else {
        validatorString = `z.string()`;
      }
      break;

    case "object":
      validatorString = `z.object({})`;
      break;

    case "array":
      validatorString = `z.array(z.string())`;
      break;

    default:
      validatorString = `z.string()`;
  }

  // Add descriptions
  if (field.description) {
    validatorString += `.describe("${field.description}")`;
  }

  // Make optional if not required
  if (!field.required) {
    validatorString += `.optional()`;
  }

  return validatorString;
};

// Generate Uniforms-compatible schema
export const generateUniformsZodSchemaString = (fields, title) => {
  let schemaString = `import { z } from 'zod';\n\n`;
  schemaString += `// Uniforms Schema for ${title}\n`;
  schemaString += `export const ${title.replace(/\s+/g, '')}Schema = z.object({\n`;

  fields.forEach((field, index) => {
    schemaString += `  ${field.name}: ${generateUniformsZodFieldString(field)}${index < fields.length - 1 ? ',' : ''}\n`;
  });

  schemaString += `});\n`;
  return schemaString;
};

// Helper to generate Uniforms-compatible Zod field
const generateUniformsZodFieldString = (field) => {
  let validatorString = generateZodFieldString(field);
  
  // Add Uniforms specific metadata
  const meta = [];
  
  if (field.label) meta.push(`label: "${field.label}"`);
  if (field.placeholder) meta.push(`placeholder: "${field.placeholder}"`);
  
  // Add field specific metadata
  switch (field.type) {
    case "select":
    case "radio":
    case "multiselect":
      if (field.options && field.options.length > 0) {
        meta.push(`options: [${field.options.map(opt => `{ label: "${opt}", value: "${opt}" }`).join(', ')}]`);
      }
      break;
      
    case "textarea":
      meta.push(`component: "textarea"`);
      break;
      
    case "date":
      meta.push(`component: "datepicker"`);
      break;
      
    case "file":
      meta.push(`component: "fileupload"`);
      meta.push(`accept: "${field.accept || '*'}"`);
      meta.push(`maxFiles: ${field.maxFiles || 1}`);
      meta.push(`maxSize: ${field.maxSize || 5 * 1024 * 1024}`);
      meta.push(`fileServiceType: "${field.fileServiceType || 'SERVICE_FILE'}"`);
      break;
  }
  
  // Add show in list metadata
  if (field.showInList) {
    meta.push(`showInList: true`);
  }
  
  // Add is searchable metadata
  if (field.isSearchable) {
    meta.push(`isSearchable: true`);
  }
  
  // Add client display metadata
  if (field.clientDisplay && field.clientDisplay.length > 0) {
    meta.push(`clientDisplay: [${field.clientDisplay.map(client => `"${client}"`).join(', ')}]`);
  }
  
  // Add layout metadata if available
  if (field.column && field.column < 12) {
    meta.push(`column: ${field.column}`);
  }
  
  // Add dependency conditions if present
  if (field.depends && field.displayCondition) {
    meta.push(`depends: "${field.depends}"`);
    meta.push(`displayCondition: "${field.displayCondition}"`);
  }
  
  // Add metadata to validator
  if (meta.length > 0) {
    validatorString += `.meta({ ${meta.join(', ')} })`;
  }
  
  return validatorString;
};