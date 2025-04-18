import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Button, 
  Typography, 
  Box, 
  TextField, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  InputAdornment,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  ViewModule as GridViewIcon, 
  ViewList as ListViewIcon,
  Compare as CompareIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { 
  setSearchText, 
  resetSearchText, 
  setSelectedEntityType, 
  setSelectedArchiveType, 
  setSelectedTimeRange, 
  setViewMode, 
  toggleCompareMode, 
  resetFilters,
  selectCompareMode, 
  selectViewMode,
  selectSelectedEntityType,
  selectSelectedArchiveType,
  selectSelectedTimeRange,
  selectSearchText
} from './store/archiveAppSlice';

function ArchiveHeader({ archiveTypes, onShowSnackbar }) {
  const dispatch = useDispatch();
  const compareMode = useSelector(selectCompareMode);
  const viewMode = useSelector(selectViewMode);
  const selectedEntityType = useSelector(selectSelectedEntityType);
  const selectedArchiveType = useSelector(selectSelectedArchiveType);
  const selectedTimeRange = useSelector(selectSelectedTimeRange);
  const searchText = useSelector(selectSearchText);
  
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [timeRanges] = useState([
    { id: 'today', label: 'امروز' },
    { id: 'yesterday', label: 'دیروز' },
    { id: 'last7days', label: 'هفت روز گذشته' },
    { id: 'last30days', label: '30 روز گذشته' },
    { id: 'thisMonth', label: 'این ماه' },
    { id: 'lastMonth', label: 'ماه قبل' },
  ]);
  
  const [entityTypes] = useState([
    { value: 'Company', label: 'شرکت' },
    { value: 'Product', label: 'محصول' },
    { value: 'User', label: 'کاربر' },
    { value: 'Invoice', label: 'فاکتور' },
  ]);

  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleToggleCompareMode = () => {
    dispatch(toggleCompareMode());
    if (!compareMode.active) {
      onShowSnackbar('برای مقایسه دو آرشیو، آنها را انتخاب کنید', 'info');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        مدیریت آرشیوها
      </Typography>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 space-x-8">
        <Paper className="flex items-center w-full sm:max-w-256 space-x-8 px-8 rounded-full border-1">
          <TextField
            placeholder="جستجو در آرشیوها"
            className="flex flex-1"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => dispatch(resetSearchText())}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            variant="standard"
            value={searchText}
            onChange={(ev) => dispatch(setSearchText(ev.target.value))}
          />
        </Paper>

        <Box className="flex items-center space-x-8">
          {/* Filter button */}
          <Tooltip title="فیلتر">
            <IconButton 
              onClick={handleOpenFilterMenu}
              color={selectedEntityType || selectedArchiveType || selectedTimeRange ? "primary" : "default"}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleCloseFilterMenu}
            PaperProps={{
              style: {
                width: 300,
                padding: 16
              },
            }}
          >
            <Typography className="px-16 py-8 font-medium">فیلترها</Typography>
            
            <FormControl fullWidth className="px-16 py-8">
              <InputLabel>نوع موجودیت</InputLabel>
              <Select
                value={selectedEntityType || ''}
                label="نوع موجودیت"
                onChange={(e) => dispatch(setSelectedEntityType(e.target.value))}
              >
                <MenuItem value="">
                  <em>همه</em>
                </MenuItem>
                {entityTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth className="px-16 py-8">
              <InputLabel>نوع آرشیو</InputLabel>
              <Select
                value={selectedArchiveType || ''}
                label="نوع آرشیو"
                onChange={(e) => dispatch(setSelectedArchiveType(e.target.value))}
              >
                <MenuItem value="">
                  <em>همه</em>
                </MenuItem>
                {archiveTypes?.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth className="px-16 py-8">
              <InputLabel>بازه زمانی</InputLabel>
              <Select
                value={selectedTimeRange || ''}
                label="بازه زمانی"
                onChange={(e) => dispatch(setSelectedTimeRange(e.target.value))}
              >
                <MenuItem value="">
                  <em>همه</em>
                </MenuItem>
                {timeRanges.map((range) => (
                  <MenuItem key={range.id} value={range.id}>{range.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Divider className="my-16" />
            
            <Box className="px-16 py-8 flex justify-between">
              <Button variant="text" onClick={() => dispatch(resetFilters())}>
                پاک کردن همه
              </Button>
              <Button variant="contained" onClick={handleCloseFilterMenu}>
                اعمال فیلتر
              </Button>
            </Box>
          </Menu>
          
          {/* View mode toggle */}
          <Tooltip title={viewMode === 'grid' ? 'حالت لیست' : 'حالت شبکه‌ای'}>
            <IconButton onClick={() => dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'))}>
              {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Compare mode toggle */}
          <Tooltip title={compareMode.active ? 'لغو مقایسه' : 'مقایسه آرشیوها'}>
            <IconButton 
              onClick={handleToggleCompareMode}
              color={compareMode.active ? "primary" : "default"}
            >
              <CompareIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Display active filters */}
        {(selectedEntityType || selectedArchiveType || selectedTimeRange) && (
          <Box className="flex flex-wrap gap-8 mt-8">
            {selectedEntityType && (
              <Chip 
                label={`نوع موجودیت: ${entityTypes.find(t => t.value === selectedEntityType)?.label || selectedEntityType}`}
                onDelete={() => dispatch(setSelectedEntityType(null))}
                size="small"
              />
            )}
            {selectedArchiveType && (
              <Chip 
                label={`نوع آرشیو: ${archiveTypes?.find(t => t.value === selectedArchiveType)?.label || selectedArchiveType}`}
                onDelete={() => dispatch(setSelectedArchiveType(null))}
                size="small"
              />
            )}
            {selectedTimeRange && (
              <Chip 
                label={`بازه زمانی: ${timeRanges.find(r => r.id === selectedTimeRange)?.label || selectedTimeRange}`}
                onDelete={() => dispatch(setSelectedTimeRange(null))}
                size="small"
              />
            )}
          </Box>
        )}
      </div>
    </div>
  );
}

export default ArchiveHeader;