import * as z from 'zod';

/**
 * Convert a JSON schema to a Zod validation schema
 * @param {Object} jsonSchema - The JSON schema to convert
 * @returns {z.ZodType} - The resulting Zod schema
 */
export const jsonSchemaToZod = (jsonSchema) => {
  if (!jsonSchema || typeof jsonSchema !== 'object') {
    return z.any();
  }

  // Parse the schema if it's a string
  const schema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;

  switch (schema.type) {
    case 'string': {
      let zodSchema = z.string({
        required_error: schema.errorMessage?.required || 'این فیلد الزامی است',
        invalid_type_error: 'مقدار باید رشته باشد',
      });

      if (schema.minLength !== undefined) {
        zodSchema = zodSchema.min(schema.minLength, `حداقل ${schema.minLength} کاراکتر لازم است`);
      }

      if (schema.maxLength !== undefined) {
        zodSchema = zodSchema.max(schema.maxLength, `حداکثر ${schema.maxLength} کاراکتر مجاز است`);
      }

      if (schema.pattern) {
        zodSchema = zodSchema.regex(new RegExp(schema.pattern), schema.errorMessage?.pattern || 'فرمت نامعتبر است');
      }

      if (schema.format === 'email') {
        zodSchema = zodSchema.email('ایمیل نامعتبر است');
      }

      if (schema.format === 'uri') {
        zodSchema = zodSchema.url('آدرس نامعتبر است');
      }

      if (schema.enum) {
        zodSchema = z.enum(schema.enum, {
          errorMap: () => ({ message: schema.errorMessage?.enum || 'مقدار باید یکی از مقادیر مجاز باشد' }),
        });
      }

      return schema.nullable ? zodSchema.nullable() : zodSchema;
    }

    case 'number':
    case 'integer': {
      let zodSchema = schema.type === 'integer' ? z.number().int('مقدار باید عدد صحیح باشد') : z.number({
        required_error: schema.errorMessage?.required || 'این فیلد الزامی است',
        invalid_type_error: 'مقدار باید عدد باشد',
      });

      if (schema.minimum !== undefined) {
        zodSchema = zodSchema.min(schema.minimum, `مقدار باید بزرگتر یا مساوی ${schema.minimum} باشد`);
      }

      if (schema.maximum !== undefined) {
        zodSchema = zodSchema.max(schema.maximum, `مقدار باید کوچکتر یا مساوی ${schema.maximum} باشد`);
      }

      if (schema.exclusiveMinimum !== undefined) {
        zodSchema = zodSchema.gt(schema.exclusiveMinimum, `مقدار باید بزرگتر از ${schema.exclusiveMinimum} باشد`);
      }

      if (schema.exclusiveMaximum !== undefined) {
        zodSchema = zodSchema.lt(schema.exclusiveMaximum, `مقدار باید کوچکتر از ${schema.exclusiveMaximum} باشد`);
      }

      if (schema.multipleOf !== undefined) {
        zodSchema = zodSchema.refine(
          (val) => val % schema.multipleOf === 0,
          { message: `مقدار باید مضربی از ${schema.multipleOf} باشد` }
        );
      }

      return schema.nullable ? zodSchema.nullable() : zodSchema;
    }

    case 'boolean': {
      const zodSchema = z.boolean({
        required_error: schema.errorMessage?.required || 'این فیلد الزامی است',
        invalid_type_error: 'مقدار باید بولین باشد',
      });

      return schema.nullable ? zodSchema.nullable() : zodSchema;
    }

    case 'null': {
      return z.null();
    }

    case 'array': {
      let itemSchema;
      if (schema.items) {
        itemSchema = jsonSchemaToZod(schema.items);
      } else {
        itemSchema = z.any();
      }

      let zodSchema = z.array(itemSchema, {
        required_error: schema.errorMessage?.required || 'این فیلد الزامی است',
        invalid_type_error: 'مقدار باید آرایه باشد',
      });

      if (schema.minItems !== undefined) {
        zodSchema = zodSchema.min(schema.minItems, `حداقل ${schema.minItems} آیتم لازم است`);
      }

      if (schema.maxItems !== undefined) {
        zodSchema = zodSchema.max(schema.maxItems, `حداکثر ${schema.maxItems} آیتم مجاز است`);
      }

      if (schema.uniqueItems) {
        zodSchema = zodSchema.refine(
          (arr) => new Set(arr.map(JSON.stringify)).size === arr.length,
          { message: 'آیتم‌ها باید یکتا باشند' }
        );
      }

      return schema.nullable ? zodSchema.nullable() : zodSchema;
    }

    case 'object': {
      if (!schema.properties) {
        return schema.nullable ? z.object({}).nullable() : z.object({});
      }

      const shape = {};
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const isRequired = schema.required && schema.required.includes(key);
        const propZodSchema = jsonSchemaToZod(propSchema);

        shape[key] = isRequired ? propZodSchema : propZodSchema.optional();
      }

      let zodSchema = z.object(shape, {
        required_error: schema.errorMessage?.required || 'این فیلد الزامی است',
        invalid_type_error: 'مقدار باید آبجکت باشد',
      });

      // Handle additional properties
      if (schema.additionalProperties === false) {
        zodSchema = zodSchema.strict();
      }

      return schema.nullable ? zodSchema.nullable() : zodSchema;
    }

    default: {
      if (schema.allOf) {
        return z.intersection(schema.allOf.map(jsonSchemaToZod));
      }

      if (schema.anyOf || schema.oneOf) {
        return z.union((schema.anyOf || schema.oneOf).map(jsonSchemaToZod));
      }

      return z.any();
    }
  }
};

