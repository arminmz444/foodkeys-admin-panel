// export function convertSchemaToFields(schema) {
//     if (!schema || !schema.properties) return [];
    
//     const fields = [];
//     const required = schema.required || [];
    
//     Object.entries(schema.properties).forEach(([name, prop]) => {
//       const field = {
//         id: Date.now() + Math.random().toString(36).substr(2, 9),
//         name,
//         label: prop.title || name,
//         description: prop.description || '',
//         required: required.includes(name),
//         type: getFieldType(prop),
//         placeholder: prop.uniforms?.placeholder || '',
//         defaultValue: prop.default || '',
//         column: 12 // Default to full width
//       };
      
//       // Add validation
//       if (prop.type === 'string') {
//         field.minLength = prop.minLength || '';
//         field.maxLength = prop.maxLength || '';
//         field.pattern = prop.pattern || '';
//       } else if (prop.type === 'number') {
//         field.min = prop.minimum !== undefined ? prop.minimum : '';
//         field.max = prop.maximum !== undefined ? prop.maximum : '';
//         field.step = prop.multipleOf || '';
//       }
      
//       // Add options for select/radio/multiselect
//       if (prop.enum) {
//         field.options = prop.enum;
//       } else if (prop.type === 'array' && prop.items && prop.items.enum) {
//         field.options = prop.items.enum;
//       }
      
//       // Add layout information if available
//       if (prop.uniforms && prop.uniforms.layout) {
//         if (prop.uniforms.layout.column) {
//           field.column = prop.uniforms.layout.column;
//         }
//       }
      
//       // Add clientDisplay settings
//       if (prop.uniforms && prop.uniforms.clientDisplay) {
//         field.clientDisplay = prop.uniforms.clientDisplay;
//       }
      
//       fields.push(field);
//     });
    
//     return fields;
//   }
  
//   /**
//    * Determine field type from JSON schema property
//    * 
//    * @param {Object} prop - JSON Schema property
//    * @returns {String} Field type for FormPreview
//    */
//   export function getFieldType(prop) {
//     if (prop.type === 'string') {
//       if (prop.format === 'email') return 'email';
//       if (prop.format === 'uri') return 'url';
//       if (prop.format === 'date') return 'date';
//       if (prop.format === 'time') return 'time';
//       if (prop.format === 'date-time') return 'datetime-local';
//       if (prop.uniforms && prop.uniforms.component === 'LongTextField') return 'textarea';
//       if (prop.enum) {
//         return prop.uniforms && prop.uniforms.checkboxes ? 'radio' : 'select';
//       }
//       return 'text';
//     }
    
//     if (prop.type === 'number' || prop.type === 'integer') return 'number';
//     if (prop.type === 'boolean') return 'checkbox';
    
//     if (prop.type === 'array') {
//       if (prop.items && prop.items.enum) return 'multiselect';
//       if (prop.items && prop.items.type === 'string') return 'array';
//       return 'array';
//     }
    
//     if (prop.type === 'object') return 'object';
    
//     return 'text';
//   }
  
//   /**
//    * Convert form field values to match the expected API format
//    * 
//    * @param {Object} formData - Form data from FormPreview
//    * @param {Object} schema - JSON Schema object
//    * @returns {Object} Formatted data for API
//    */
//   export function formatFormDataForApi(formData, schema) {
//     if (!formData || !schema || !schema.properties) return formData;
    
//     const result = {};
    
//     // Process each property according to its type
//     Object.entries(formData).forEach(([key, value]) => {
//       const propSchema = schema.properties[key];
      
//       if (!propSchema) {
//         // If not in schema, pass through unchanged
//         result[key] = value;
//         return;
//       }
      
