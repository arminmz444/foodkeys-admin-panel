// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   CircularProgress, 
//   Alert, 
//   Paper, 
//   Divider, 
//   Tabs, 
//   Tab, 
//   Tooltip,
//   IconButton,
//   Chip
// } from '@mui/material';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { useGetConfigSchemaQuery } from '../store/configManagementApi';
// import { useGetConfigsQuery } from '../store/configManagementApi';
// import { createFormStructure, safeJsonParse } from '../utils/form-utils';
// import CodeEditor from './CodeEditor';
// import DynamicForm from './DynamicForm';

// // Tab panel component
// const TabPanel = ({ children, value, index, ...other }) => {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

// /**
//  * A component to preview a configuration schema
//  */
// const SchemaPreview = ({ schemaId }) => {
//   const [tabValue, setTabValue] = useState(0);
//   const [parsedSchema, setParsedSchema] = useState(null);
//   const [formStructure, setFormStructure] = useState([]);
  
//   // Fetch schema data
//   const { 
//     data: schema, 
//     isLoading, 
//     error 
//   } = useGetConfigSchemaQuery(schemaId, {
//     skip: !schemaId
//   });
  
//   // Fetch configs based on this schema
//   const {
//     data: configsData,
//     isLoading: isLoadingConfigs
//   } = useGetConfigsQuery({
//     pageNumber: 1,
//     pageSize: 10,
//     schemaId
//   }, {
//     skip: !schemaId
//   });
  
//   const configs = configsData?.data || [];
  
//   // Parse schema definition when schema data is loaded
//   useEffect(() => {
//     if (schema?.schemaDefinition) {
//       try {
//         const parsed = safeJsonParse(schema.schemaDefinition);
//         setParsedSchema(parsed);
        
//         // Create form structure from schema
//         const structure = createFormStructure(parsed);
//         setFormStructure(structure);
//       } catch (error) {
//         console.error('Error parsing schema definition:', error);
//       }
//     }
//   }, [schema]);
  
//   const handleChangeTab = (event, newValue) => {
//     setTabValue(newValue);
//   };
  
//   if (isLoading) {
//     return (
//       <Box className="flex justify-center p-24">
//         <CircularProgress />
//       </Box>
//     );
//   }
  
//   if (error) {
//     return (
//       <Alert severity="error">
//         خطا در بارگیری طرحواره: {error.data?.message || 'خطای ناشناخته'}
//       </Alert>
//     );
//   }
  
//   if (!schema) {
//     return (
//       <Alert severity="warning">
//         طرحواره پیدا نشد
//       </Alert>
//     );
//   }
  
//   return (
//     <Box>
//       <Paper className="p-16 mb-24">
//         <Box className="flex justify-between items-start mb-16">
//           <Box>
//             <Typography variant="h6" className="font-bold">
//               {schema.displayName}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               نام کلید: {schema.name}
//             </Typography>
//           </Box>
//           <Chip 
//             label={`${configs.length} پیکربندی`} 
//             color={configs.length ? 'success' : 'default'} 
//             size="small"
//           />
//         </Box>
//       </Paper>
      
//       <Tabs
//         value={tabValue}
//         onChange={handleChangeTab}
//         indicatorColor="primary"
//         textColor="primary"
//         variant="fullWidth"
//         className="mb-24"
//       >
//         <Tab label="پیش‌نمایش فرم" />
//         <Tab label="نمایش طرحواره" />
//         <Tab label="پیکربندی‌ها" />
//       </Tabs>
      
//       <TabPanel value={tabValue} index={0}>
//         {formStructure.length > 0 ? (
//           <DynamicForm
//             schema={schema.schemaDefinition}
//             initialData={{}}
//             onSubmit={(data) => console.log('Form submitted:', data)}
//             isReadOnly
//           />
//         ) : (
//           <Alert severity="info">
//             طرحواره شما فیلدی برای نمایش ندارد
//           </Alert>
//         )}
//       </TabPanel>
      
//       <TabPanel value={tabValue} index={1}>
//         <Box className="mb-16">
//           <Typography variant="subtitle2" className="mb-8">
//             تعریف JSON Schema
//           </Typography>
//           <CodeEditor
//             value={typeof schema.schemaDefinition === 'string' 
//               ? schema.schemaDefinition 
//               : JSON.stringify(schema.schemaDefinition, null, 2)}
//             language="json"
//             height="400px"
//             readOnly
//           />
//         </Box>
//       </TabPanel>
      
