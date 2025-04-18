import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  TextField, 
  Typography,
  InputAdornment,
  Divider,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const VariableSelector = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // In a real app, this would come from Redux
  // For demo purposes, we'll use a static list
  const injectableVariables = [
    { name: 'company.name', description: 'نام شرکت', category: 'شرکت' },
    { name: 'company.id', description: 'شناسه شرکت', category: 'شرکت' },
    { name: 'company.address', description: 'آدرس شرکت', category: 'شرکت' },
    { name: 'company.phone', description: 'شماره تلفن شرکت', category: 'شرکت' },
    { name: 'company.email', description: 'ایمیل شرکت', category: 'شرکت' },
    { name: 'user.fullName', description: 'نام کامل کاربر', category: 'کاربر' },
    { name: 'user.id', description: 'شناسه کاربر', category: 'کاربر' },
    { name: 'user.email', description: 'ایمیل کاربر', category: 'کاربر' },
    { name: 'producer.name', description: 'نام تولیدکننده', category: 'تولیدکننده' },
    { name: 'producer.id', description: 'شناسه تولیدکننده', category: 'تولیدکننده' },
    { name: 'producer.products', description: 'محصولات تولیدکننده', category: 'تولیدکننده' },
  ];
  
  const handleCategoryToggle = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  
  const filteredVariables = injectableVariables.filter(variable => 
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group variables by category
  const categories = [...new Set(filteredVariables.map(v => v.category))];
  
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <TextField
        fullWidth
        placeholder="جستجوی متغیر..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {filteredVariables.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
          متغیری یافت نشد.
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {categories.map((category) => (
            <React.Fragment key={category}>
              <ListItemButton onClick={() => handleCategoryToggle(category)}>
                <ListItemText primary={category} />
                {expandedCategory === category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
              
              <Collapse in={expandedCategory === category || searchTerm.length > 0} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {filteredVariables
                    .filter(v => v.category === category)
                    .map((variable, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => onSelect(variable)} sx={{ pl: 4 }}>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <code style={{ marginRight: '8px' }}>{`{{${variable.name}}}`}</code>
                                <Chip 
                                  label={variable.category} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            }
                            secondary={variable.description}
                            primaryTypographyProps={{ 
                              component: 'div',
                              sx: { direction: 'ltr', fontFamily: 'monospace' }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default VariableSelector;
// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   Collapse,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Tooltip,
//   Divider,
//   Paper
// } from '@mui/material';
// import {
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Search as SearchIcon,
//   Clear as ClearIcon,
//   Add as AddIcon
// } from '@mui/icons-material';

// const VariableSelector = ({ variables = [], onSelectVariable }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedCategories, setExpandedCategories] = useState({});
  
//   // Group variables by category
//   const groupedVariables = variables.reduce((acc, variable) => {
//     const category = variable.category || 'عمومی';
//     if (!acc[category]) {
//       acc[category] = [];
//     }
//     acc[category].push(variable);
//     return acc;
//   }, {});
  
//   // Handle category toggle
//   const handleToggleCategory = (category) => {
//     setExpandedCategories({
//       ...expandedCategories,
//       [category]: !expandedCategories[category]
//     });
//   };
  
//   // Handle search
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };
  
//   // Clear search
//   const handleClearSearch = () => {
//     setSearchTerm('');
//   };
  
//   // Filter variables based on search term
//   const filteredVariables = Object.keys(groupedVariables).reduce((acc, category) => {
//     const filteredCategoryVariables = groupedVariables[category].filter(variable => 
//       variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (variable.description && variable.description.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
    
//     if (filteredCategoryVariables.length > 0) {
//       acc[category] = filteredCategoryVariables;
//     }
    
//     return acc;
//   }, {});
  
//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <Typography variant="subtitle2" gutterBottom>
//         متغیرهای قابل استفاده
//       </Typography>
      
//       <TextField
//         size="small"
//         placeholder="جستجو..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         fullWidth
//         margin="dense"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon fontSize="small" />
//             </InputAdornment>
//           ),
//           endAdornment: searchTerm && (
//             <InputAdornment position="end">
//               <IconButton
//                 size="small"
//                 onClick={handleClearSearch}
//                 edge="end"
//               >
//                 <ClearIcon fontSize="small" />
//               </IconButton>
//             </InputAdornment>
//           )
//         }}
//       />
      
//       <Box sx={{ mt: 1, flexGrow: 1, overflow: 'auto' }}>
//         {Object.keys(filteredVariables).length > 0 ? (
//           <List dense disablePadding>
//             {Object.keys(filteredVariables).map((category) => (
//               <React.Fragment key={category}>
//                 <ListItemButton
//                   onClick={() => handleToggleCategory(category)}
//                   dense
//                   sx={{ 
//                     bgcolor: 'action.hover',
//                     borderRadius: 1,
//                     mb: 0.5
//                   }}
//                 >
//                   <ListItemText primary={category} />
//                   {expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                 </ListItemButton>
                
//                 <Collapse in={expandedCategories[category] !== false} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding dense>
//                     {filteredVariables[category].map((variable) => (
//                       <ListItem
//                         key={variable.id || variable.name}
//                         disablePadding
//                         secondaryAction={
//                           <Tooltip title="افزودن">
//                             <IconButton 
//                               edge="end" 
//                               size="small"
//                               onClick={() => onSelectVariable(variable)}
//                             >
//                               <AddIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         }
//                       >
//                         <ListItemButton
//                           onClick={() => onSelectVariable(variable)}
//                           dense
//                           sx={{ pl: 4 }}
//                         >
//                           <ListItemText 
//                             primary={variable.name} 
//                             secondary={variable.description}
//                             primaryTypographyProps={{ 
//                               variant: 'body2',
//                               fontFamily: 'monospace',
//                               fontWeight: 'medium'
//                             }}
//                             secondaryTypographyProps={{ 
//                               variant: 'caption',
//                               noWrap: true
//                             }}
//                           />
//                         </ListItemButton>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               </React.Fragment>
//             ))}
//           </List>
//         ) : (
//           <Paper 
//             variant="outlined" 
//             sx={{ 
//               p: 2, 
//               textAlign: 'center',
//               bgcolor: 'background.default'
//             }}
//           >
//             <Typography variant="body2" color="text.secondary">
//               {searchTerm ? 'هیچ متغیری یافت نشد.' : 'هیچ متغیری در دسترس نیست.'}
//             </Typography>
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default VariableSelector;