//       if (propSchema.type === 'number' || propSchema.type === 'integer') {
//         // Convert string to number
//         if (value === '' || value === null || value === undefined) {
//           result[key] = null;
//         } else {
//           result[key] = Number(value);
//         }
//       } else if (propSchema.type === 'boolean') {
//         // Ensure boolean
//         result[key] = !!value;
//       } else if (propSchema.type === 'array') {
//         // Ensure array
//         result[key] = Array.isArray(value) ? value : (value ? [value] : []);
//       } else {
//         // Pass through other types
//         result[key] = value;
//       }
//     });
    
//     return result;
//   }

// src/app/shared-components/utils/schemaConverter.js
// Utility functions to convert between JSON Schema and form fields

/**
 * Convert JSON schema to form field definitions
 * 
 * @param {Object} schema - JSON Schema object
 * @returns {Array} Array of field definitions
 */
export function convertSchemaToFields(schema) {
  if (!schema || !schema.properties) return [];
  
  const fields = [];
  const required = schema.required || [];
  
  Object.entries(schema.properties).forEach(([name, prop]) => {
    const field = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name,
      label: prop.title || name,
      description: prop.description || '',
      required: required.includes(name),
      type: getFieldType(prop),
      placeholder: prop.placeholder || '',
      defaultValue: prop.default || '',
      column: 12 // Default to full width
    };
    
    // Add validation
    if (prop.type === 'string') {
      field.minLength = prop.minLength || '';
      field.maxLength = prop.maxLength || '';
      field.pattern = prop.pattern || '';
      
      // Add format specific info
      if (prop.format === 'date' || prop.format === 'date-time') {
        field.dateFormat = prop.format;
      }
    } else if (prop.type === 'number' || prop.type === 'integer') {
      field.min = prop.minimum !== undefined ? prop.minimum : '';
      field.max = prop.maximum !== undefined ? prop.maximum : '';
      field.step = prop.multipleOf || '';
    } else if (prop.type === 'array') {
      field.minItems = prop.minItems || 0;
      field.maxItems = prop.maxItems;
      
      // Set item type information
      if (prop.items) {
        field.itemType = prop.items.type || 'string';
        if (prop.items.enum) {
          field.options = prop.items.enum;
        }
      }
    }
    
    // Add options for select/radio/multiselect
    if (prop.enum) {
      field.options = prop.enum;
    }
    
    // Add layout information if available
    if (prop.uniforms && prop.uniforms.layout) {
      if (prop.uniforms.layout.column) {
        field.column = prop.uniforms.layout.column;
      }
    }
    
    // Add clientDisplay settings
    if (prop.uniforms && prop.uniforms.clientDisplay) {
      field.clientDisplay = prop.uniforms.clientDisplay;
    }
    
    // Add placeholder from uniforms if available
    if (prop.uniforms && prop.uniforms.placeholder) {
      field.placeholder = prop.uniforms.placeholder;
    }
    
    fields.push(field);
  });
  
  return fields;
}

/**
 * Determine field type from JSON schema property
 * 
 * @param {Object} prop - JSON Schema property
 * @returns {String} Field type for FormPreview
 */
export function getFieldType(prop) {
  if (prop.type === 'string') {
    if (prop.format === 'email') return 'email';
    if (prop.format === 'uri') return 'url';
    if (prop.format === 'date') return 'date';
    if (prop.format === 'time') return 'time';
    if (prop.format === 'date-time') return 'datetime-local';
    if (prop.uniforms && prop.uniforms.component === 'LongTextField') return 'textarea';
    if (prop.enum) {
      return prop.uniforms && prop.uniforms.checkboxes ? 'radio' : 'select';
    }
    return 'text';
  }
  
  if (prop.type === 'number' || prop.type === 'integer') return 'number';
  if (prop.type === 'boolean') return 'checkbox';
  
  if (prop.type === 'array') {
    // Check for array of simple types (strings, numbers)
    if (prop.items && prop.items.enum) return 'multiselect';
    if (prop.items && (prop.items.type === 'string' || prop.items.type === 'number')) return 'array';
    
    // Check for array of objects
    if (prop.items && prop.items.type === 'object') return 'objectArray';
    
    return 'array';
  }
  
  if (prop.type === 'object') return 'object';
  
  return 'text';
}

