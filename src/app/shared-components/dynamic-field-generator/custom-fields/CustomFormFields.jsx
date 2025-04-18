import { connectField } from 'uniforms';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Box
} from '@mui/material';
import AsyncSelect from 'react-select/async';

const CustomUniformsLongTextField = connectField(({ onChange, label, placeholder, error, value }) => {
  return (
    <TextField
      id="outlined-multiline-static"
      placeholder={placeholder}
      label={label || 'توضیحات'}
      className="my-12"
      multiline
      fullWidth
      rows={4}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error?.message}
    />
  );
});

const ImageField = connectField(({ onChange, value, label }) => {
  return (
    <div className="ImageField my-12">
      <label htmlFor="image-field-file-input">
        <div>{label || 'آپلود عکس'}</div>
        <img
          alt=""
          style={{ cursor: 'pointer', width: '300px', height: '250px', objectFit: 'cover', borderRadius: '4px' }}
          src={value || 'https://picsum.photos/150?grayscale'}
        />
      </label>
      <input
        accept="image/*"
        id="image-field-file-input"
        onChange={({ target: { files } }) => {
          if (files && files[0]) {
            onChange(URL.createObjectURL(files[0]));
          }
        }}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  );
});

const CustomUniformsSelect = connectField(({ onChange, label, options, error, value, placeholder }) => {
  return (
    <FormControl fullWidth error={!!error} className="my-12">
      <InputLabel id={`custom-select-${label}`}>{label}</InputLabel>
      <Select
        id={`custom-select-${label}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        placeholder={placeholder}
      >
        {(options || []).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
});

const CustomUniformsAsyncSelect = connectField(({ onChange, label, loadOptions, error, value, placeholder }) => {
  return (
    <Box className="my-12">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onChange={(selected) => onChange(selected.value)}
        placeholder={placeholder || label}
        className={error ? 'error-select' : ''}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  );
});

const CustomUniformsCheckbox = connectField(({ onChange, label, error, value }) => {
  return (
    <FormControl fullWidth error={!!error} className="my-12">
      <FormControlLabel
        control={
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            color="secondary"
          />
        }
        label={label}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
});

const SubmitField = ({ variant = 'contained', type = 'submit', color = 'secondary', label = 'ثبت', loading = false }) => {
  return (
    <Box position="relative">
      <Button
        variant={variant}
        type={type}
        color={color}
        disabled={loading}
      >
        {label}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};

export {
  CustomUniformsLongTextField,
  ImageField,
  CustomUniformsSelect,
  CustomUniformsAsyncSelect,
  CustomUniformsCheckbox,
  SubmitField
};