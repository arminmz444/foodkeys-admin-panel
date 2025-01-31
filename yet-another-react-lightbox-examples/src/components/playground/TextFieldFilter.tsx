import TextField from "@mui/material/TextField";

import Filter from "./Filter";

export type TextFieldFilterProps = {
  label: string;
  helperText?: string;
  error?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export default function TextFieldFilter({
  label,
  helperText,
  error,
  value,
  onChange,
}: TextFieldFilterProps) {
  return (
    <Filter>
      <TextField
        fullWidth
        size="small"
        variant="standard"
        label={label}
        helperText={helperText}
        error={error}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Filter>
  );
}