//       <TabPanel value={tabValue} index={2}>
//         {isLoadingConfigs ? (
//           <Box className="flex justify-center p-24">
//             <CircularProgress />
//           </Box>
//         ) : configs.length > 0 ? (
//           configs.map((config) => (
//             <Paper key={config.name} className="p-16 mb-16">
//               <Typography variant="subtitle1" className="font-bold">
//                 {config.displayName}
//               </Typography>
//               <Typography variant="caption" color="text.secondary" className="mb-8 block">
//                 نام کلید: {config.name}
//               </Typography>
//               <Divider className="my-16" />
//               <Box className="mb-16">
//                 <Typography variant="subtitle2" className="mb-8">
//                   داده‌های پیکربندی
//                 </Typography>
//                 <CodeEditor
//                   value={typeof config.data === 'string' 
//                     ? config.data 
//                     : JSON.stringify(config.data, null, 2)}
//                   language="json"
//                   height="200px"
//                   readOnly
//                 />
//               </Box>
//             </Paper>
//           ))
//         ) : (
//           <Alert severity="info">
//             هیچ پیکربندی‌ای با این طرحواره وجود ندارد
//           </Alert>
//         )}
//       </TabPanel>
//     </Box>
//   );
// };

// export default SchemaPreview;
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper, 
  Divider, 
  Tabs, 
  Tab, 
  Tooltip,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { 
  useGetConfigSchemaQuery,
  useGetConfigsQuery,
  useGetServiceSchemaQuery,
  useGetServicesQuery
} from '../store/configManagementApi';
import { createFormStructure, safeJsonParse } from '../utils/form-utils';
import CodeEditor from './CodeEditor';
import DynamicForm from './DynamicForm';

// Tab panel component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

/**
 * A component to preview a schema (either configuration or service schema)
 */
