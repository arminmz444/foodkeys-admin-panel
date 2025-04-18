"use client"
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
  IconButton,
} from "@mui/material"
import { Delete as DeleteIcon } from "@mui/icons-material"

// Comparison operators
const comparisonOperators = [
  { id: "equals", label: "equals" },
  { id: "not_equals", label: "not equals" },
  { id: "contains", label: "contains" },
  { id: "not_contains", label: "not contains" },
  { id: "greater_than", label: "greater than" },
  { id: "less_than", label: "less than" },
  { id: "starts_with", label: "starts with" },
  { id: "ends_with", label: "ends with" },
]

// Dummy data for company, user, and form (replace with actual data fetching)
const company = { id: "company123" }
const user = { id: "user456" }
const form = { id: "form789" }

function ValidationRuleEditor({ component, validation, onUpdate, onDelete, onAddLogicalOperator, index, isLast }) {
  return (
    <Paper elevation={0} className="p-4 border border-gray-200 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <Typography variant="subtitle2">
          {index > 0 && (
            <span className="px-2 py-1 bg-gray-100 rounded mr-2">{validation.logicalOperator || "AND"}</span>
          )}
          Rule {index + 1}
        </Typography>
        <IconButton size="small" onClick={() => onDelete(validation.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="space-y-3">
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Field Name</InputLabel>
          <Select
            label="Field Name"
            value={validation.field}
            onChange={(e) => onUpdate(validation.id, { field: e.target.value })}
          >
            <MenuItem value={component.name}>{component.name}</MenuItem>
            <MenuItem value={company.id}>{company.id}</MenuItem>
            <MenuItem value={user.id}>{user.id}</MenuItem>
            <MenuItem value={form.id}>{form.id}</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Comparison</InputLabel>
          <Select
            label="Comparison"
            value={validation.operator}
            onChange={(e) => onUpdate(validation.id, { operator: e.target.value })}
          >
            {comparisonOperators.map((op) => (
              <MenuItem key={op.id} value={op.id}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Value"
          value={validation.value}
          onChange={(e) => onUpdate(validation.id, { value: e.target.value })}
          variant="outlined"
          size="small"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={validation.caseSensitive}
              onChange={(e) => onUpdate(validation.id, { caseSensitive: e.target.checked })}
            />
          }
          label="Case sensitivity?"
        />
      </div>

      {isLast && (
        <div className="mt-3 flex space-x-2">
          <Button variant="outlined" size="small" onClick={() => onAddLogicalOperator(validation.id, "AND")}>
            AND
          </Button>
          <Button variant="outlined" size="small" onClick={() => onAddLogicalOperator(validation.id, "OR")}>
            OR
          </Button>
        </div>
      )}
    </Paper>
  )
}

export default ValidationRuleEditor

