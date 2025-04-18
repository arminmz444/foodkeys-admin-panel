// src/app/shared-components/FormDateTimePicker.jsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

// Custom icon for the calendar
const CalendarIcon = (props) => <FuseSvgIcon {...props}>heroicons-outline:calendar</FuseSvgIcon>;

// Function to convert date to "YYYY-MM-DD HH:MM:SS" format
function formatDateForApi(date) {
  if (!date) return null;
  
  const pad = (number) => (number < 10 ? '0' + number : number);
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to parse "YYYY-MM-DD HH:MM:SS" to Date object
function parseApiDateString(dateString) {
  if (!dateString) return new Date();
  
  // Check if the format is "YYYY-MM-DD HH:MM:SS"
  if (dateString.includes(' ') && dateString.length === 19) {
    // Replace space with 'T' and add 'Z' to create a valid ISO format
    // Note: This assumes the time is in local timezone
    return new Date(dateString.replace(' ', 'T'));
  }
  
  // If it's already in ISO format or another format, let Date constructor handle it
  return new Date(dateString);
}

function FormDateTimePicker({ name, label, className = '', minDateTime = new Date(), ...props }) {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const errorMessage = errors[name]?.message;
  
  return (
    <FormControl
      error={!!errorMessage}
      className={`w-full ${className}`}
      fullWidth
    >
      {label && (
        <FormLabel className="mb-2 font-medium text-14" component="legend">
          {label}
        </FormLabel>
      )}
     
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <DateTimePicker
            value={value ? parseApiDateString(value) : new Date()}
            onChange={(val) => {
              // Format the date as "YYYY-MM-DD HH:MM:SS"
              if (val) {
                const formattedDate = formatDateForApi(val);
                onChange(formattedDate);
              } else {
                onChange(null);
              }
            }}
            minDateTime={minDateTime}
            className="w-full"
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                error: !!errorMessage,
                helperText: errorMessage,
                dir: "rtl",
              },
              actionBar: {
                actions: ["clear", "today"],
              }
            }}
            slots={{
              openPickerIcon: CalendarIcon
            }}
            {...props}
          />
        )}
      />
      
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

export default FormDateTimePicker;