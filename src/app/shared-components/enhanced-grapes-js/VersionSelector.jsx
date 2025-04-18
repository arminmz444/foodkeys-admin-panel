import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const VersionSelector = ({ value, onChange, versions = [] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  
  const handleVersionSelect = (version) => {
    onChange(version);
    setDialogOpen(false);
  };
  
  const handleNewVersionSubmit = () => {
    if (!newVersion) return;
    
    onChange(newVersion);
    setDialogOpen(false);
    setNewVersion('');
  };
  
  const incrementVersion = (type) => {
    if (!value) {
      onChange('1.0.0');
      return;
    }
    
    const parts = value.split('.').map(Number);
    if (parts.length !== 3) {
      onChange('1.0.0');
      return;
    }
    
    if (type === 'major') {
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
    } else if (type === 'minor') {
      parts[1]++;
      parts[2] = 0;
    } else if (type === 'patch') {
      parts[2]++;
    }
    
    onChange(parts.join('.'));
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        نسخه
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="1.0.0"
          size="small"
          sx={{ width: 120 }}
        />
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => incrementVersion('patch')}
        >
          +Patch
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => incrementVersion('minor')}
        >
          +Minor
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => incrementVersion('major')}
        >
          +Major
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setDialogOpen(true)}
        >
          تاریخچه
        </Button>
      </Box>
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>تاریخچه نسخه‌ها</DialogTitle>
        <DialogContent>
          {versions.length > 0 ? (
            <List sx={{ minWidth: 250 }}>
              {versions.map((version, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleVersionSelect(version)}>
                    <ListItemText 
                      primary={version} 
                      secondary={`ایجاد شده در ${new Date().toLocaleDateString('fa-IR')}`} 
                    />
                  </ListItem>
                  {index < versions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              نسخه‌ای یافت نشد.
            </Typography>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ایجاد نسخه جدید
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="1.0.0"
                size="small"
                fullWidth
              />
              <Button 
                variant="contained" 
                onClick={handleNewVersionSubmit}
                disabled={!newVersion}
              >
                افزودن
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VersionSelector;
// import React, { useState } from 'react';
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   IconButton,
//   Tooltip,
//   Chip
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon
// } from '@mui/icons-material';

// const VersionSelector = ({ value, onChange, versions = [] }) => {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [customVersion, setCustomVersion] = useState('');
//   const [majorVersion, setMajorVersion] = useState(1);
//   const [minorVersion, setMinorVersion] = useState(0);
//   const [patchVersion, setPatchVersion] = useState(0);
  
//   // Open dialog
//   const handleOpenDialog = () => {
//     // Parse current version
//     if (value) {
//       const parts = value.split('.');
//       if (parts.length === 3) {
//         setMajorVersion(parseInt(parts[0], 10));
//         setMinorVersion(parseInt(parts[1], 10));
//         setPatchVersion(parseInt(parts[2], 10));
//       }
//     }
    
//     setCustomVersion(value || '1.0.0');
//     setDialogOpen(true);
//   };
  
//   // Close dialog
//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };
  
//   // Apply custom version
//   const handleApplyCustomVersion = () => {
//     onChange(customVersion);
//     setDialogOpen(false);
//   };
  
//   // Handle version change
//   const handleVersionChange = (event) => {
//     const selectedVersion = event.target.value;
    
//     if (selectedVersion === 'custom') {
//       handleOpenDialog();
//     } else {
//       onChange(selectedVersion);
//     }
//   };
  
//   // Update semantic version
//   const updateSemanticVersion = () => {
//     const newVersion = `${majorVersion}.${minorVersion}.${patchVersion}`;
//     setCustomVersion(newVersion);
//   };
  
//   // Handle major version change
//   const handleMajorVersionChange = (event) => {
//     const value = parseInt(event.target.value, 10);
//     setMajorVersion(value);
//     updateSemanticVersion();
//   };
  
//   // Handle minor version change
//   const handleMinorVersionChange = (event) => {
//     const value = parseInt(event.target.value, 10);
//     setMinorVersion(value);
//     updateSemanticVersion();
//   };
  
//   // Handle patch version change
//   const handlePatchVersionChange = (event) => {
//     const value = parseInt(event.target.value, 10);
//     setPatchVersion(value);
//     updateSemanticVersion();
//   };
  
//   // Handle custom version change
//   const handleCustomVersionChange = (event) => {
//     setCustomVersion(event.target.value);
//   };
  
//   // Get next version suggestions
//   const getNextVersionSuggestions = () => {
//     if (!value) return [];
    
//     const parts = value.split('.');
//     if (parts.length !== 3) return [];
    
//     const major = parseInt(parts[0], 10);
//     const minor = parseInt(parts[1], 10);
//     const patch = parseInt(parts[2], 10);
    
//     return [
//       { type: 'major', version: `${major + 1}.0.0` },
//       { type: 'minor', version: `${major}.${minor + 1}.0` },
//       { type: 'patch', version: `${major}.${minor}.${patch + 1}` }
//     ];
//   };
  
//   // Get version suggestions
//   const versionSuggestions = getNextVersionSuggestions();
  
//   return (
//     <>
//       <FormControl fullWidth margin="normal">
//         <InputLabel>نسخه</InputLabel>
//         <Select
//           value={value || ''}
//           onChange={handleVersionChange}
//           label="نسخه"
//           endAdornment={
//             <Tooltip title="ویرایش دستی">
//               <IconButton
//                 size="small"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleOpenDialog();
//                 }}
//                 sx={{ mr: 2 }}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           }
//         >
//           {versions.length > 0 ? (
//             <>
//               <MenuItem value="">
//                 <em>انتخاب کنید</em>
//               </MenuItem>
              
//               {versions.map((version) => (
//                 <MenuItem key={version} value={version}>
//                   {version}
//                 </MenuItem>
//               ))}
              
//               <MenuItem value="custom">
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <AddIcon sx={{ mr: 1 }} fontSize="small" />
//                   <Typography>نسخه جدید</Typography>
//                 </Box>
//               </MenuItem>
//             </>
//           ) : (
//             <>
//               <MenuItem value="1.0.0">1.0.0</MenuItem>
              
//               {versionSuggestions.map((suggestion) => (
//                 <MenuItem key={suggestion.type} value={suggestion.version}>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Typography>{suggestion.version}</Typography>
//                     <Chip 
//                       label={suggestion.type === 'major' ? 'تغییر اساسی' : suggestion.type === 'minor' ? 'قابلیت جدید' : 'رفع باگ'} 
//                       size="small" 
//                       color={suggestion.type === 'major' ? 'error' : suggestion.type === 'minor' ? 'primary' : 'success'}
//                       sx={{ ml: 1 }} 
//                     />
//                   </Box>
//                 </MenuItem>
//               ))}
              
//               <MenuItem value="custom">
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <AddIcon sx={{ mr: 1 }} fontSize="small" />
//                   <Typography>نسخه دلخواه</Typography>
//                 </Box>
//               </MenuItem>
//             </>
//           )}
//         </Select>
//       </FormControl>
      
//       <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle>تعیین نسخه</DialogTitle>
//         <DialogContent>
//           <Box sx={{ mb: 3, mt: 1 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               نسخه‌گذاری معنایی (Semantic Versioning)
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <TextField
//                 label="Major"
//                 type="number"
//                 size="small"
//                 value={majorVersion}
//                 onChange={handleMajorVersionChange}
//                 inputProps={{ min: 0 }}
//                 sx={{ width: '80px' }}
//               />
//               <Typography>.</Typography>
//               <TextField
//                 label="Minor"
//                 type="number"
//                 size="small"
//                 value={minorVersion}
//                 onChange={handleMinorVersionChange}
//                 inputProps={{ min: 0 }}
//                 sx={{ width: '80px' }}
//               />
//               <Typography>.</Typography>
//               <TextField
//                 label="Patch"
//                 type="number"
//                 size="small"
//                 value={patchVersion}
//                 onChange={handlePatchVersionChange}
//                 inputProps={{ min: 0 }}
//                 sx={{ width: '80px' }}
//               />
//             </Box>
//           </Box>
          
//           <TextField
//             label="نسخه"
//             fullWidth
//             value={customVersion}
//             onChange={handleCustomVersionChange}
//             helperText="فرمت پیشنهادی: X.Y.Z"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>انصراف</Button>
//           <Button onClick={handleApplyCustomVersion} variant="contained">
//             تایید
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default VersionSelector;
