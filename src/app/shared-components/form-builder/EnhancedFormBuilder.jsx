// // src/app/shared-components/form-builder/EnhancedFormBuilder.jsx
// import React, { useState, useCallback, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Switch,
//   FormControlLabel,
//   Button,
//   IconButton,
//   Typography,
//   Divider,
//   Paper,
//   Tabs,
//   Tab,
//   Box,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
//   OutlinedInput,
//   Checkbox,
//   ListItemText,
//   Radio,
//   RadioGroup,
//   FormLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
//   Grid
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import PreviewIcon from "@mui/icons-material/Preview";
// import CodeIcon from "@mui/icons-material/Code";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import { z } from 'zod';

// // Field type options
// const FIELD_TYPES = [
//   { value: "text", label: "متن" },
//   { value: "email", label: "ایمیل" },
//   { value: "password", label: "رمز عبور" },
//   { value: "number", label: "عدد" },
//   { value: "tel", label: "تلفن" },
//   { value: "url", label: "آدرس اینترنتی" },
//   { value: "textarea", label: "متن چند خطی" },
//   { value: "select", label: "انتخاب از لیست" },
//   { value: "multiselect", label: "انتخاب چندتایی" },
//   { value: "checkbox", label: "چک باکس" },
//   { value: "radio", label: "دکمه رادیویی" },
//   { value: "date", label: "تاریخ" },
//   { value: "time", label: "زمان" },
//   { value: "datetime-local", label: "تاریخ و زمان" },
//   { value: "range", label: "محدوده" },
//   { value: "color", label: "رنگ" },
//   { value: "file", label: "فایل" },
//   { value: "hidden", label: "مخفی" },
//   { value: "object", label: "آبجکت (گروه)" },
//   { value: "array", label: "آرایه (لیست)" },
// ];

// // Client options for form rendering
// const CLIENT_OPTIONS = [
//   { value: "ADMIN_PANEL", label: "پنل ادمین" },
//   { value: "USER_PANEL", label: "پنل کاربری" },
//   { value: "MAIN_WEBSITE", label: "وب سایت اصلی" },
//   { value: "API", label: "API" },
// ];

// // Create a new empty field
// const createEmptyField = () => ({
//   id: Date.now().toString(),
//   name: "",
//   label: "",
//   type: "text",
//   required: false,
//   description: "",
//   placeholder: "",
//   defaultValue: "",
//   minLength: "",
//   maxLength: "",
//   min: "",
//   max: "",
//   step: "",
//   pattern: "",
//   options: [],
//   multiple: false,
//   validateAs: "",
//   properties: {}, // For object types
//   items: {}, // For array types
//   isSearchable: false, // For elasticsearch indexing
//   showInList: false, // Display in service list
//   depends: "", // Field dependencies
//   displayCondition: "",
//   clientDisplay: ["ADMIN_PANEL", "USER_PANEL"], // Where this field should appear
// });

// // Helper to deep clone an object
// const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// // Helper to reorder fields after drag and drop
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

// const EnhancedFormBuilder = ({
//   initialFields = [],
//   onChange,
//   onSchemaExport,
//   onPreview,
//   clientOptions = CLIENT_OPTIONS
// }) => {
//   // State
//   const [fields, setFields] = useState([]);
//   const [currentField, setCurrentField] = useState(createEmptyField());
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [previewData, setPreviewData] = useState({});
//   const [formTitle, setFormTitle] = useState("فرم سرویس");
//   const [formDescription, setFormDescription] = useState("");
//   const [schemaFormat, setSchemaFormat] = useState("json"); // 'json', 'zod', or 'uniforms'
//   const [showCodeDialog, setShowCodeDialog] = useState(false);
//   const [generatedSchema, setGeneratedSchema] = useState("");
//   const [expanded, setExpanded] = useState(null);

//   // Load initial fields
//   useEffect(() => {
//     if (initialFields && initialFields.length > 0) {
//       setFields(initialFields);
//     }
//   }, [initialFields]);

//   // Handle field changes
//   const handleFieldChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === "checkbox") {
//       setCurrentField((prev) => ({ ...prev, [name]: checked }));
//     } else if (name === "type" && value !== currentField.type) {
//       // Reset specific properties when changing field type
//       let updatedField = { ...currentField, type: value };
      
//       if (value === "select" || value === "multiselect" || value === "radio") {
//         updatedField.options = currentField.options.length ? currentField.options : ["Option 1"];
//       } else {
//         delete updatedField.options;
//       }
      
//       if (value === "object") {
//         updatedField.properties = {};
//       }
      
//       if (value === "array") {
//         updatedField.items = { type: "text" };
//       }
      
//       setCurrentField(updatedField);
//     } else {
//       setCurrentField((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle options change for select/radio fields
//   const handleOptionsChange = (value) => {
//     const options = value
//       .split(",")
//       .map((opt) => opt.trim())
//       .filter((opt) => opt);
//     setCurrentField((prev) => ({ ...prev, options }));
//   };

//   // Handle client display options change
//   const handleClientDisplayChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setCurrentField((prev) => ({
//       ...prev,
//       clientDisplay: typeof value === 'string' ? value.split(',') : value,
//     }));
//   };

//   // Add or update field
//   const handleAddOrUpdateField = () => {
//     if (!currentField.name.trim()) {
//       alert("لطفاً نام فیلد را وارد کنید");
//       return;
//     }

//     // Ensure name is in proper format (camelCase)
//     const fieldName = currentField.name
//       .trim()
//       .replace(/\s+/g, '_')
//       .replace(/[^a-zA-Z0-9_]/g, '');
    
//     // Check for duplicate names
//     const duplicateName = fields.find(
//       (f, idx) => f.name === fieldName && idx !== editingIndex
//     );
    
//     if (duplicateName) {
//       alert(`فیلدی با نام "${fieldName}" قبلاً وجود دارد`);
//       return;
//     }

//     const updatedField = { ...currentField, name: fieldName };
    
//     if (editingIndex !== null) {
//       // Update existing field
//       const updatedFields = [...fields];
//       updatedFields[editingIndex] = updatedField;
//       setFields(updatedFields);
//       setEditingIndex(null);
//     } else {
//       // Add new field
//       setFields((prev) => [...prev, updatedField]);
//     }
    
//     // Reset current field
//     setCurrentField(createEmptyField());
    
//     // Notify parent component
//     if (onChange) {
//       onChange(editingIndex !== null 
//         ? [...fields.slice(0, editingIndex), updatedField, ...fields.slice(editingIndex + 1)]
//         : [...fields, updatedField]);
//     }
//   };

//   // Edit existing field
//   const handleEditField = (index) => {
//     setCurrentField(deepClone(fields[index]));
//     setEditingIndex(index);
//     setActiveTab(0); // Switch to the field editor tab
//   };

//   // Delete field
//   const handleDeleteField = (index) => {
//     if (window.confirm("آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟")) {
//       const updatedFields = fields.filter((_, i) => i !== index);
//       setFields(updatedFields);
      
//       if (editingIndex === index) {
//         setEditingIndex(null);
//         setCurrentField(createEmptyField());
//       } else if (editingIndex !== null && editingIndex > index) {
//         setEditingIndex(editingIndex - 1);
//       }
      
//       // Notify parent component
//       if (onChange) {
//         onChange(updatedFields);
//       }
//     }
//   };

//   // Handle drag end
//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
    
//     const reorderedFields = reorder(
//       fields,
//       result.source.index,
//       result.destination.index
//     );
    
//     setFields(reorderedFields);
    
//     // Notify parent component
//     if (onChange) {
//       onChange(reorderedFields);
//     }
//   };

//   // Handle tab change
//   const handleTabChange = (_, newValue) => {
//     setActiveTab(newValue);
//   };

//   // Reset the form
//   const handleReset = () => {
//     if (window.confirm("آیا مطمئن هستید که می‌خواهید همه فیلدها را حذف کنید؟")) {
//       setFields([]);
//       setCurrentField(createEmptyField());
//       setEditingIndex(null);
//       setActiveTab(0);
      
//       // Notify parent component
//       if (onChange) {
//         onChange([]);
//       }
//     }
//   };

//   // Generate JSON Schema
//   const generateJsonSchema = useCallback(() => {
//     const properties = {};
//     const required = [];

//     fields.forEach((field) => {
//       let propertySchema = {};
      
//       switch (field.type) {
//         case "text":
//         case "password":
//         case "textarea":
//         case "email":
//         case "url":
//         case "tel":
//         case "color":
//           propertySchema.type = "string";
//           if (field.minLength) propertySchema.minLength = parseInt(field.minLength);
//           if (field.maxLength) propertySchema.maxLength = parseInt(field.maxLength);
//           if (field.pattern) propertySchema.pattern = field.pattern;
//           if (field.validateAs === "email") propertySchema.format = "email";
//           if (field.validateAs === "url") propertySchema.format = "uri";
//           break;
        
//         case "number":
//         case "range":
//           propertySchema.type = "number";
//           if (field.min !== "") propertySchema.minimum = parseFloat(field.min);
//           if (field.max !== "") propertySchema.maximum = parseFloat(field.max);
//           if (field.step !== "") propertySchema.multipleOf = parseFloat(field.step);
//           break;
        
//         case "date":
//         case "datetime-local":
//         case "time":
//           propertySchema.type = "string";
//           propertySchema.format = field.type === "date" ? "date" : (field.type === "time" ? "time" : "date-time");
//           break;
        
//         case "checkbox":
//           propertySchema.type = "boolean";
//           break;
        
//         case "select":
//           propertySchema.type = "string";
//           propertySchema.enum = field.options;
//           break;
        
//         case "multiselect":
//           propertySchema.type = "array";
//           propertySchema.items = { type: "string", enum: field.options };
//           propertySchema.uniqueItems = true;
//           break;
        
//         case "radio":
//           propertySchema.type = "string";
//           propertySchema.enum = field.options;
//           break;
        
//         case "file":
//           propertySchema.type = "string";
//           propertySchema.format = "binary";
//           break;
        
//         case "object":
//           propertySchema.type = "object";
//           propertySchema.properties = {};
//           break;
        
//         case "array":
//           propertySchema.type = "array";
//           propertySchema.items = field.items || { type: "string" };
//           break;
          
//         default:
//           propertySchema.type = "string";
//       }
      
//       // Add extra UI properties
//       propertySchema.title = field.label || field.name;
//       if (field.description) propertySchema.description = field.description;
//       if (field.defaultValue !== undefined && field.defaultValue !== "") {
//         propertySchema.default = field.type === "number" ? parseFloat(field.defaultValue) : field.defaultValue;
//       }
      
//       // Handle conditionals
//       if (field.depends && field.displayCondition) {
//         if (!propertySchema.allOf) propertySchema.allOf = [];
//         propertySchema.allOf.push({
//           if: {
//             properties: {
//               [field.depends]: { enum: [field.displayCondition] }
//             }
//           }
//         });
//       }
      
//       // Add UI specific properties
//       propertySchema.uniforms = {
//         placeholder: field.placeholder,
//         showInList: field.showInList,
//         isSearchable: field.isSearchable,
//         clientDisplay: field.clientDisplay
//       };
      
