// src/components/FilterDrawer.jsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useGetCategoriesQuery } from '../../FoodIndustryBankApi';

// Request status options
const requestStatusOptions = [
  { value: null, label: 'همه وضعیت‌ها' },
  { value: 0, label: 'ثبت اولیه' },
  { value: 1, label: 'در انتظار' },
  { value: 2, label: 'تایید شده' },
  { value: 3, label: 'رد شده' }
];

// Request type options
const requestTypeOptions = [
  { value: null, label: 'همه درخواست‌ها' },
  { value: 1, label: 'درخواست ایجاد شرکت' },
  { value: 2, label: 'درخواست ویرایش شرکت' },
  { value: 3, label: 'درخواست حذف شرکت' },
  { value: 5, label: 'درخواست بازبینی' },
  { value: 6, label: 'ثبت شرکت' },
  { value: 9, label: 'به‌روزرسانی شرکت' },
  { value: 11, label: 'بررسی' }
];

/**
 * FilterDrawer Component - Drawer for filtering company requests
 * 
 * @param {Object} props Component props
 * @param {boolean} props.open Whether the drawer is open
 * @param {Function} props.onClose Function to close the drawer
 * @param {Object} props.filters Current filter values
 * @param {Function} props.onApply Function to apply filters
 * @param {boolean} props.isLoading Whether the main component is loading
 */
export default function FilterDrawer({ open, onClose, filters, onApply, isLoading }) {
  // Local state for filters
  const [localFilters, setLocalFilters] = useState({
    status: null,
    type: null,
    search: '',
    categoryId: null
  });

  // Fetch categories for the dropdown using RTK Query
  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useGetCategoriesQuery(undefined, {
    // Skip fetching if drawer is closed
    skip: !open
  });

  // Update local filters when prop filters change
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [filters, open]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters and close drawer
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    setLocalFilters({
      status: null,
      type: null,
      search: '',
      categoryId: null
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
          borderRadius: '0'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" display="flex" alignItems="center">
          <Filter size={20} className="mr-2" />
          فیلتر درخواست‌ها
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="جستجو"
          name="search"
          value={localFilters.search || ''}
          onChange={handleChange}
          placeholder="نام شرکت، نام کاربر و..."
          variant="outlined"
          helperText="جستجو بر اساس نام شرکت، نام درخواست‌کننده"
        />

        <FormControl fullWidth>
          <InputLabel>وضعیت درخواست</InputLabel>
          <Select
            name="status"
            value={localFilters.status}
            onChange={handleChange}
            label="وضعیت درخواست"
          >
            {requestStatusOptions.map(option => (
              <MenuItem key={`status-${option.value || 'null'}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>فیلتر بر اساس وضعیت درخواست</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>نوع درخواست</InputLabel>
          <Select
            name="type"
            value={localFilters.type}
            onChange={handleChange}
            label="نوع درخواست"
          >
            {requestTypeOptions.map(option => (
              <MenuItem key={`type-${option.value || 'null'}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>فیلتر بر اساس نوع درخواست</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>دسته‌بندی شرکت</InputLabel>
          <Select
            name="categoryId"
            value={localFilters.categoryId}
            onChange={handleChange}
            label="دسته‌بندی شرکت"
            disabled={isCategoriesLoading}
            endAdornment={isCategoriesLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}
          >
            <MenuItem value={null}>همه دسته‌بندی‌ها</MenuItem>
            {categories?.map(category => (
              <MenuItem key={`category-${category.id}`} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>فیلتر بر اساس دسته‌بندی شرکت</FormHelperText>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            startIcon={<RotateCcw size={16} />}
            disabled={isLoading}
          >
            پاک کردن فیلترها
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            startIcon={<Filter size={16} />}
            color="primary"
            disabled={isLoading}
          >
            اعمال فیلتر
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}