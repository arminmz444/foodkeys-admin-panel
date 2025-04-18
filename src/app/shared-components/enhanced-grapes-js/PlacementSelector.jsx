import React from 'react';
import { 
  Box, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper,
  Tooltip
} from '@mui/material';

const PlacementSelector = ({ value, onChange, placements = [] }) => {
  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedPlacement = placements.find(p => p.id === selectedId);
    onChange(selectedPlacement);
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        محل قرارگیری
      </Typography>
      <RadioGroup
        value={value?.id || ''}
        onChange={handleChange}
      >
        {placements.map((placement) => (
          <Paper 
            key={placement.id} 
            variant="outlined" 
            sx={{ 
              mb: 1, 
              p: 1, 
              cursor: 'pointer',
              border: value?.id === placement.id ? '2px solid' : '1px solid',
              borderColor: value?.id === placement.id ? 'primary.main' : 'divider',
            }}
            onClick={() => onChange(placement)}
          >
            <FormControlLabel
              value={placement.id}
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2">{placement.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {placement.description}
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>
        ))}
      </RadioGroup>
    </Box>
  );
};

export default PlacementSelector;
// import React from 'react';
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   ListSubheader,
//   Typography,
//   Box,
//   Chip
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Dashboard as DashboardIcon,
//   Description as DescriptionIcon,
//   Business as BusinessIcon,
//   Person as PersonIcon,
//   Settings as SettingsIcon
// } from '@mui/icons-material';

// const PlacementSelector = ({ value, onChange, placements = [] }) => {
//   // Group placements by type
//   const groupedPlacements = placements.reduce((acc, placement) => {
//     const type = placement.type || 'other';
//     if (!acc[type]) {
//       acc[type] = [];
//     }
//     acc[type].push(placement);
//     return acc;
//   }, {});
  
//   // Get icon based on placement type
//   const getPlacementIcon = (type) => {
//     switch (type) {
//       case 'dashboard':
//         return <DashboardIcon fontSize="small" />;
//       case 'company':
//         return <BusinessIcon fontSize="small" />;
//       case 'producer':
//         return <PersonIcon fontSize="small" />;
//       case 'settings':
//         return <SettingsIcon fontSize="small" />;
//       default:
//         return <DescriptionIcon fontSize="small" />;
//     }
//   };
  
//   // Get translated type name
//   const getTypeName = (type) => {
//     switch (type) {
//       case 'dashboard':
//         return 'داشبورد';
//       case 'company':
//         return 'شرکت';
//       case 'producer':
//         return 'تولیدکننده';
//       case 'settings':
//         return 'تنظیمات';
//       case 'other':
//         return 'سایر';
//       default:
//         return type;
//     }
//   };
  
//   // Handle placement change
//   const handleChange = (event) => {
//     const selectedId = event.target.value;
    
//     if (selectedId === 'new') {
//       onChange({ id: 'new', name: 'صفحه جدید' });
//     } else {
//       const selectedPlacement = placements.find(p => p.id === selectedId);
//       onChange(selectedPlacement);
//     }
//   };
  
//   return (
//     <FormControl fullWidth margin="normal">
//       <InputLabel>محل قرارگیری</InputLabel>
//       <Select
//         value={value?.id || ''}
//         onChange={handleChange}
//         label="محل قرارگیری"
//         renderValue={(selected) => (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {value?.id === 'new' ? (
//               <>
//                 <AddIcon sx={{ mr: 1 }} fontSize="small" />
//                 <Typography>صفحه جدید</Typography>
//               </>
//             ) : (
//               <>
//                 {getPlacementIcon(value?.type)}
//                 <Typography sx={{ ml: 1 }}>{value?.name}</Typography>
//                 {value?.version && (
//                   <Chip 
//                     label={`v${value.version}`} 
//                     size="small" 
//                     sx={{ ml: 1 }} 
//                   />
//                 )}
//               </>
//             )}
//           </Box>
//         )}
//       >
//         <MenuItem value="">
//           <em>انتخاب کنید</em>
//         </MenuItem>
        
//         <MenuItem value="new">
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <AddIcon sx={{ mr: 1 }} fontSize="small" />
//             <Typography>صفحه جدید</Typography>
//           </Box>
//         </MenuItem>
        
//         {Object.keys(groupedPlacements).map((type) => [
//           <ListSubheader key={`header-${type}`}>
//             {getTypeName(type)}
//           </ListSubheader>,
//           ...groupedPlacements[type].map((placement) => (
//             <MenuItem key={placement.id} value={placement.id}>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 {getPlacementIcon(placement.type)}
//                 <Typography sx={{ ml: 1 }}>{placement.name}</Typography>
//                 {placement.version && (
//                   <Chip 
//                     label={`v${placement.version}`} 
//                     size="small" 
//                     sx={{ ml: 1 }} 
//                   />
//                 )}
//               </Box>
//             </MenuItem>
//           ))
//         ])}
//       </Select>
//     </FormControl>
//   );
// };

// export default PlacementSelector;