//       properties[field.name] = propertySchema;
      
//       if (field.required) {
//         required.push(field.name);
//       }
//     });

//     const schema = {
//       type: "object",
//       title: formTitle,
//       description: formDescription,
//       properties,
//       required: required.length > 0 ? required : undefined
//     };

//     return schema;
//   }, [fields, formTitle, formDescription]);

//   // Generate Zod Schema
//   const generateZodSchema = useCallback(() => {
//     const indent = '  ';
//     let zodCode = `import { z } from 'zod';\n\n`;
//     zodCode += `const ${formTitle.replace(/\s+/g, '')}Schema = z.object({\n`;
    
//     fields.forEach((field) => {
//       zodCode += `${indent}${field.name}: `;
      
//       switch (field.type) {
//         case "text":
//         case "password":
//         case "textarea":
//         case "email":
//         case "url":
//         case "tel":
//         case "color":
//           zodCode += 'z.string()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//           if (field.minLength) zodCode += `.min(${field.minLength}, { message: "حداقل ${field.minLength} کاراکتر وارد کنید" })`;
//           if (field.maxLength) zodCode += `.max(${field.maxLength}, { message: "حداکثر ${field.maxLength} کاراکتر مجاز است" })`;
//           if (field.validateAs === "email") zodCode += '.email({ message: "ایمیل معتبر وارد کنید" })';
//           if (field.validateAs === "url") zodCode += '.url({ message: "آدرس اینترنتی معتبر وارد کنید" })';
//           if (field.pattern) zodCode += `.regex(new RegExp('${field.pattern}'), { message: "فرمت وارد شده صحیح نیست" })`;
//           break;
        
//         case "number":
//         case "range":
//           zodCode += 'z.number()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//           if (field.min !== "") zodCode += `.min(${field.min}, { message: "حداقل مقدار ${field.min} است" })`;
//           if (field.max !== "") zodCode += `.max(${field.max}, { message: "حداکثر مقدار ${field.max} است" })`;
//           break;
        
//         case "date":
//         case "datetime-local":
//         case "time":
//           zodCode += 'z.string()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//           break;
        
//         case "checkbox":
//           zodCode += 'z.boolean()';
//           break;
        
//         case "select":
//           zodCode += `z.enum([${field.options.map(opt => `"${opt}"`).join(', ')}])`;
//           if (!field.required) zodCode += '.optional()';
//           break;
        
//         case "multiselect":
//           zodCode += `z.array(z.enum([${field.options.map(opt => `"${opt}"`).join(', ')}]))`;
//           if (field.required) zodCode += '.min(1, { message: "حداقل یک گزینه انتخاب کنید" })';
//           break;
        
//         case "radio":
//           zodCode += `z.enum([${field.options.map(opt => `"${opt}"`).join(', ')}])`;
//           if (!field.required) zodCode += '.optional()';
//           break;
        
//         case "file":
//           zodCode += 'z.instanceof(File).optional()';
//           if (field.required) zodCode += '.refine((val) => val !== undefined, { message: "فایل الزامی است" })';
//           break;
        
//         case "object":
//           zodCode += 'z.object({})';
//           break;
        
//         case "array":
//           zodCode += 'z.array(z.string())';
//           if (field.required) zodCode += '.min(1, { message: "حداقل یک مورد الزامی است" })';
//           break;
          
//         default:
//           zodCode += 'z.string()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//       }
      
//       // Add uniforms metadata
//       zodCode += `.uniforms({\n${indent}${indent}label: "${field.label || field.name}",`;
//       if (field.placeholder) zodCode += `\n${indent}${indent}placeholder: "${field.placeholder}",`;
//       if (field.description) zodCode += `\n${indent}${indent}description: "${field.description}",`;
//       if (field.defaultValue) zodCode += `\n${indent}${indent}defaultValue: ${field.type === "number" ? field.defaultValue : `"${field.defaultValue}"`},`;
//       if (field.isSearchable) zodCode += `\n${indent}${indent}isSearchable: true,`;
//       if (field.showInList) zodCode += `\n${indent}${indent}showInList: true,`;
//       if (field.clientDisplay?.length) {
//         zodCode += `\n${indent}${indent}clientDisplay: [${field.clientDisplay.map(c => `"${c}"`).join(', ')}],`;
//       }
//       zodCode += `\n${indent}})`;
      
//       // Make optional if not required (except for boolean and fields already marked optional)
//       if (!field.required && field.type !== "checkbox" && field.type !== "select" && field.type !== "radio") {
//         zodCode += '.optional()';
//       }
      
//       zodCode += ',\n';
//     });
    
//     zodCode += '});\n\nexport default ' + formTitle.replace(/\s+/g, '') + 'Schema;';
    
//     return zodCode;
//   }, [fields, formTitle]);

//   // Generate Uniforms-compatible Zod schema
//   const generateUniformsZodSchema = useCallback(() => {
//     const indent = '  ';
//     let zodCode = `import { z } from 'zod';\n\n`;
//     zodCode += `// Schema optimized for Uniforms with enhanced layout information\n`;
//     zodCode += `const ${formTitle.replace(/\s+/g, '')}Schema = z.object({\n`;
    
//     fields.forEach((field) => {
//       zodCode += `${indent}${field.name}: `;
      
//       switch (field.type) {
//         case "text":
//         case "password":
//         case "textarea":
//         case "email":
//         case "url":
//         case "tel":
//         case "color":
//           zodCode += 'z.string()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//           if (field.minLength) zodCode += `.min(${field.minLength}, { message: "حداقل ${field.minLength} کاراکتر وارد کنید" })`;
//           if (field.maxLength) zodCode += `.max(${field.maxLength}, { message: "حداکثر ${field.maxLength} کاراکتر مجاز است" })`;
//           if (field.validateAs === "email") zodCode += '.email({ message: "ایمیل معتبر وارد کنید" })';
//           if (field.validateAs === "url") zodCode += '.url({ message: "آدرس اینترنتی معتبر وارد کنید" })';
//           if (field.pattern) zodCode += `.regex(new RegExp('${field.pattern}'), { message: "فرمت وارد شده صحیح نیست" })`;
//           break;
        
//         // ... similar cases for other field types as in generateZodSchema
        
//         default:
//           zodCode += 'z.string()';
//           if (field.required) zodCode += '.min(1, { message: "این فیلد الزامی است" })';
//       }
      
//       // Add detailed Uniforms configuration
//       zodCode += `.uniforms({\n`;
//       zodCode += `${indent}${indent}component: "${field.type === "textarea" ? "LongTextField" : field.type === "select" ? "SelectField" : "AutoField"}",\n`;
//       zodCode += `${indent}${indent}label: "${field.label || field.name}",\n`;
//       if (field.placeholder) zodCode += `${indent}${indent}placeholder: "${field.placeholder}",\n`;
//       if (field.description) zodCode += `${indent}${indent}description: "${field.description}",\n`;
//       if (field.defaultValue) zodCode += `${indent}${indent}defaultValue: ${field.type === "number" ? field.defaultValue : `"${field.defaultValue}"`},\n`;
//       if (field.isSearchable) zodCode += `${indent}${indent}isSearchable: true,\n`;
//       if (field.showInList) zodCode += `${indent}${indent}showInList: true,\n`;
//       if (field.clientDisplay?.length) {
//         zodCode += `${indent}${indent}clientDisplay: [${field.clientDisplay.map(c => `"${c}"`).join(', ')}],\n`;
//       }
      
//       // Add layout information for EnhancedDynamicFormGenerator
//       zodCode += `${indent}${indent}layout: {\n`;
//       zodCode += `${indent}${indent}${indent}column: ${fields.indexOf(field) % 2 === 0 ? 1 : 2},\n`;
//       zodCode += `${indent}${indent}${indent}row: ${Math.floor(fields.indexOf(field) / 2) + 1},\n`;
//       zodCode += `${indent}${indent}${indent}width: "100%"\n`;
//       zodCode += `${indent}${indent}}\n`;
      
//       zodCode += `${indent}})`;
      
//       // Make optional if not required
//       if (!field.required && field.type !== "checkbox") {
//         zodCode += '.optional()';
//       }
      
//       zodCode += ',\n';
//     });
    
//     zodCode += '});\n\n';
//     zodCode += `// Create bridge for Uniforms\n`;
//     zodCode += `import { ZodBridge } from 'uniforms-bridge-zod';\n`;
//     zodCode += `const ${formTitle.replace(/\s+/g, '')}Bridge = new ZodBridge(${formTitle.replace(/\s+/g, '')}Schema);\n\n`;
//     zodCode += `export { ${formTitle.replace(/\s+/g, '')}Schema, ${formTitle.replace(/\s+/g, '')}Bridge };\n`;
    
//     return zodCode;
//   }, [fields, formTitle]);

//   // Generate schema based on selected format
//   const generateSchema = useCallback(() => {
//     switch (schemaFormat) {
//       case "json":
//         return JSON.stringify(generateJsonSchema(), null, 2);
//       case "zod":
//         return generateZodSchema();
//       case "uniforms":
//         return generateUniformsZodSchema();
//       default:
//         return JSON.stringify(generateJsonSchema(), null, 2);
//     }
//   }, [schemaFormat, generateJsonSchema, generateZodSchema, generateUniformsZodSchema]);

//   // Handle schema export
//   const handleExportSchema = () => {
//     const schema = generateSchema();
//     setGeneratedSchema(schema);
//     setShowCodeDialog(true);
    
//     if (onSchemaExport) {
//       onSchemaExport(schema, schemaFormat);
//     }
//   };

//   // Copy schema to clipboard
//   const handleCopySchema = () => {
//     navigator.clipboard.writeText(generatedSchema);
//     alert("کد اسکیما در کلیپ‌بورد کپی شد");
//   };

//   // Handle preview
//   const handlePreview = () => {
//     if (onPreview) {
//       onPreview(fields, formTitle, formDescription);
//     }
//   };

//   // Handle accordion change
//   const handleAccordionChange = (panel) => (_, isExpanded) => {
//     setExpanded(isExpanded ? panel : null);
//   };

//   // Render options for select/radio fields
//   const renderOptions = () => {
//     if (["select", "multiselect", "radio"].includes(currentField.type)) {
//       return (
//         <TextField
//           fullWidth
//           label="گزینه‌ها (جدا شده با ویرگول)"
//           variant="outlined"
//           margin="normal"
//           value={currentField.options?.join(",") || ""}
//           onChange={(e) => handleOptionsChange(e.target.value)}
//           placeholder="گزینه 1, گزینه 2, گزینه 3"
//         />
//       );
//     }
//     return null;
//   };

