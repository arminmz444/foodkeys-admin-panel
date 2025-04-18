import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Collapse, 
  Divider, 
  FormControl, 
  Grid, 
  IconButton, 
  InputAdornment,
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  TextField, 
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumericFormat } from 'react-number-format';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import { MdFilterAlt, MdOutlineFilterAltOff } from 'react-icons/md';
import dayjs from 'dayjs';

function BundleFilterForm({ onFilter }) {
  const [expanded, setExpanded] = useState(false);
  
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      minPrice: '',
      maxPrice: '',
      timeDuration: '',
      status: '',
      createdAfter: null,
      createdBefore: null,
    }
  });

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleFilter = (data) => {
    // Convert price values from formatted string to numbers
    if (data.minPrice) {
      data.minPrice = Number(data.minPrice.replace(/[^\d]/g, ''));
    }
    
    if (data.maxPrice) {
      data.maxPrice = Number(data.maxPrice.replace(/[^\d]/g, ''));
    }
    
    // Format dates for API
    if (data.createdAfter) {
      data.createdAfter = dayjs(data.createdAfter).format('YYYY-MM-DDTHH:mm:ss');
    }
    
    if (data.createdBefore) {
      data.createdBefore = dayjs(data.createdBefore).format('YYYY-MM-DDTHH:mm:ss');
    }
    
    onFilter(data);
  };

  const handleReset = () => {
    reset({
      title: '',
      minPrice: '',
      maxPrice: '',
      timeDuration: '',
      status: '',
      createdAfter: null,
      createdBefore: null,
    });
    
    onFilter({});
  };

  return (
    <Paper className="w-full mb-32 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-16 py-12 border-b">
        <div className="flex items-center">
          <FuseSvgIcon className="mr-8" color="action">heroicons-outline:filter</FuseSvgIcon>
          <Typography className="font-semibold">فیلترها</Typography>
        </div>
        <div>
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <MdOutlineFilterAltOff /> : <MdFilterAlt />}
          </IconButton>
        </div>
      </div>

      <Collapse in={expanded}>
        <div className="p-16">
          <form onSubmit={handleSubmit(handleFilter)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="عنوان"
                      placeholder="جستجو بر اساس عنوان"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="minPrice"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={TextField}
                      thousandSeparator
                      valueIsNumericString
                      suffix=" تومان"
                      variant="outlined"
                      label="حداقل قیمت"
                      placeholder="حداقل قیمت"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={TextField}
                      thousandSeparator
                      valueIsNumericString
                      suffix=" تومان"
                      variant="outlined"
                      label="حداکثر قیمت"
                      placeholder="حداکثر قیمت"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="timeDuration"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="time-duration-label">مدت زمان (ماه)</InputLabel>
                      <Select
                        {...field}
                        labelId="time-duration-label"
                        label="مدت زمان (ماه)"
                      >
                        <MenuItem value="">همه</MenuItem>
                        <MenuItem value="1">1 ماه</MenuItem>
                        <MenuItem value="2">2 ماه</MenuItem>
                        <MenuItem value="3">3 ماه</MenuItem>
                        <MenuItem value="6">6 ماه</MenuItem>
                        <MenuItem value="12">12 ماه</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-label">وضعیت</InputLabel>
                      <Select
                        {...field}
                        labelId="status-label"
                        label="وضعیت"
                      >
                        <MenuItem value="">همه</MenuItem>
                        <MenuItem value="ACTIVE">فعال</MenuItem>
                        <MenuItem value="INACTIVE">غیرفعال</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="createdAfter"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="ایجاد شده بعد از"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="createdBefore"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="ایجاد شده قبل از"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <div className="flex justify-end mt-16 gap-8">
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleReset}
                startIcon={<FuseSvgIcon>heroicons-outline:refresh</FuseSvgIcon>}
              >
                پاک کردن
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
              >
                جستجو
              </Button>
            </div>
          </form>
        </div>
      </Collapse>
    </Paper>
  );
}

export default BundleFilterForm;