/**
 * Create a form structure from a JSON Schema
 * @param {Object} jsonSchema - The JSON schema to parse
 * @param {string} [parentPath=''] - The path prefix for nested fields
 * @returns {Array} - Array of field definitions for rendering forms
 */
export const createFormStructure = (jsonSchema, parentPath = '') => {
  if (!jsonSchema || typeof jsonSchema !== 'object') {
    return [];
  }

  // Parse the schema if it's a string
  const schema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
  
  if (schema.type !== 'object' || !schema.properties) {
    return [];
  }

  const formFields = [];

  // Process properties in the order specified by 'propertyOrder' if available, otherwise use default order
  const propertyNames = schema.propertyOrder || Object.keys(schema.properties);
  
  for (const propertyName of propertyNames) {
    if (!schema.properties[propertyName]) continue;
    
    const property = schema.properties[propertyName];
    const isRequired = schema.required && schema.required.includes(propertyName);
    const fieldPath = parentPath ? `${parentPath}.${propertyName}` : propertyName;
    
    // Skip if the property is marked as hidden in the UI
    if (property.ui && property.ui.hidden === true) {
      continue;
    }

    const fieldDefinition = {
      name: propertyName,
      path: fieldPath,
      type: property.type,
      title: property.title || propertyName,
      description: property.description || '',
      required: isRequired,
      validation: property,
      ui: property.ui || {}
    };

    switch (property.type) {
      case 'string':
        if (property.enum) {
          fieldDefinition.component = 'select';
          fieldDefinition.options = property.enum.map((value, index) => ({
            value,
            label: property.enumNames?.[index] || value
          }));
        } else if (property.format === 'date') {
          fieldDefinition.component = 'datepicker';
        } else if (property.format === 'date-time') {
          fieldDefinition.component = 'datetimepicker';
        } else if (property.format === 'email') {
          fieldDefinition.component = 'email';
        } else if (property.format === 'uri') {
          fieldDefinition.component = 'url';
        } else if (property.format === 'color') {
          fieldDefinition.component = 'colorpicker';
        } else if (property.format === 'rich-text') {
          fieldDefinition.component = 'richtext';
        } else {
          fieldDefinition.component = property.ui?.widget || 'text';
        }
        break;
        
      case 'number':
      case 'integer':
        fieldDefinition.component = 'number';
        break;
        
      case 'boolean':
        fieldDefinition.component = 'checkbox';
        break;
        
      case 'array':
        if (property.items && property.items.type === 'string' && property.items.enum) {
          fieldDefinition.component = 'multiselect';
          fieldDefinition.options = property.items.enum.map((value, index) => ({
            value,
            label: property.items.enumNames?.[index] || value
          }));
        } else if (property.items && property.items.type === 'object') {
          fieldDefinition.component = 'array';
          fieldDefinition.subfields = createFormStructure(property.items, `${fieldPath}[].`);
        } else {
          fieldDefinition.component = 'array';
        }
        break;
        
      case 'object':
        fieldDefinition.component = 'fieldset';
        fieldDefinition.subfields = createFormStructure(property, fieldPath);
        break;
        
      default:
        fieldDefinition.component = 'text';
    }

    formFields.push(fieldDefinition);
  }

  return formFields;
};