//   // Render validation settings
//   const renderValidation = () => {
//     switch (currentField.type) {
//       case "text":
//       case "password":
//       case "textarea":
//       case "email":
//       case "url":
//       case "tel":
//         return (
//           <>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   label="حداقل طول"
//                   type="number"
//                   name="minLength"
//                   value={currentField.minLength}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   label="حداکثر طول"
//                   type="number"
//                   name="maxLength"
//                   value={currentField.maxLength}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                 />
//               </Grid>
//             </Grid>
//             <TextField
//               fullWidth
//               label="الگوی اعتبارسنجی (RegEx)"
//               name="pattern"
//               value={currentField.pattern}
//               onChange={handleFieldChange}
//               variant="outlined"
//               margin="normal"
//               placeholder="مثال: ^[A-Za-z0-9]+$"
//             />
//           </>
//         );
      
//       case "number":
//       case "range":
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="حداقل"
//                 type="number"
//                 name="min"
//                 value={currentField.min}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="حداکثر"
//                 type="number"
//                 name="max"
//                 value={currentField.max}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="گام"
//                 type="number"
//                 name="step"
//                 value={currentField.step}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//               />
//             </Grid>
//           </Grid>
//         );
      
//       default:
//         return null;
//     }
//   };

//   // Render client display options
//   const renderClientDisplay = () => (
//     <FormControl fullWidth margin="normal" variant="outlined">
//       <InputLabel id="client-display-label">نمایش در</InputLabel>
//       <Select
//         labelId="client-display-label"
//         multiple
//         value={currentField.clientDisplay || []}
//         onChange={handleClientDisplayChange}
//         input={<OutlinedInput label="نمایش در" />}
//         renderValue={(selected) => (
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//             {selected.map((value) => (
//               <Chip key={value} label={clientOptions.find(opt => opt.value === value)?.label || value} />
//             ))}
//           </Box>
//         )}
//       >
//         {clientOptions.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             <Checkbox checked={(currentField.clientDisplay || []).indexOf(option.value) > -1} />
//             <ListItemText primary={option.label} />
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );

//   return (
//     <div dir="rtl" className="w-full">
//       {/* Form title and actions */}
//       <Paper className="p-6 mb-6">
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={5}>
//             <TextField
//               fullWidth
//               label="عنوان فرم"
//               value={formTitle}
//               onChange={(e) => setFormTitle(e.target.value)}
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12} md={7}>
//             <TextField
//               fullWidth
//               label="توضیحات فرم"
//               value={formDescription}
//               onChange={(e) => setFormDescription(e.target.value)}
//               variant="outlined"
//             />
//           </Grid>
//         </Grid>
        
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//           <Box>
//             <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
//               <InputLabel>فرمت خروجی</InputLabel>
//               <Select
//                 value={schemaFormat}
//                 onChange={(e) => setSchemaFormat(e.target.value)}
//                 label="فرمت خروجی"
//               >
//                 <MenuItem value="json">JSON Schema</MenuItem>
//                 <MenuItem value="zod">Zod Schema</MenuItem>
//                 <MenuItem value="uniforms">Uniforms Zod</MenuItem>
//               </Select>
//             </FormControl>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<CodeIcon />}
//               onClick={handleExportSchema}
//               sx={{ mr: 1 }}
//             >
//               تولید اسکیما
//             </Button>
//             <Button
//               variant="outlined"
//               color="primary"
//               startIcon={<PreviewIcon />}
//               onClick={handlePreview}
//             >
//               پیش‌نمایش
//             </Button>
//           </Box>
          
//           <Button 
//             variant="outlined" 
//             color="error" 
//             onClick={handleReset}
//           >
//             پاک کردن همه
//           </Button>
//         </Box>
//       </Paper>

//       {/* Main content */}
//       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
//         {/* Left panel: Field list */}
//         <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
//           <Typography variant="h6" gutterBottom>
//             فیلدهای فرم
//           </Typography>
//           <Typography variant="body2" color="textSecondary" gutterBottom>
//             برای تغییر ترتیب، فیلدها را بکشید و جابجا کنید.
//           </Typography>
          
//           <Divider sx={{ my: 2 }} />
          
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="fields-list">
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps}>
//                   {fields.length === 0 ? (
//                     <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
//                       <Typography>
//                         هیچ فیلدی تعریف نشده است. از پنل سمت راست فیلد جدیدی ایجاد کنید.
//                       </Typography>
//                     </Box>
//                   ) : (
//                     fields.map((field, index) => (
//                       <Draggable key={field.id} draggableId={field.id} index={index}>
//                         {(provided, snapshot) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             className={`mb-2 border p-2 rounded ${
//                               snapshot.isDragging ? 'border-primary' : 'border-gray-300'
//                             } ${editingIndex === index ? 'border-secondary border-2' : ''}`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center">
//                                 <div
//                                   {...provided.dragHandleProps}
//                                   className="cursor-move mr-2 p-1"
//                                 >
//                                   <DragIndicatorIcon color="action" />
//                                 </div>
//                                 <div>
//                                   <Typography variant="subtitle1" className="font-medium">
//                                     {field.label || field.name}
//                                     {field.required && <span className="text-red-500 mr-1">*</span>}
//                                   </Typography>
//                                   <Typography variant="caption" color="textSecondary">
//                                     {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type} | {field.name}
//                                   </Typography>
//                                 </div>
//                               </div>
                              
//                               <div>
//                                 <Tooltip title="ویرایش فیلد">
//                                   <IconButton 
//                                     size="small" 
//                                     onClick={() => handleEditField(index)}
//                                     color={editingIndex === index ? "secondary" : "default"}
//                                   >
//                                     <EditIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="حذف فیلد">
//                                   <IconButton 
//                                     size="small" 
//                                     onClick={() => handleDeleteField(index)}
//                                     color="error"
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                               </div>
//                             </div>
                            
//                             {field.description && (
//                               <Typography variant="caption" color="textSecondary" className="mt-1 block">
//                                 {field.description}
//                               </Typography>
//                             )}
                            
//                             <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                               {field.isSearchable && <Chip size="small" label="قابل جستجو" variant="outlined" />}
//                               {field.showInList && <Chip size="small" label="نمایش در لیست" variant="outlined" />}
//                               {field.clientDisplay?.map(client => (
//                                 <Chip 
//                                   key={client} 
//                                   size="small" 
//                                   label={clientOptions.find(opt => opt.value === client)?.label || client} 
//                                   variant="outlined"
//                                 />
//                               ))}
//                             </Box>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))
//                   )}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </Paper>

//         {/* Right panel: Field editor */}
//         <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
//           <Tabs value={activeTab} onChange={handleTabChange} centered>
//             <Tab label="ایجاد/ویرایش فیلد" />
//             <Tab label="تنظیمات پیشرفته" />
//           </Tabs>
          
//           <Box sx={{ mt: 3 }}>
//             {activeTab === 0 ? (
//               // Basic field settings
//               <>
//                 <Typography variant="subtitle1" gutterBottom>
//                   {editingIndex !== null ? "ویرایش فیلد" : "افزودن فیلد جدید"}
//                 </Typography>
                
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="نام فیلد (به انگلیسی، بدون فاصله)"
//                       name="name"
//                       value={currentField.name}
//                       onChange={handleFieldChange}
//                       variant="outlined"
//                       margin="normal"
//                       required
//                       placeholder="firstName"
//                       helperText="نام فیلد برای استفاده در کد (camelCase)"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="عنوان فیلد (برای نمایش)"
//                       name="label"
//                       value={currentField.label}
//                       onChange={handleFieldChange}
//                       variant="outlined"
//                       margin="normal"
//                       placeholder="نام"
//                       helperText="عنوان قابل نمایش برای کاربر"
//                     />
//                   </Grid>
//                 </Grid>
                
//                 <FormControl fullWidth margin="normal" variant="outlined">
//                   <InputLabel id="field-type-label">نوع فیلد</InputLabel>
//                   <Select
//                     labelId="field-type-label"
//                     name="type"
//                     value={currentField.type}
//                     onChange={handleFieldChange}
//                     label="نوع فیلد"
//                   >
//                     {FIELD_TYPES.map((type) => (
//                       <MenuItem key={type.value} value={type.value}>
//                         {type.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
                
//                 <TextField
//                   fullWidth
//                   label="توضیحات فیلد"
//                   name="description"
//                   value={currentField.description}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   placeholder="توضیحات اضافی برای راهنمایی کاربر..."
//                 />
                
//                 <TextField
//                   fullWidth
//                   label="متن راهنما (Placeholder)"
//                   name="placeholder"
//                   value={currentField.placeholder}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   placeholder="مثال: نام خود را وارد کنید"
//                 />
                
//                 <TextField
//                   fullWidth
//                   label="مقدار پیش‌فرض"
//                   name="defaultValue"
//                   value={currentField.defaultValue}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                 />
                
//                 {renderOptions()}
                
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={currentField.required}
//                       onChange={handleFieldChange}
//                       name="required"
//                     />
//                   }
//                   label="ضروری"
//                 />
//               </>
//             ) : (
//               // Advanced field settings
//               <>
//                 <Accordion
//                   expanded={expanded === 'validation'}
//                   onChange={handleAccordionChange('validation')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>تنظیمات اعتبارسنجی</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {renderValidation()}
                    
//                     {["text", "textarea", "email", "url", "tel"].includes(currentField.type) && (
//                       <FormControl fullWidth margin="normal" variant="outlined">
//                         <InputLabel id="validate-as-label">اعتبارسنجی به عنوان</InputLabel>
//                         <Select
//                           labelId="validate-as-label"
//                           name="validateAs"
//                           value={currentField.validateAs}
//                           onChange={handleFieldChange}
//                           label="اعتبارسنجی به عنوان"
//                         >
//                           <MenuItem value="">بدون اعتبارسنجی خاص</MenuItem>
//                           <MenuItem value="email">ایمیل</MenuItem>
//                           <MenuItem value="url">آدرس اینترنتی</MenuItem>
//                           <MenuItem value="phone">شماره تلفن</MenuItem>
//                         </Select>
//                       </FormControl>
//                     )}
//                   </AccordionDetails>
//                 </Accordion>
                
//                 <Accordion
//                   expanded={expanded === 'display'}
//                   onChange={handleAccordionChange('display')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>تنظیمات نمایش</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {renderClientDisplay()}
                    
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={currentField.isSearchable}
//                           onChange={handleFieldChange}
//                           name="isSearchable"
//                         />
//                       }
//                       label="قابل جستجو در ElasticSearch"
//                     />
                    
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={currentField.showInList}
//                           onChange={handleFieldChange}
//                           name="showInList"
//                         />
//                       }
//                       label="نمایش در لیست سرویس‌ها"
//                     />
//                   </AccordionDetails>
//                 </Accordion>
                
//                 <Accordion
//                   expanded={expanded === 'conditional'}
//                   onChange={handleAccordionChange('conditional')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>نمایش شرطی</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <FormControl fullWidth margin="normal" variant="outlined">
//                       <InputLabel id="depends-on-label">وابسته به فیلد</InputLabel>
//                       <Select
//                         labelId="depends-on-label"
//                         name="depends"
//                         value={currentField.depends || ""}
//                         onChange={handleFieldChange}
//                         label="وابسته به فیلد"
//                       >
//                         <MenuItem value="">بدون وابستگی</MenuItem>
//                         {fields
//                           .filter(f => f.id !== currentField.id)
//                           .map((field) => (
//                             <MenuItem key={field.id} value={field.name}>
//                               {field.label || field.name}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     </FormControl>
                    