const SchemaPreview = ({ schemaId, type = 'config' }) => {
  const [tabValue, setTabValue] = useState(0);
  const [parsedSchema, setParsedSchema] = useState(null);
  const [formStructure, setFormStructure] = useState([]);
  
  const isConfig = type === 'config';
  
  // Fetch schema data based on type
  const { 
    data: schema, 
    isLoading: isLoadingSchema, 
    error: schemaError 
  } = isConfig 
    ? useGetConfigSchemaQuery(schemaId, { skip: !schemaId })
    : useGetServiceSchemaQuery(schemaId, { skip: !schemaId });
  
  // Fetch records based on schema
  const {
    data: recordsData,
    isLoading: isLoadingRecords
  } = isConfig
    ? useGetConfigsQuery({
        pageNumber: 1,
        pageSize: 10,
        schemaId
      }, { skip: !schemaId })
    : useGetServicesQuery({
        pageNumber: 1,
        pageSize: 10,
        serviceSchemaId: schemaId
      }, { skip: !schemaId });
  
  const records = recordsData?.data || [];
  
  // Parse schema definition when schema data is loaded
  useEffect(() => {
    if (schema?.schemaDefinition) {
      try {
        const parsed = safeJsonParse(schema.schemaDefinition);
        setParsedSchema(parsed);
        
        // Create form structure from schema
        const structure = createFormStructure(parsed);
        setFormStructure(structure);
      } catch (error) {
        console.error('Error parsing schema definition:', error);
      }
    }
  }, [schema]);
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Get the searchable fields if available (for service schemas)
  const getSearchableFields = () => {
    if (!isConfig && schema?.elasticFields) {
      try {
        // Check if it's a JSON array or a comma-separated string
        if (schema.elasticFields.trim().startsWith('[')) {
          return JSON.parse(schema.elasticFields);
        } else {
          // Assume it's a comma-separated list
          return schema.elasticFields.split(',').map(field => field.trim()).filter(Boolean);
        }
      } catch (error) {
        console.error('Error parsing elastic fields:', error);
        return [];
      }
    }
    return [];
  };
  
  const searchableFields = getSearchableFields();
  
  if (isLoadingSchema) {
    return (
      <Box className="flex justify-center p-24">
        <CircularProgress />
      </Box>
    );
  }
  
  if (schemaError) {
    return (
      <Alert severity="error">
        خطا در بارگیری طرحواره: {schemaError.data?.message || 'خطای ناشناخته'}
      </Alert>
    );
  }
  
  if (!schema) {
    return (
      <Alert severity="warning">
        طرحواره پیدا نشد
      </Alert>
    );
  }
  
  return (
    <Box>
      <Paper className="p-16 mb-24">
        <Box className="flex justify-between items-start mb-16">
          <Box>
            <Typography variant="h6" className="font-bold">
              {schema.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              نام کلید: {schema.name}
            </Typography>
          </Box>
          <Chip 
            label={`${records.length} ${isConfig ? 'پیکربندی' : 'سرویس'}`} 
            color={records.length ? 'success' : 'default'} 
            size="small"
          />
        </Box>
        
        {!isConfig && searchableFields.length > 0 && (
          <Box className="mt-16">
            <Typography variant="subtitle2" className="mb-8">
              فیلدهای قابل جستجو:
            </Typography>
            <Box className="flex flex-wrap gap-4">
              {searchableFields.map((field) => (
                <Chip key={field} label={field} size="small" color="info" />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        className="mb-24"
      >
        <Tab label="پیش‌نمایش فرم" />
        <Tab label="نمایش طرحواره" />
        <Tab label={isConfig ? "پیکربندی‌ها" : "سرویس‌ها"} />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        {formStructure.length > 0 ? (
          <DynamicForm
            schema={schema.schemaDefinition}
            initialData={{}}
            onSubmit={(data) => console.log('Form submitted:', data)}
            isReadOnly
          />
        ) : (
          <Alert severity="info">
            طرحواره شما فیلدی برای نمایش ندارد
          </Alert>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Box className="mb-16">
          <Typography variant="subtitle2" className="mb-8">
            تعریف JSON Schema
          </Typography>
          <CodeEditor
            value={typeof schema.schemaDefinition === 'string' 
              ? schema.schemaDefinition 
              : JSON.stringify(schema.schemaDefinition, null, 2)}
            language="json"
            height="400px"
            readOnly
          />
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {isLoadingRecords ? (
          <Box className="flex justify-center p-24">
            <CircularProgress />
          </Box>
        ) : records.length > 0 ? (
          records.map((record) => (
            <Paper key={isConfig ? record.name : record.id} className="p-16 mb-16">
              <Typography variant="subtitle1" className="font-bold">
                {record.displayName || record.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="mb-8 block">
                {isConfig 
                  ? `نام کلید: ${record.name}` 
                  : `شناسه: ${record.id}, وضعیت: ${record.status === 1 ? 'فعال' : 'غیرفعال'}`
                }
              </Typography>
              
              {!isConfig && (
                <Box className="mb-16">
                  <List dense disablePadding>
                    {record.subcategory && (
                      <ListItem disablePadding className="py-4">
                        <ListItemIcon className="min-w-40">
                          <FuseSvgIcon size={20}>heroicons-outline:folder</FuseSvgIcon>
                        </ListItemIcon>
                        <ListItemText 
                          primary="زیردسته" 
                          secondary={record.subcategory.title} 
                        />
                      </ListItem>
                    )}
                    
                    {record.keyWords && (
                      <ListItem disablePadding className="py-4">
                        <ListItemIcon className="min-w-40">
                          <FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
                        </ListItemIcon>
                        <ListItemText 
                          primary="کلمات کلیدی" 
                          secondary={record.keyWords} 
                        />
                      </ListItem>
                    )}
                    
                    {record.visit !== undefined && (
                      <ListItem disablePadding className="py-4">
                        <ListItemIcon className="min-w-40">
                          <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
                        </ListItemIcon>
                        <ListItemText 
                          primary="بازدید" 
                          secondary={record.visit} 
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
              
              <Divider className="my-16" />
              <Box className="mb-16">
                <Typography variant="subtitle2" className="mb-8">
                  داده‌های {isConfig ? 'پیکربندی' : 'سرویس'}
                </Typography>
                <CodeEditor
                  value={typeof record.data === 'string' 
                    ? record.data 
                    : JSON.stringify(record.data, null, 2)}
                  language="json"
                  height="200px"
                  readOnly
                />
              </Box>
            </Paper>
          ))
        ) : (
          <Alert severity="info">
            هیچ {isConfig ? 'پیکربندی‌ای' : 'سرویسی'} با این طرحواره وجود ندارد
          </Alert>
        )}
      </TabPanel>
    </Box>
  );
};

export default SchemaPreview;