/**
 * Prepare initial values for a form based on a JSON schema
 * @param {Object} jsonSchema - The JSON schema
 * @param {Object} [existingData={}] - Existing data to pre-populate the form
 * @returns {Object} - The initial form values
 */
export const prepareFormInitialValues = (jsonSchema, existingData = {}) => {
  if (!jsonSchema || typeof jsonSchema !== 'object') {
    return {};
  }

  // Parse the schema if it's a string
  const schema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
  
  if (schema.type !== 'object' || !schema.properties) {
    return existingData || {};
  }

  const initialValues = { ...existingData };

  for (const [key, property] of Object.entries(schema.properties)) {
    // Skip if value already exists in the data
    if (initialValues[key] !== undefined) {
      continue;
    }

    // Set default value based on the property type
    switch (property.type) {
      case 'string':
        initialValues[key] = property.default || '';
        break;
        
      case 'number':
      case 'integer':
        initialValues[key] = property.default !== undefined ? property.default : null;
        break;
        
      case 'boolean':
        initialValues[key] = property.default !== undefined ? property.default : false;
        break;
        
      case 'array':
        initialValues[key] = property.default || [];
        break;
        
      case 'object':
        initialValues[key] = prepareFormInitialValues(property, existingData[key] || {});
        break;
        
      default:
        initialValues[key] = property.default !== undefined ? property.default : null;
    }
  }

  return initialValues;
};

/**
 * Create a dynamic form validator based on a JSON schema
 * @param {Object} jsonSchema - The JSON schema to use for validation
 * @returns {Function} - A validation function to use with react-hook-form
 */
export const createValidator = (jsonSchema) => {
  const zodSchema = jsonSchemaToZod(jsonSchema);
  
  return (data) => {
    try {
      zodSchema.parse(data);
      return true;
    } catch (error) {
      return error.format();
    }
  };
};

/**
 * Generate placeholder text based on field properties
 * @param {Object} field - The field definition
 * @returns {string} - The placeholder text
 */
export const generatePlaceholder = (field) => {
  if (field.ui && field.ui.placeholder) {
    return field.ui.placeholder;
  }
  
  if (field.title) {
    return `${field.title} را وارد کنید...`;
  }
  
  return '';
};

/**
 * Get field error message from react-hook-form errors
 * @param {Object} errors - The errors object from react-hook-form
 * @param {string} path - The field path
 * @returns {string|undefined} - The error message
 */
export const getFieldError = (errors, path) => {
  if (!errors || !path) return undefined;
  
  const pathParts = path.split('.');
  let current = errors;
  
  for (const part of pathParts) {
    const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      // Handle array notation like "items[0]"
      const [, arrayName, index] = arrayMatch;
      current = current[arrayName]?.[parseInt(index)];
    } else {
      current = current[part];
    }
    
    if (!current) return undefined;
  }
  
  return current.message;
};

/**
 * Parse a JSON string safely
 * @param {string} jsonString - The JSON string to parse
 * @param {*} defaultValue - Default value to return if parsing fails
 * @returns {*} - The parsed JSON or the default value
 */
export const safeJsonParse = (jsonString, defaultValue = {}) => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};