//                     {currentField.depends && (
//                       <TextField
//                         fullWidth
//                         label="شرط نمایش"
//                         name="displayCondition"
//                         value={currentField.displayCondition || ""}
//                         onChange={handleFieldChange}
//                         variant="outlined"
//                         margin="normal"
//                         placeholder="مقدار مورد نظر برای نمایش"
//                         helperText="فیلد زمانی نمایش داده می‌شود که فیلد وابسته دارای این مقدار باشد"
//                       />
//                     )}
//                   </AccordionDetails>
//                 </Accordion>
//               </>
//             )}
            
//             <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={editingIndex !== null ? <EditIcon /> : <AddIcon />}
//                 onClick={handleAddOrUpdateField}
//               >
//                 {editingIndex !== null ? "بروزرسانی فیلد" : "افزودن فیلد"}
//               </Button>
              
//               {editingIndex !== null && (
//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     setEditingIndex(null);
//                     setCurrentField(createEmptyField());
//                   }}
//                 >
//                   لغو ویرایش
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
      
//       {/* Schema code dialog */}
//       <Dialog
//         open={showCodeDialog}
//         onClose={() => setShowCodeDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {schemaFormat === "json" ? "JSON Schema" : 
//            schemaFormat === "zod" ? "Zod Schema" : "Uniforms Zod Schema"}
//         </DialogTitle>
//         <DialogContent>
//           <Paper 
//             elevation={0} 
//             style={{ 
//               padding: 16, 
//               backgroundColor: "#f5f5f5", 
//               maxHeight: "70vh", 
//               overflow: "auto",
//               direction: "ltr",
//               fontFamily: "monospace"
//             }}
//           >
//             <pre>{generatedSchema}</pre>
//           </Paper>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCopySchema} color="primary">
//             کپی کد
//           </Button>
//           <Button onClick={() => setShowCodeDialog(false)} color="primary">
//             بستن
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EnhancedFormBuilder;


////BEST VERSION////
// src/app/shared-components/form-builder/EnhancedFormBuilder.jsx
// import React, { useState, useCallback, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Switch,
//   FormControlLabel,
//   Button,
//   IconButton,
//   Typography,
//   Divider,
//   Paper,
//   Tabs,
//   Tab,
//   Box,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
//   OutlinedInput,
//   Checkbox,
//   ListItemText,
//   Radio,
//   RadioGroup,
//   FormLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
//   Grid
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import PreviewIcon from "@mui/icons-material/Preview";
// import CodeIcon from "@mui/icons-material/Code";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import SaveIcon from "@mui/icons-material/Save";
// import LanguageIcon from "@mui/icons-material/Language";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// import FormPreview from "./FormPreview";
// import { 
//   generateZodSchemaString, 
//   generateJsonSchemaString, 
//   generateUniformsZodSchemaString,
//   generateJsonSchema,
//   buildZodSchema
// } from "./SchemaGenerator";
// import { z } from 'zod';

// // Field type options
// const FIELD_TYPES = [
//   { value: "text", label: "متن" },
//   { value: "email", label: "ایمیل" },
//   { value: "password", label: "رمز عبور" },
//   { value: "number", label: "عدد" },
//   { value: "tel", label: "تلفن" },
//   { value: "url", label: "آدرس اینترنتی" },
//   { value: "textarea", label: "متن چند خطی" },
//   { value: "select", label: "انتخاب از لیست" },
//   { value: "multiselect", label: "انتخاب چندتایی" },
//   { value: "checkbox", label: "چک باکس" },
//   { value: "radio", label: "دکمه رادیویی" },
//   { value: "date", label: "تاریخ" },
//   { value: "time", label: "زمان" },
//   { value: "datetime-local", label: "تاریخ و زمان" },
//   { value: "range", label: "محدوده" },
//   { value: "color", label: "رنگ" },
//   { value: "file", label: "فایل" },
//   { value: "hidden", label: "مخفی" },
//   { value: "object", label: "آبجکت (گروه)" },
//   { value: "array", label: "آرایه (لیست)" },
// ];

// // Client options for form rendering
// const CLIENT_OPTIONS = [
//   { value: "ADMIN_PANEL", label: "پنل ادمین" },
//   { value: "USER_PANEL", label: "پنل کاربری" },
//   { value: "MAIN_WEBSITE", label: "وب سایت اصلی" },
//   { value: "API", label: "API" },
// ];

// // Create a new empty field
// const createEmptyField = () => ({
//   id: Date.now().toString(),
//   name: "",
//   label: "",
//   type: "text",
//   required: false,
//   description: "",
//   placeholder: "",
//   defaultValue: "",
//   minLength: "",
//   maxLength: "",
//   min: "",
//   max: "",
//   step: "",
//   pattern: "",
//   options: [],
//   multiple: false,
//   validateAs: "",
//   properties: {}, // For object types
//   items: {}, // For array types
//   isSearchable: false, // For elasticsearch indexing
//   showInList: false, // Display in service list
//   depends: "", // Field dependencies
//   displayCondition: "",
//   clientDisplay: ["ADMIN_PANEL", "USER_PANEL"], // Where this field should appear
//   column: 12, // Default to full width (12 columns in grid)
// });

// // Helper to deep clone an object
// const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// // Helper to reorder fields after drag and drop
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

// const EnhancedFormBuilder = ({
//   initialFields = [],
//   onChange,
//   onSchemaExport,
//   onPreview,
//   clientOptions = CLIENT_OPTIONS
// }) => {
//   // State
//   const [fields, setFields] = useState([]);
//   const [currentField, setCurrentField] = useState(createEmptyField());
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [previewTab, setPreviewTab] = useState(0);
//   const [formTitle, setFormTitle] = useState("فرم سرویس");
//   const [formDescription, setFormDescription] = useState("");
//   const [schemaFormat, setSchemaFormat] = useState("json"); // 'json', 'zod', or 'uniforms'
//   const [showCodeDialog, setShowCodeDialog] = useState(false);
//   const [showPreviewDialog, setShowPreviewDialog] = useState(false);
//   const [generatedSchema, setGeneratedSchema] = useState("");
//   const [jsonSchema, setJsonSchema] = useState(null);
//   const [zodSchema, setZodSchema] = useState(null);
//   const [expanded, setExpanded] = useState(null);
//   const [layoutEnabled, setLayoutEnabled] = useState(false);

//   // Load initial fields
//   useEffect(() => {
//     if (initialFields && initialFields.length > 0) {
//       setFields(initialFields);
//     }
//   }, [initialFields]);

//   // Update schemas when fields change
//   useEffect(() => {
//     try {
//       // Generate JSON schema
//       const newJsonSchema = generateJsonSchema(fields, formTitle, formDescription);
//       setJsonSchema(newJsonSchema);
      
//       // Try to build Zod schema
//       try {
//         const newZodSchema = buildZodSchema(fields);
//         setZodSchema(newZodSchema);
//       } catch (error) {
//         console.error('Error building Zod schema:', error);
//         setZodSchema(null);
//       }
//     } catch (error) {
//       console.error('Error generating schemas:', error);
//     }
//   }, [fields, formTitle, formDescription]);

//   // Handle field changes
//   const handleFieldChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === "checkbox") {
//       setCurrentField((prev) => ({ ...prev, [name]: checked }));
//     } else if (name === "type" && value !== currentField.type) {
//       // Reset specific properties when changing field type
//       let updatedField = { ...currentField, type: value };
      
//       if (value === "select" || value === "multiselect" || value === "radio") {
//         updatedField.options = currentField.options.length ? currentField.options : ["گزینه 1"];
//       } else {
//         delete updatedField.options;
//       }
      
//       if (value === "object") {
//         updatedField.properties = {};
//       }
      
//       if (value === "array") {
//         updatedField.items = { type: "text" };
//       }
      
//       setCurrentField(updatedField);
//     } else {
//       setCurrentField((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle options change for select/radio fields
//   const handleOptionsChange = (value) => {
//     const options = value
//       .split(",")
//       .map((opt) => opt.trim())
//       .filter((opt) => opt);
//     setCurrentField((prev) => ({ ...prev, options }));
//   };

//   // Handle client display options change
//   const handleClientDisplayChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setCurrentField((prev) => ({
//       ...prev,
//       clientDisplay: typeof value === 'string' ? value.split(',') : value,
//     }));
//   };

//   // Handle column width change
//   const handleColumnChange = (value) => {
//     const column = parseInt(value, 10);
//     setCurrentField(prev => ({
//       ...prev,
//       column: isNaN(column) ? 12 : Math.min(Math.max(column, 1), 12)
//     }));
//   };

//   // Add or update field
//   const handleAddOrUpdateField = () => {
//     if (!currentField.name.trim()) {
//       alert("لطفاً نام فیلد را وارد کنید");
//       return;
//     }

//     // Ensure name is in proper format (camelCase)
//     const fieldName = currentField.name
//       .trim()
//       .replace(/\s+/g, '_')
//       .replace(/[^a-zA-Z0-9_]/g, '');
    
//     // Check for duplicate names
//     const duplicateName = fields.find(
//       (f, idx) => f.name === fieldName && idx !== editingIndex
//     );
    
//     if (duplicateName) {
//       alert(`فیلدی با نام "${fieldName}" قبلاً وجود دارد`);
//       return;
//     }

//     const updatedField = { ...currentField, name: fieldName };
    
//     if (editingIndex !== null) {
//       // Update existing field
//       const updatedFields = [...fields];
//       updatedFields[editingIndex] = updatedField;
//       setFields(updatedFields);
//       setEditingIndex(null);
//     } else {
//       // Add new field
//       setFields((prev) => [...prev, updatedField]);
//     }
    
//     // Reset current field
//     setCurrentField(createEmptyField());
    
//     // Notify parent component
//     if (onChange) {
//       onChange(editingIndex !== null 
//         ? [...fields.slice(0, editingIndex), updatedField, ...fields.slice(editingIndex + 1)]
//         : [...fields, updatedField]);
//     }
//   };

//   // Edit existing field
//   const handleEditField = (index) => {
//     setCurrentField(deepClone(fields[index]));
//     setEditingIndex(index);
//     setActiveTab(0); // Switch to the field editor tab
//   };

//   // Delete field
//   const handleDeleteField = (index) => {
//     if (window.confirm("آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟")) {
//       const updatedFields = fields.filter((_, i) => i !== index);
//       setFields(updatedFields);
      
//       if (editingIndex === index) {
//         setEditingIndex(null);
//         setCurrentField(createEmptyField());
//       } else if (editingIndex !== null && editingIndex > index) {
//         setEditingIndex(editingIndex - 1);
//       }
      
//       // Notify parent component
//       if (onChange) {
//         onChange(updatedFields);
//       }
//     }
//   };

//   // Handle drag end
//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
    
//     const reorderedFields = reorder(
//       fields,
//       result.source.index,
//       result.destination.index
//     );
    
//     setFields(reorderedFields);
    
