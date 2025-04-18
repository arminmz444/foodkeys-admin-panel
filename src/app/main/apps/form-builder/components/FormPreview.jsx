"use client"
import { useFormContext } from "react-hook-form"
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormHelperText,
  Box,
  Divider,
} from "@mui/material"

function FormPreview({ form = { title: "", description: "", components: [] }, isInteractive = false }) {
  const formMethods = useFormContext()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods || {}

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data)
    alert("Form submitted successfully! Check console for data.")
  }

  const renderComponentPreview = (component) => {
    const hasError = errors && errors[component.name]
    const errorMessage = hasError?.message

    switch (component.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "number":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="number"
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "select":
        return (
          <FormControl fullWidth size="small" variant="outlined" margin="normal" error={!!hasError}>
            <InputLabel>{component.label}</InputLabel>
            <Select
              label={component.label}
              defaultValue={component.defaultValue || ""}
              disabled={!isInteractive}
              {...(isInteractive && register ? register(component.name) : {})}
            >
              {component.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      case "multiselect":
        return (
          <FormControl fullWidth size="small" variant="outlined" margin="normal" error={!!hasError}>
            <InputLabel>{component.label}</InputLabel>
            <Select
              label={component.label}
              multiple
              defaultValue={component.defaultValue ? [component.defaultValue] : []}
              disabled={!isInteractive}
              {...(isInteractive && register ? register(component.name) : {})}
            >
              {component.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      case "textarea":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            multiline
            rows={3}
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "checkbox":
        return (
          <FormControl margin="normal" error={!!hasError} fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={component.defaultValue === "true" || component.defaultValue === true}
                  disabled={!isInteractive}
                  {...(isInteractive && register ? register(component.name) : {})}
                />
              }
              label={component.label}
            />
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      case "radio":
        return (
          <FormControl component="fieldset" margin="normal" error={!!hasError} fullWidth>
            <Typography variant="subtitle2">{component.label}</Typography>
            <RadioGroup
              defaultValue={component.defaultValue || ""}
              {...(isInteractive && register ? register(component.name) : {})}
            >
              {component.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={!isInteractive} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      case "email":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="email"
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "url":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="url"
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "tel":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="tel"
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "date":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="date"
            variant="outlined"
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      case "time":
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            type="time"
            variant="outlined"
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
      default:
        return (
          <TextField
            fullWidth
            label={component.label}
            placeholder={component.placeholder}
            variant="outlined"
            size="small"
            margin="normal"
            disabled={!isInteractive}
            defaultValue={component.defaultValue}
            {...(isInteractive && register ? register(component.name) : {})}
            error={!!hasError}
            helperText={errorMessage}
          />
        )
    }
  }

  const FormContent = () => (
    <>
      <Typography variant="h5" className="mb-4">
        {form.title || "Form Preview"}
      </Typography>

      {form.description && (
        <Typography variant="body2" className="mb-6 text-gray-600">
          {form.description}
        </Typography>
      )}

      <Divider className="my-4" />

      <div className="space-y-4">
        {form.components &&
          form.components.map((component) => (
            <div key={component.id} className="mb-4">
              {renderComponentPreview(component)}
            </div>
          ))}
      </div>

      <Box className="mt-8 flex justify-between">
        <Button variant="outlined" type={isInteractive ? "reset" : "button"}>
          Reset
        </Button>
        <Button variant="contained" color="primary" type={isInteractive ? "submit" : "button"}>
          Submit
        </Button>
      </Box>
    </>
  )

  return (
    <Paper elevation={0} className="p-6 border rounded-lg">
      {isInteractive && formMethods && handleSubmit ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContent />
        </form>
      ) : (
        <FormContent />
      )}
    </Paper>
  )
}

export default FormPreview