/**
 * Convert date string to Date object
 * 
 * @param {string} dateStr - Date string in ISO format
 * @returns {Date|null} Date object or null if invalid
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (err) {
    return null;
  }
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 * 
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
export function formatDateToIso(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert form field values to match the expected API format
 * 
 * @param {Object} formData - Form data from FormPreview
 * @param {Object} schema - JSON Schema object
 * @returns {Object} Formatted data for API
 */
export function formatFormDataForApi(formData, schema) {
  if (!formData || !schema || !schema.properties) return formData;
  
  const result = {};
  
  // Process each property according to its type
  Object.entries(formData).forEach(([key, value]) => {
    const propSchema = schema.properties[key];
    
    if (!propSchema) {
      // If not in schema, pass through unchanged
      result[key] = value;
      return;
    }
    
    if (propSchema.type === 'number' || propSchema.type === 'integer') {
      // Convert string to number
      if (value === '' || value === null || value === undefined) {
        result[key] = null;
      } else {
        result[key] = Number(value);
      }
    } else if (propSchema.type === 'boolean') {
      // Ensure boolean
      result[key] = !!value;
    } else if (propSchema.type === 'array') {
      // Ensure array and handle different array types
      if (!value) {
        // Empty or undefined value
        result[key] = [];
      } else if (Array.isArray(value)) {
        // Handle array cleaning - filter out empty strings if it's an array of primitives
        if (propSchema.items && (propSchema.items.type === 'string' || propSchema.items.type === 'number')) {
          // For primitive arrays, filter out empty values
          result[key] = value.filter(item => item !== null && item !== undefined && item !== '');
          
          // Convert strings to numbers for number arrays
          if (propSchema.items.type === 'number') {
            result[key] = result[key].map(item => Number(item));
          }
        } else {
          // For object arrays or other types, keep as is
          result[key] = value;
        }
      } else {
        // If not an array but has a value, wrap in array
        result[key] = [value];
      }
      
      // If array is empty but required/minItems is set, add an empty element
      if (result[key].length === 0 && propSchema.minItems && propSchema.minItems > 0) {
        if (propSchema.items && propSchema.items.type === 'string') {
          result[key] = [''];
        } else if (propSchema.items && propSchema.items.type === 'number') {
          result[key] = [0];
        } else if (propSchema.items && propSchema.items.type === 'object') {
          result[key] = [{}];
        }
      }
    } else if (propSchema.type === 'string') {
      // Handle dates
      if (propSchema.format === 'date' && value instanceof Date) {
        result[key] = formatDateToIso(value);
      } else if (propSchema.format === 'date-time' && value instanceof Date) {
        result[key] = value.toISOString();
      } else {
        // For other string types
        result[key] = value;
      }
    } else {
      // Pass through other types
      result[key] = value;
    }
  });
  
  return result;
}

/**
 * Prepare initial data from API by converting string dates to Date objects
 * 
 * @param {Object} apiData - Data from API 
 * @param {Object} schema - JSON Schema object
 * @returns {Object} Formatted data for form
 */
export function prepareInitialData(apiData, schema) {
  if (!apiData || !schema || !schema.properties) return apiData;
  
  const result = { ...apiData };
  
  // Process each property according to its type
  Object.entries(schema.properties).forEach(([key, prop]) => {
    const value = apiData[key];
    
    if (value === undefined || value === null) return;
    
    if (prop.type === 'string') {
      // Convert date strings to Date objects
      if ((prop.format === 'date' || prop.format === 'date-time') && typeof value === 'string') {
        result[key] = parseDate(value);
      }
    } else if (prop.type === 'array' && !Array.isArray(value)) {
      // Ensure arrays are always arrays
      result[key] = value ? [value] : [];
    }
  });
  
  return result;
}