//     // Notify parent component
//     if (onChange) {
//       onChange(reorderedFields);
//     }
//   };

//   // Handle tab change
//   const handleTabChange = (_, newValue) => {
//     setActiveTab(newValue);
//   };

//   // Handle preview tab change
//   const handlePreviewTabChange = (_, newValue) => {
//     setPreviewTab(newValue);
//   };

//   // Reset the form
//   const handleReset = () => {
//     if (window.confirm("آیا مطمئن هستید که می‌خواهید همه فیلدها را حذف کنید؟")) {
//       setFields([]);
//       setCurrentField(createEmptyField());
//       setEditingIndex(null);
//       setActiveTab(0);
      
//       // Notify parent component
//       if (onChange) {
//         onChange([]);
//       }
//     }
//   };

//   // Generate schema
//   const generateSchema = useCallback(() => {
//     switch (schemaFormat) {
//       case "json":
//         return generateJsonSchemaString(fields, formTitle, formDescription);
//       case "zod":
//         return generateZodSchemaString(fields, formTitle);
//       case "uniforms":
//         return generateUniformsZodSchemaString(fields, formTitle);
//       default:
//         return generateJsonSchemaString(fields, formTitle, formDescription);
//     }
//   }, [schemaFormat, fields, formTitle, formDescription]);

//   // Handle schema export
//   const handleExportSchema = () => {
//     const schema = generateSchema();
//     setGeneratedSchema(schema);
//     setShowCodeDialog(true);
    
//     if (onSchemaExport) {
//       onSchemaExport(schema, schemaFormat);
//     }
//   };

//   // Copy schema to clipboard
//   const handleCopySchema = () => {
//     navigator.clipboard.writeText(generatedSchema);
//     alert("کد اسکیما در کلیپ‌بورد کپی شد");
//   };

//   // Show preview dialog
//   const handleShowPreview = () => {
//     setShowPreviewDialog(true);
    
//     if (onPreview) {
//       onPreview(fields, formTitle, formDescription);
//     }
//   };

//   // Handle accordion change
//   const handleAccordionChange = (panel) => (_, isExpanded) => {
//     setExpanded(isExpanded ? panel : null);
//   };

//   // Render options for select/radio fields
//   const renderOptions = () => {
//     if (["select", "multiselect", "radio"].includes(currentField.type)) {
//       return (
//         <TextField
//           fullWidth
//           label="گزینه‌ها (جدا شده با ویرگول)"
//           variant="outlined"
//           margin="normal"
//           value={currentField.options?.join(",") || ""}
//           onChange={(e) => handleOptionsChange(e.target.value)}
//           placeholder="گزینه 1, گزینه 2, گزینه 3"
//         />
//       );
//     }
//     return null;
//   };

//   // Render validation settings
//   const renderValidation = () => {
//     switch (currentField.type) {
//       case "text":
//       case "password":
//       case "textarea":
//       case "email":
//       case "url":
//       case "tel":
//         return (
//           <>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   label="حداقل طول"
//                   type="number"
//                   name="minLength"
//                   value={currentField.minLength}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   inputProps={{ min: 0 }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   label="حداکثر طول"
//                   type="number"
//                   name="maxLength"
//                   value={currentField.maxLength}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   inputProps={{ min: 0 }}
//                 />
//               </Grid>
//             </Grid>
//             <TextField
//               fullWidth
//               label="الگوی اعتبارسنجی (RegEx)"
//               name="pattern"
//               value={currentField.pattern}
//               onChange={handleFieldChange}
//               variant="outlined"
//               margin="normal"
//               placeholder="مثال: ^[A-Za-z0-9]+$"
//             />
//           </>
//         );
      
//       case "number":
//       case "range":
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="حداقل"
//                 type="number"
//                 name="min"
//                 value={currentField.min}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="حداکثر"
//                 type="number"
//                 name="max"
//                 value={currentField.max}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="گام"
//                 type="number"
//                 name="step"
//                 value={currentField.step}
//                 onChange={handleFieldChange}
//                 variant="outlined"
//                 margin="normal"
//                 inputProps={{ min: 0, step: 0.1 }}
//               />
//             </Grid>
//           </Grid>
//         );
      
//       default:
//         return null;
//     }
//   };

//   // Render client display options
//   const renderClientDisplay = () => (
//     <FormControl fullWidth margin="normal" variant="outlined">
//       <InputLabel id="client-display-label">نمایش در</InputLabel>
//       <Select
//         labelId="client-display-label"
//         multiple
//         value={currentField.clientDisplay || []}
//         onChange={handleClientDisplayChange}
//         input={<OutlinedInput label="نمایش در" />}
//         renderValue={(selected) => (
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//             {selected.map((value) => (
//               <Chip key={value} label={clientOptions.find(opt => opt.value === value)?.label || value} />
//             ))}
//           </Box>
//         )}
//       >
//         {clientOptions.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             <Checkbox checked={(currentField.clientDisplay || []).indexOf(option.value) > -1} />
//             <ListItemText primary={option.label} />
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );

//   // Render layout settings
//   const renderLayoutSettings = () => {
//     if (!layoutEnabled) return null;
    
//     return (
//       <Box sx={{ mt: 2 }}>
//         <Typography variant="subtitle2" gutterBottom>
//           تنظیمات طرح‌بندی
//         </Typography>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="column-label">عرض ستون</InputLabel>
//           <Select
//             labelId="column-label"
//             name="column"
//             value={currentField.column || 12}
//             onChange={(e) => handleColumnChange(e.target.value)}
//             label="عرض ستون"
//           >
//             <MenuItem value={12}>تمام عرض (12)</MenuItem>
//             <MenuItem value={6}>نیم صفحه (6)</MenuItem>
//             <MenuItem value={4}>یک سوم (4)</MenuItem>
//             <MenuItem value={3}>یک چهارم (3)</MenuItem>
//             <MenuItem value={8}>دو سوم (8)</MenuItem>
//             <MenuItem value={9}>سه چهارم (9)</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//     );
//   };

//   return (
//     <div dir="rtl" className="w-full">
//       {/* Form title and actions */}
//       <Paper className="p-6 mb-6">
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={5}>
//             <TextField
//               fullWidth
//               label="عنوان فرم"
//               value={formTitle}
//               onChange={(e) => setFormTitle(e.target.value)}
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12} md={7}>
//             <TextField
//               fullWidth
//               label="توضیحات فرم"
//               value={formDescription}
//               onChange={(e) => setFormDescription(e.target.value)}
//               variant="outlined"
//             />
//           </Grid>
//         </Grid>
        
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//           <Box>
//             <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
//               <InputLabel>فرمت خروجی</InputLabel>
//               <Select
//                 value={schemaFormat}
//                 onChange={(e) => setSchemaFormat(e.target.value)}
//                 label="فرمت خروجی"
//               >
//                 <MenuItem value="json">JSON Schema</MenuItem>
//                 <MenuItem value="zod">Zod Schema</MenuItem>
//                 <MenuItem value="uniforms">Uniforms Zod</MenuItem>
//               </Select>
//             </FormControl>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<CodeIcon />}
//               onClick={handleExportSchema}
//               sx={{ mr: 1 }}
//             >
//               تولید اسکیما
//             </Button>
//             <Button
//               variant="outlined"
//               color="primary"
//               startIcon={<PreviewIcon />}
//               onClick={handleShowPreview}
//             >
//               پیش‌نمایش
//             </Button>
//           </Box>
          
//           <Box>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={layoutEnabled}
//                   onChange={(e) => setLayoutEnabled(e.target.checked)}
//                 />
//               }
//               label="طرح‌بندی پیشرفته"
//             />
//             <Button 
//               variant="outlined" 
//               color="error" 
//               onClick={handleReset}
//               sx={{ ml: 1 }}
//             >
//               پاک کردن همه
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Main content */}
//       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
//         {/* Left panel: Field list */}
//         <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
//           <Typography variant="h6" gutterBottom>
//             فیلدهای فرم
//           </Typography>
//           <Typography variant="body2" color="textSecondary" gutterBottom>
//             برای تغییر ترتیب، فیلدها را بکشید و جابجا کنید.
//           </Typography>
          
//           <Divider sx={{ my: 2 }} />
          
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="fields-list">
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps}>
//                   {fields.length === 0 ? (
//                     <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
//                       <Typography>
//                         هیچ فیلدی تعریف نشده است. از پنل سمت راست فیلد جدیدی ایجاد کنید.
//                       </Typography>
//                     </Box>
//                   ) : (
//                     fields.map((field, index) => (
//                       <Draggable key={field.id} draggableId={field.id} index={index}>
//                         {(provided, snapshot) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             className={`mb-2 border p-2 rounded ${
//                               snapshot.isDragging ? 'border-primary' : 'border-gray-300'
//                             } ${editingIndex === index ? 'border-secondary border-2' : ''}`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center">
//                                 <div
//                                   {...provided.dragHandleProps}
//                                   className="cursor-move ml-2 p-1"
//                                 >
//                                   <DragIndicatorIcon color="action" />
//                                 </div>
//                                 <div>
//                                   <Typography variant="subtitle1" className="font-medium">
//                                     {field.label || field.name}
//                                     {field.required && <span className="text-red-500 mr-1">*</span>}
//                                   </Typography>
//                                   <Typography variant="caption" color="textSecondary">
//                                     {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type} | {field.name}
//                                     {layoutEnabled && field.column && field.column < 12 && 
//                                       ` | ${field.column}/12 ستون`
//                                     }
//                                   </Typography>
//                                 </div>
//                               </div>
                              
//                               <div>
//                                 <Tooltip title="ویرایش فیلد">
//                                   <IconButton 
//                                     size="small" 
//                                     onClick={() => handleEditField(index)}
//                                     color={editingIndex === index ? "secondary" : "default"}
//                                   >
//                                     <EditIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="حذف فیلد">
//                                   <IconButton 
//                                     size="small" 
//                                     onClick={() => handleDeleteField(index)}
//                                     color="error"
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                               </div>
//                             </div>
                            
//                             {field.description && (
//                               <Typography variant="caption" color="textSecondary" className="mt-1 block">
//                                 {field.description}
//                               </Typography>
//                             )}
                            
//                             <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                               {field.isSearchable && <Chip size="small" label="قابل جستجو" variant="outlined" />}
//                               {field.showInList && <Chip size="small" label="نمایش در لیست" variant="outlined" />}
//                               {field.clientDisplay?.map(client => (
//                                 <Chip 
//                                   key={client} 
//                                   size="small" 
//                                   label={clientOptions.find(opt => opt.value === client)?.label || client} 
//                                   variant="outlined"
//                                 />
//                               ))}
//                             </Box>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))
//                   )}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </Paper>

//         {/* Right panel: Field editor */}
//         <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
//           <Tabs value={activeTab} onChange={handleTabChange} centered>
//             <Tab label="ایجاد/ویرایش فیلد" />
//             <Tab label="تنظیمات پیشرفته" />
//           </Tabs>
          
//           <Box sx={{ mt: 3 }}>
//             {activeTab === 0 ? (
//               // Basic field settings
//               <>
//                 <Typography variant="subtitle1" gutterBottom>
//                   {editingIndex !== null ? "ویرایش فیلد" : "افزودن فیلد جدید"}
//                 </Typography>
                
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="نام فیلد (به انگلیسی، بدون فاصله)"
//                       name="name"
//                       value={currentField.name}
//                       onChange={handleFieldChange}
//                       variant="outlined"
//                       margin="normal"
//                       required
//                       placeholder="firstName"
//                       helperText="نام فیلد برای استفاده در کد (camelCase)"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="عنوان فیلد (برای نمایش)"
//                       name="label"
//                       value={currentField.label}
//                       onChange={handleFieldChange}
//                       variant="outlined"
//                       margin="normal"
//                       placeholder="نام"
//                       helperText="عنوان قابل نمایش برای کاربر"
//                     />
//                   </Grid>
//                 </Grid>
                
//                 <FormControl fullWidth margin="normal" variant="outlined">
//                   <InputLabel id="field-type-label">نوع فیلد</InputLabel>
//                   <Select
//                     labelId="field-type-label"
//                     name="type"
//                     value={currentField.type}
//                     onChange={handleFieldChange}
//                     label="نوع فیلد"
//                   >
//                     {FIELD_TYPES.map((type) => (
//                       <MenuItem key={type.value} value={type.value}>
//                         {type.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
                
//                 <TextField
//                   fullWidth
//                   label="توضیحات فیلد"
//                   name="description"
//                   value={currentField.description}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   placeholder="توضیحات اضافی برای راهنمایی کاربر..."
//                 />
                
//                 <TextField
//                   fullWidth
//                   label="متن راهنما (Placeholder)"
//                   name="placeholder"
//                   value={currentField.placeholder}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                   placeholder="مثال: نام خود را وارد کنید"
//                 />
                
//                 <TextField
//                   fullWidth
//                   label="مقدار پیش‌فرض"
//                   name="defaultValue"
//                   value={currentField.defaultValue}
//                   onChange={handleFieldChange}
//                   variant="outlined"
//                   margin="normal"
//                 />
                
//                 {renderOptions()}
                
//                 {renderLayoutSettings()}
                
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={currentField.required}
//                       onChange={handleFieldChange}
//                       name="required"
//                     />
//                   }
//                   label="ضروری"
//                 />
//               </>
//             ) : (
//               // Advanced field settings
//               <>
//                 <Accordion
//                   expanded={expanded === 'validation'}
//                   onChange={handleAccordionChange('validation')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>تنظیمات اعتبارسنجی</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {renderValidation()}
                    
//                     {["text", "textarea", "email", "url", "tel"].includes(currentField.type) && (
//                       <FormControl fullWidth margin="normal" variant="outlined">
//                         <InputLabel id="validate-as-label">اعتبارسنجی به عنوان</InputLabel>
//                         <Select
//                           labelId="validate-as-label"
//                           name="validateAs"
//                           value={currentField.validateAs}
//                           onChange={handleFieldChange}
//                           label="اعتبارسنجی به عنوان"
//                         >
//                           <MenuItem value="">بدون اعتبارسنجی خاص</MenuItem>
//                           <MenuItem value="email">ایمیل</MenuItem>
//                           <MenuItem value="url">آدرس اینترنتی</MenuItem>
//                           <MenuItem value="phone">شماره تلفن</MenuItem>
//                         </Select>
//                       </FormControl>
//                     )}
//                   </AccordionDetails>
//                 </Accordion>
                
//                 <Accordion
//                   expanded={expanded === 'display'}
//                   onChange={handleAccordionChange('display')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>تنظیمات نمایش</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {renderClientDisplay()}
                    
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={currentField.isSearchable}
//                           onChange={handleFieldChange}
//                           name="isSearchable"
//                         />
//                       }
//                       label="قابل جستجو در ElasticSearch"
//                     />
                    
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={currentField.showInList}
//                           onChange={handleFieldChange}
//                           name="showInList"
//                         />
//                       }
//                       label="نمایش در لیست سرویس‌ها"
//                     />
//                   </AccordionDetails>
//                 </Accordion>
                
//                 <Accordion
//                   expanded={expanded === 'conditional'}
//                   onChange={handleAccordionChange('conditional')}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>نمایش شرطی</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <FormControl fullWidth margin="normal" variant="outlined">
//                       <InputLabel id="depends-on-label">وابسته به فیلد</InputLabel>
//                       <Select
//                         labelId="depends-on-label"
//                         name="depends"
//                         value={currentField.depends || ""}
//                         onChange={handleFieldChange}
//                         label="وابسته به فیلد"
//                       >
//                         <MenuItem value="">بدون وابستگی</MenuItem>
//                         {fields
//                           .filter(f => f.id !== currentField.id)
//                           .map((field) => (
//                             <MenuItem key={field.id} value={field.name}>
//                               {field.label || field.name}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     </FormControl>
                    
//                     {currentField.depends && (
//                       <TextField
//                         fullWidth
//                         label="شرط نمایش"
//                         name="displayCondition"
//                         value={currentField.displayCondition || ""}
//                         onChange={handleFieldChange}
//                         variant="outlined"
//                         margin="normal"
//                         placeholder="مقدار مورد نظر برای نمایش"
//                         helperText="فیلد زمانی نمایش داده می‌شود که فیلد وابسته دارای این مقدار باشد"
//                       />
//                     )}
//                   </AccordionDetails>
//                 </Accordion>
//               </>
//             )}
            
//             <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={editingIndex !== null ? <EditIcon /> : <AddIcon />}
//                 onClick={handleAddOrUpdateField}
//               >
//                 {editingIndex !== null ? "بروزرسانی فیلد" : "افزودن فیلد"}
//               </Button>
              
//               {editingIndex !== null && (
//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     setEditingIndex(null);
//                     setCurrentField(createEmptyField());
//                   }}
//                 >
//                   لغو ویرایش
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
      
//       {/* Schema code dialog */}
//       <Dialog
//         open={showCodeDialog}
//         onClose={() => setShowCodeDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {schemaFormat === "json" ? "JSON Schema" : 
//            schemaFormat === "zod" ? "Zod Schema" : "Uniforms Zod Schema"}
//         </DialogTitle>
//         <DialogContent>
//           <Paper 
//             elevation={0} 
//             style={{ 
//               padding: 16, 
//               backgroundColor: "#f5f5f5", 
//               maxHeight: "70vh", 
//               overflow: "auto",
//               direction: "ltr",
//               fontFamily: "monospace"
//             }}
//           >
//             <pre>{generatedSchema}</pre>
//           </Paper>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCopySchema} color="primary" startIcon={<ContentCopyIcon />}>
//             کپی کد
//           </Button>
//           <Button onClick={() => setShowCodeDialog(false)} color="primary">
//             بستن
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {/* Preview dialog */}
//       <Dialog
//         open={showPreviewDialog}
//         onClose={() => setShowPreviewDialog(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <DialogTitle>
//           پیش‌نمایش فرم
//         </DialogTitle>
//         <DialogContent>
//           <Tabs value={previewTab} onChange={handlePreviewTabChange} centered>
//             <Tab label="فرم تعاملی" />
//             <Tab label="اسکیما" />
//           </Tabs>
          
//           <Box sx={{ mt: 2 }}>
//             {previewTab === 0 ? (
//               <FormPreview 
//                 fields={fields} 
//                 formTitle={formTitle} 
//                 formDescription={formDescription}
//                 schema={zodSchema}
//                 schemaFormat={schemaFormat}
//               />
//             ) : (
//               <Paper 
//                 elevation={0} 
//                 style={{ 
//                   padding: 16, 
//                   backgroundColor: "#f5f5f5", 
//                   maxHeight: "70vh", 
//                   overflow: "auto",
//                   direction: "ltr",
//                   fontFamily: "monospace"
//                 }}
//               >
//                 <Tabs value={schemaFormat === 'json' ? 0 : 1} centered>
//                   <Tab label="JSON Schema" onClick={() => setSchemaFormat('json')} />
//                   <Tab label="Zod Schema" onClick={() => setSchemaFormat('zod')} />
//                 </Tabs>
//                 <pre>{generateSchema()}</pre>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowPreviewDialog(false)} color="primary">
//             بستن
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EnhancedFormBuilder;

// src/app/shared-components/form-builder/EnhancedFormBuilder.jsx
import React, { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Typography,
  Divider,
  Paper,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Radio,
  RadioGroup,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import LanguageIcon from "@mui/icons-material/Language";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import FormPreview from "./FormPreview";
import { 
  generateZodSchemaString, 
  generateJsonSchemaString, 
  generateUniformsZodSchemaString,
  generateJsonSchema,
  buildZodSchema
} from "./SchemaGenerator";
import { z } from 'zod';

// Field type options
const FIELD_TYPES = [
  { value: "text", label: "متن" },
  { value: "email", label: "ایمیل" },
  { value: "password", label: "رمز عبور" },
  { value: "number", label: "عدد" },
  { value: "tel", label: "تلفن" },
  { value: "url", label: "آدرس اینترنتی" },
  { value: "textarea", label: "متن چند خطی" },
  { value: "select", label: "انتخاب از لیست" },
  { value: "multiselect", label: "انتخاب چندتایی" },
  { value: "checkbox", label: "چک باکس" },
  { value: "radio", label: "دکمه رادیویی" },
  { value: "date", label: "تاریخ" },
  { value: "time", label: "زمان" },
  { value: "datetime-local", label: "تاریخ و زمان" },
  { value: "range", label: "محدوده" },
  { value: "color", label: "رنگ" },
  { value: "file", label: "فایل" },
  { value: "hidden", label: "مخفی" },
  { value: "object", label: "آبجکت (گروه)" },
  { value: "array", label: "آرایه (لیست)" },
];

// File accept formats
const FILE_ACCEPT_FORMATS = [
  { value: "image/*", label: "تصویر" },
  { value: "application/pdf", label: "PDF" },
  { value: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Word" },
  { value: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Excel" },
  { value: "audio/*", label: "صوت" },
  { value: "video/*", label: "ویدیو" },
  { value: ".zip,.rar", label: "فایل فشرده" },
  { value: "*", label: "همه فایل‌ها" },
];

// Client options for form rendering
const CLIENT_OPTIONS = [
  { value: "ADMIN_PANEL", label: "پنل ادمین" },
  { value: "USER_PANEL", label: "پنل کاربری" },
  { value: "MAIN_WEBSITE", label: "وب سایت اصلی" },
  { value: "API", label: "API" },
];

// Create a new empty field
const createEmptyField = () => ({
  id: Date.now().toString(),
  name: "",
  label: "",
  type: "text",
  required: false,
  description: "",
  placeholder: "",
  defaultValue: "",
  minLength: "",
  maxLength: "",
  min: "",
  max: "",
  step: "",
  pattern: "",
  options: [],
  multiple: false,
  validateAs: "",
  properties: {}, // For object types
  items: {}, // For array types
  isSearchable: false, // For elasticsearch indexing
  showInList: false, // Display in service list
  depends: "", // Field dependencies
  displayCondition: "",
  clientDisplay: ["ADMIN_PANEL", "USER_PANEL"], // Where this field should appear
  column: 12, // Default to full width (12 columns in grid)
  // File specific properties
  accept: "*",
  maxFiles: 1,
  maxSize: 5 * 1024 * 1024, // 5MB
  fileServiceType: "SERVICE_FILE",
});

// Helper to deep clone an object
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Helper to reorder fields after drag and drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const EnhancedFormBuilder = ({
  initialFields = [],
  onChange,
  onSchemaExport,
  onPreview,
  clientOptions = CLIENT_OPTIONS
}) => {
  // State
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState(createEmptyField());
  const [editingIndex, setEditingIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [previewTab, setPreviewTab] = useState(0);
  const [formTitle, setFormTitle] = useState("فرم سرویس");
  const [formDescription, setFormDescription] = useState("");
  const [schemaFormat, setSchemaFormat] = useState("json"); // 'json', 'zod', or 'uniforms'
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [jsonSchema, setJsonSchema] = useState(null);
  const [zodSchema, setZodSchema] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [layoutEnabled, setLayoutEnabled] = useState(false);

  // Load initial fields
  useEffect(() => {
    if (initialFields && initialFields.length > 0) {
      setFields(initialFields);
    }
  }, [initialFields]);

  // Update schemas when fields change
  useEffect(() => {
    try {
      // Generate JSON schema
      const newJsonSchema = generateJsonSchema(fields, formTitle, formDescription);
      setJsonSchema(newJsonSchema);
      
      // Try to build Zod schema
      try {
        const newZodSchema = buildZodSchema(fields);
        setZodSchema(newZodSchema);
      } catch (error) {
        console.error('Error building Zod schema:', error);
        setZodSchema(null);
      }
    } catch (error) {
      console.error('Error generating schemas:', error);
    }
  }, [fields, formTitle, formDescription]);

  // Handle field changes
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setCurrentField((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "type" && value !== currentField.type) {
      // Reset specific properties when changing field type
      let updatedField = { ...currentField, type: value };
      
      if (value === "select" || value === "multiselect" || value === "radio") {
        updatedField.options = currentField.options.length ? currentField.options : ["گزینه 1"];
      } else {
        delete updatedField.options;
      }
      
      if (value === "object") {
        updatedField.properties = {};
      }
      
      if (value === "array") {
        updatedField.items = { type: "text" };
      }
      
      if (value === "file") {
        updatedField.accept = "*";
        updatedField.maxFiles = 1;
        updatedField.maxSize = 5 * 1024 * 1024; // 5MB
        updatedField.fileServiceType = "SERVICE_FILE";
      }
      
      setCurrentField(updatedField);
    } else {
      setCurrentField((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle options change for select/radio fields
  const handleOptionsChange = (value) => {
    const options = value
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
    setCurrentField((prev) => ({ ...prev, options }));
  };

  // Handle client display options change
  const handleClientDisplayChange = (event) => {
    const {
      target: { value },
    } = event;
    setCurrentField((prev) => ({
      ...prev,
      clientDisplay: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Handle column width change
  const handleColumnChange = (value) => {
    const column = parseInt(value, 10);
    setCurrentField(prev => ({
      ...prev,
      column: isNaN(column) ? 12 : Math.min(Math.max(column, 1), 12)
    }));
  };

  // Handle max file size change
  const handleMaxSizeChange = (value) => {
    const maxSize = parseInt(value, 10) * 1024 * 1024; // Convert MB to bytes
    setCurrentField(prev => ({
      ...prev,
      maxSize: isNaN(maxSize) ? 5 * 1024 * 1024 : maxSize
    }));
  };

  // Add or update field
  const handleAddOrUpdateField = () => {
    if (!currentField.name.trim()) {
      alert("لطفاً نام فیلد را وارد کنید");
      return;
    }

    // Ensure name is in proper format (camelCase)
    const fieldName = currentField.name
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    
    // Check for duplicate names
    const duplicateName = fields.find(
      (f, idx) => f.name === fieldName && idx !== editingIndex
    );
    
    if (duplicateName) {
      alert(`فیلدی با نام "${fieldName}" قبلاً وجود دارد`);
      return;
    }

    const updatedField = { ...currentField, name: fieldName };
    
    if (editingIndex !== null) {
      // Update existing field
      const updatedFields = [...fields];
      updatedFields[editingIndex] = updatedField;
      setFields(updatedFields);
      setEditingIndex(null);
    } else {
      // Add new field
      setFields((prev) => [...prev, updatedField]);
    }
    
    // Reset current field
    setCurrentField(createEmptyField());
    
    // Notify parent component
    if (onChange) {
      onChange(editingIndex !== null 
        ? [...fields.slice(0, editingIndex), updatedField, ...fields.slice(editingIndex + 1)]
        : [...fields, updatedField]);
    }
  };

  // Edit existing field
  const handleEditField = (index) => {
    setCurrentField(deepClone(fields[index]));
    setEditingIndex(index);
    setActiveTab(0); // Switch to the field editor tab
  };

  // Delete field
  const handleDeleteField = (index) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟")) {
      const updatedFields = fields.filter((_, i) => i !== index);
      setFields(updatedFields);
      
      if (editingIndex === index) {
        setEditingIndex(null);
        setCurrentField(createEmptyField());
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
      
      // Notify parent component
      if (onChange) {
        onChange(updatedFields);
      }
    }
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedFields = reorder(
      fields,
      result.source.index,
      result.destination.index
    );
    
    setFields(reorderedFields);
    
    // Notify parent component
    if (onChange) {
      onChange(reorderedFields);
    }
  };

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Handle preview tab change
  const handlePreviewTabChange = (_, newValue) => {
    setPreviewTab(newValue);
  };

  // Reset the form
  const handleReset = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید همه فیلدها را حذف کنید؟")) {
      setFields([]);
      setCurrentField(createEmptyField());
      setEditingIndex(null);
      setActiveTab(0);
      
      // Notify parent component
      if (onChange) {
        onChange([]);
      }
    }
  };

  // Generate schema
  const generateSchema = useCallback(() => {
    switch (schemaFormat) {
      case "json":
        return generateJsonSchemaString(fields, formTitle, formDescription);
      case "zod":
        return generateZodSchemaString(fields, formTitle);
      case "uniforms":
        return generateUniformsZodSchemaString(fields, formTitle);
      default:
        return generateJsonSchemaString(fields, formTitle, formDescription);
    }
  }, [schemaFormat, fields, formTitle, formDescription]);

  // Handle schema export
  const handleExportSchema = () => {
    const schema = generateSchema();
    setGeneratedSchema(schema);
    setShowCodeDialog(true);
    
    if (onSchemaExport) {
      onSchemaExport(schema, schemaFormat);
    }
  };

  // Copy schema to clipboard
  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchema);
    alert("کد اسکیما در کلیپ‌بورد کپی شد");
  };

  // Show preview dialog
  const handleShowPreview = () => {
    setShowPreviewDialog(true);
    
    if (onPreview) {
      onPreview(fields, formTitle, formDescription);
    }
  };

  // Handle accordion change
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Render options for select/radio fields
  const renderOptions = () => {
    if (["select", "multiselect", "radio"].includes(currentField.type)) {
      return (
        <TextField
          fullWidth
          label="گزینه‌ها (جدا شده با ویرگول)"
          variant="outlined"
          margin="normal"
          value={currentField.options?.join(",") || ""}
          onChange={(e) => handleOptionsChange(e.target.value)}
          placeholder="گزینه 1, گزینه 2, گزینه 3"
        />
      );
    }
    return null;
  };

  // Render file-specific settings
  const renderFileSettings = () => {
    if (currentField.type === "file") {
      return (
        <>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="file-accept-label">نوع فایل‌های مجاز</InputLabel>
            <Select
              labelId="file-accept-label"
              name="accept"
              value={currentField.accept || "*"}
              onChange={handleFieldChange}
              label="نوع فایل‌های مجاز"
            >
              {FILE_ACCEPT_FORMATS.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="حداکثر تعداد فایل‌ها"
                type="number"
                name="maxFiles"
                value={currentField.maxFiles || 1}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
                inputProps={{ min: 1 }}
                helperText="برای اجازه آپلود چند فایل، عدد بزرگتر از 1 وارد کنید"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="حداکثر حجم فایل (مگابایت)"
                type="number"
                value={(currentField.maxSize || 5 * 1024 * 1024) / (1024 * 1024)}
                onChange={(e) => handleMaxSizeChange(e.target.value)}
                variant="outlined"
                margin="normal"
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>
          </Grid>
          
          <FormControlLabel
            control={
              <Switch
                checked={currentField.maxFiles > 1}
                onChange={(e) => {
                  setCurrentField(prev => ({
                    ...prev, 
                    maxFiles: e.target.checked ? 5 : 1
                  }));
                }}
                name="multipleFiles"
              />
            }
            label="امکان آپلود چند فایل"
          />
        </>
      );
    }
    return null;
  };

  // Render validation settings
  const renderValidation = () => {
    switch (currentField.type) {
      case "text":
      case "password":
      case "textarea":
      case "email":
      case "url":
      case "tel":
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="حداقل طول"
                  type="number"
                  name="minLength"
                  value={currentField.minLength}
                  onChange={handleFieldChange}
                  variant="outlined"
                  margin="normal"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="حداکثر طول"
                  type="number"
                  name="maxLength"
                  value={currentField.maxLength}
                  onChange={handleFieldChange}
                  variant="outlined"
                  margin="normal"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="الگوی اعتبارسنجی (RegEx)"
              name="pattern"
              value={currentField.pattern}
              onChange={handleFieldChange}
              variant="outlined"
              margin="normal"
              placeholder="مثال: ^[A-Za-z0-9]+$"
            />
          </>
        );
      
      case "number":
      case "range":
        return (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="حداقل"
                type="number"
                name="min"
                value={currentField.min}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="حداکثر"
                type="number"
                name="max"
                value={currentField.max}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="گام"
                type="number"
                name="step"
                value={currentField.step}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          </Grid>
        );
      
      case "file":
        return renderFileSettings();
      
      default:
        return null;
    }
  };

  // Render client display options
  const renderClientDisplay = () => (
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="client-display-label">نمایش در</InputLabel>
      <Select
        labelId="client-display-label"
        multiple
        value={currentField.clientDisplay || []}
        onChange={handleClientDisplayChange}
        input={<OutlinedInput label="نمایش در" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={clientOptions.find(opt => opt.value === value)?.label || value} />
            ))}
          </Box>
        )}
      >
        {clientOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={(currentField.clientDisplay || []).indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Render layout settings
  const renderLayoutSettings = () => {
    if (!layoutEnabled) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          تنظیمات طرح‌بندی
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="column-label">عرض ستون</InputLabel>
          <Select
            labelId="column-label"
            name="column"
            value={currentField.column || 12}
            onChange={(e) => handleColumnChange(e.target.value)}
            label="عرض ستون"
          >
            <MenuItem value={12}>تمام عرض (12)</MenuItem>
            <MenuItem value={6}>نیم صفحه (6)</MenuItem>
            <MenuItem value={4}>یک سوم (4)</MenuItem>
            <MenuItem value={3}>یک چهارم (3)</MenuItem>
            <MenuItem value={8}>دو سوم (8)</MenuItem>
            <MenuItem value={9}>سه چهارم (9)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  };

  return (
    <div dir="rtl" className="w-full">
      {/* Form title and actions */}
      <Paper className="p-6 mb-6">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="عنوان فرم"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              label="توضیحات فرم"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Box>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
              <InputLabel>فرمت خروجی</InputLabel>
              <Select
                value={schemaFormat}
                onChange={(e) => setSchemaFormat(e.target.value)}
                label="فرمت خروجی"
              >
                <MenuItem value="json">JSON Schema</MenuItem>
                <MenuItem value="zod">Zod Schema</MenuItem>
                <MenuItem value="uniforms">Uniforms Zod</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CodeIcon />}
              onClick={handleExportSchema}
              sx={{ mr: 1 }}
            >
              تولید اسکیما
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PreviewIcon />}
              onClick={handleShowPreview}
            >
              پیش‌نمایش
            </Button>
          </Box>
          
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={layoutEnabled}
                  onChange={(e) => setLayoutEnabled(e.target.checked)}
                />
              }
              label="طرح‌بندی پیشرفته"
            />
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleReset}
              sx={{ ml: 1 }}
            >
              پاک کردن همه
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left panel: Field list */}
        <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
          <Typography variant="h6" gutterBottom>
            فیلدهای فرم
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            برای تغییر ترتیب، فیلدها را بکشید و جابجا کنید.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {fields.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                      <Typography>
                        هیچ فیلدی تعریف نشده است. از پنل سمت راست فیلد جدیدی ایجاد کنید.
                      </Typography>
                    </Box>
                  ) : (
                    fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`mb-2 border p-2 rounded ${
                              snapshot.isDragging ? 'border-primary' : 'border-gray-300'
                            } ${editingIndex === index ? 'border-secondary border-2' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move ml-2 p-1"
                                >
                                  <DragIndicatorIcon color="action" />
                                </div>
                                <div>
                                  <Typography variant="subtitle1" className="font-medium">
                                    {field.label || field.name}
                                    {field.required && <span className="text-red-500 mr-1">*</span>}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type} | {field.name}
                                    {field.type === 'file' && field.maxFiles > 1 && 
                                      ` | حداکثر ${field.maxFiles} فایل`
                                    }
                                    {layoutEnabled && field.column && field.column < 12 && 
                                      ` | ${field.column}/12 ستون`
                                    }
                                  </Typography>
                                </div>
                              </div>
                              
                              <div>
                                <Tooltip title="ویرایش فیلد">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditField(index)}
                                    color={editingIndex === index ? "secondary" : "default"}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="حذف فیلد">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteField(index)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                            
                            {field.description && (
                              <Typography variant="caption" color="textSecondary" className="mt-1 block">
                                {field.description}
                              </Typography>
                            )}
                            
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {field.isSearchable && <Chip size="small" label="قابل جستجو" variant="outlined" />}
                              {field.showInList && <Chip size="small" label="نمایش در لیست" variant="outlined" />}
                              {field.type === 'file' && (
                                <Chip 
                                  size="small" 
                                  label={`${field.maxFiles > 1 ? field.maxFiles + ' فایل' : 'تک فایل'}`} 
                                  variant="outlined" 
                                />
                              )}
                              {field.clientDisplay?.map(client => (
                                <Chip 
                                  key={client} 
                                  size="small" 
                                  label={clientOptions.find(opt => opt.value === client)?.label || client} 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>

        {/* Right panel: Field editor */}
        <Paper className="p-4 flex-grow-1" sx={{ width: { xs: '100%', lg: '50%' } }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="ایجاد/ویرایش فیلد" />
            <Tab label="تنظیمات پیشرفته" />
          </Tabs>
          
          <Box sx={{ mt: 3 }}>
            {activeTab === 0 ? (
              // Basic field settings
              <>
                <Typography variant="subtitle1" gutterBottom>
                  {editingIndex !== null ? "ویرایش فیلد" : "افزودن فیلد جدید"}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="نام فیلد (به انگلیسی، بدون فاصله)"
                      name="name"
                      value={currentField.name}
                      onChange={handleFieldChange}
                      variant="outlined"
                      margin="normal"
                      required
                      placeholder="firstName"
                      helperText="نام فیلد برای استفاده در کد (camelCase)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="عنوان فیلد (برای نمایش)"
                      name="label"
                      value={currentField.label}
                      onChange={handleFieldChange}
                      variant="outlined"
                      margin="normal"
                      placeholder="نام"
                      helperText="عنوان قابل نمایش برای کاربر"
                    />
                  </Grid>
                </Grid>
                
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="field-type-label">نوع فیلد</InputLabel>
                  <Select
                    labelId="field-type-label"
                    name="type"
                    value={currentField.type}
                    onChange={handleFieldChange}
                    label="نوع فیلد"
                  >
                    {FIELD_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="توضیحات فیلد"
                  name="description"
                  value={currentField.description}
                  onChange={handleFieldChange}
                  variant="outlined"
                  margin="normal"
                  placeholder="توضیحات اضافی برای راهنمایی کاربر..."
                />
                
                <TextField
                  fullWidth
                  label="متن راهنما (Placeholder)"
                  name="placeholder"
                  value={currentField.placeholder}
                  onChange={handleFieldChange}
                  variant="outlined"
                  margin="normal"
                  placeholder="مثال: نام خود را وارد کنید"
                />
                
                {currentField.type !== 'file' && (
                  <TextField
                    fullWidth
                    label="مقدار پیش‌فرض"
                    name="defaultValue"
                    value={currentField.defaultValue}
                    onChange={handleFieldChange}
                    variant="outlined"
                    margin="normal"
                  />
                )}
                
                {renderOptions()}
                
                {currentField.type === 'file' && renderFileSettings()}
                
                {renderLayoutSettings()}
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentField.required}
                      onChange={handleFieldChange}
                      name="required"
                    />
                  }
                  label="ضروری"
                />
              </>
            ) : (
              // Advanced field settings
              <>
                <Accordion
                  expanded={expanded === 'validation'}
                  onChange={handleAccordionChange('validation')}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>تنظیمات اعتبارسنجی</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {renderValidation()}
                    
                    {["text", "textarea", "email", "url", "tel"].includes(currentField.type) && (
                      <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="validate-as-label">اعتبارسنجی به عنوان</InputLabel>
                        <Select
                          labelId="validate-as-label"
                          name="validateAs"
                          value={currentField.validateAs}
                          onChange={handleFieldChange}
                          label="اعتبارسنجی به عنوان"
                        >
                          <MenuItem value="">بدون اعتبارسنجی خاص</MenuItem>
                          <MenuItem value="email">ایمیل</MenuItem>
                          <MenuItem value="url">آدرس اینترنتی</MenuItem>
                          <MenuItem value="phone">شماره تلفن</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </AccordionDetails>
                </Accordion>
                
                <Accordion
                  expanded={expanded === 'display'}
                  onChange={handleAccordionChange('display')}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>تنظیمات نمایش</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {renderClientDisplay()}
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentField.isSearchable}
                          onChange={handleFieldChange}
                          name="isSearchable"
                        />
                      }
                      label="قابل جستجو در ElasticSearch"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentField.showInList}
                          onChange={handleFieldChange}
                          name="showInList"
                        />
                      }
                      label="نمایش در لیست سرویس‌ها"
                    />
                  </AccordionDetails>
                </Accordion>
                
                <Accordion
                  expanded={expanded === 'conditional'}
                  onChange={handleAccordionChange('conditional')}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>نمایش شرطی</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth margin="normal" variant="outlined">
                      <InputLabel id="depends-on-label">وابسته به فیلد</InputLabel>
                      <Select
                        labelId="depends-on-label"
                        name="depends"
                        value={currentField.depends || ""}
                        onChange={handleFieldChange}
                        label="وابسته به فیلد"
                      >
                        <MenuItem value="">بدون وابستگی</MenuItem>
                        {fields
                          .filter(f => f.id !== currentField.id)
                          .map((field) => (
                            <MenuItem key={field.id} value={field.name}>
                              {field.label || field.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    
                    {currentField.depends && (
                      <TextField
                        fullWidth
                        label="شرط نمایش"
                        name="displayCondition"
                        value={currentField.displayCondition || ""}
                        onChange={handleFieldChange}
                        variant="outlined"
                        margin="normal"
                        placeholder="مقدار مورد نظر برای نمایش"
                        helperText="فیلد زمانی نمایش داده می‌شود که فیلد وابسته دارای این مقدار باشد"
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              </>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={editingIndex !== null ? <EditIcon /> : <AddIcon />}
                onClick={handleAddOrUpdateField}
              >
                {editingIndex !== null ? "بروزرسانی فیلد" : "افزودن فیلد"}
              </Button>
              
              {editingIndex !== null && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingIndex(null);
                    setCurrentField(createEmptyField());
                  }}
                >
                  لغو ویرایش
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* Schema code dialog */}
      <Dialog
        open={showCodeDialog}
        onClose={() => setShowCodeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {schemaFormat === "json" ? "JSON Schema" : 
           schemaFormat === "zod" ? "Zod Schema" : "Uniforms Zod Schema"}
        </DialogTitle>
        <DialogContent>
          <Paper 
            elevation={0} 
            style={{ 
              padding: 16, 
              backgroundColor: "#f5f5f5", 
              maxHeight: "70vh", 
              overflow: "auto",
              direction: "ltr",
              fontFamily: "monospace"
            }}
          >
            <pre>{generatedSchema}</pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopySchema} color="primary" startIcon={<ContentCopyIcon />}>
            کپی کد
          </Button>
          <Button onClick={() => setShowCodeDialog(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Preview dialog */}
      <Dialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          پیش‌نمایش فرم
        </DialogTitle>
        <DialogContent>
          <Tabs value={previewTab} onChange={handlePreviewTabChange} centered>
            <Tab label="فرم تعاملی" />
            <Tab label="اسکیما" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {previewTab === 0 ? (
              <FormPreview 
                fields={fields} 
                formTitle={formTitle} 
                formDescription={formDescription}
                schema={zodSchema}
                schemaFormat={schemaFormat}
              />
            ) : (
              <Paper 
                elevation={0} 
                style={{ 
                  padding: 16, 
                  backgroundColor: "#f5f5f5", 
                  maxHeight: "70vh", 
                  overflow: "auto",
                  direction: "ltr",
                  fontFamily: "monospace"
                }}
              >
                <Tabs value={schemaFormat === 'json' ? 0 : 1} centered>
                  <Tab label="JSON Schema" onClick={() => setSchemaFormat('json')} />
                  <Tab label="Zod Schema" onClick={() => setSchemaFormat('zod')} />
                </Tabs>
                <pre>{generateSchema()}</pre>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewDialog(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnhancedFormBuilder;